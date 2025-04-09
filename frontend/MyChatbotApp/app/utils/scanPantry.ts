// /app/utils/scanPantry.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { API_BASE_URL } from "../../config";
import { Ingredient } from "../InventoryContext";

export async function fetchImageUrl(query: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/images?ingredient=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.imageUrl || "https://via.placeholder.com/60?text=No+Image";
  } catch (error) {
    console.error("Error fetching image:", error);
    return "https://via.placeholder.com/60?text=No+Image";
  }
}

export async function scanPantry(inventory: Ingredient[], setReviewList: Function, setReviewModalVisible: Function) {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("Permission denied", "Camera access is required to scan your pantry.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    base64: true,
    quality: 0.7,
  });

  if (result.canceled || !result.assets?.[0]?.base64) return;

  const base64 = result.assets[0].base64;
  const mimeType = "image/jpeg";
  const base64Image = `data:${mimeType};base64,${base64}`;

  try {
    const response = await fetch(`${API_BASE_URL}/ingredients-from-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    const data = await response.json();
    const ingredients: string[] = data.ingredients || [];

    const uniqueIngredients = ingredients.filter(
      (name) => !inventory.some((i) => i.name.toLowerCase() === name.toLowerCase())
    );

    const review = uniqueIngredients.map((name, i) => ({
      id: Date.now().toString() + i,
      name,
    }));

    setReviewList(review);
    setReviewModalVisible(true);
  } catch (error) {
    console.error("Scan error:", error);
    Alert.alert("Scan failed", "Try again later.");
  }
}

export async function confirmReviewList(
  reviewList: { id: string; name: string }[],
  setInventory: Function,
  setReviewList: Function,
  setReviewModalVisible: Function
) {
  const newItems: Ingredient[] = await Promise.all(
    reviewList.map(async (item, i) => {
      const image = await fetchImageUrl(item.name);
      return {
        id: Date.now().toString() + i,
        name: item.name,
        image,
        category: "Pantry",
        amount: "",
        expirationDate: "",
      };
    })
  );
  setInventory((prev: Ingredient[]) => [...prev, ...newItems]);
  setReviewList([]);
  setReviewModalVisible(false);
}
