import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import styles from "./InventoryScreen.styles";
import { useInventory, Ingredient } from "./InventoryContext";
import { API_BASE_URL } from "../config";
import LocationFilter from "./components/LocationFilter";
import { theme } from "./theme";
import Button from "./components/Button";

async function fetchImageUrl(query: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/images?ingredient=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.imageUrl || "https://via.placeholder.com/60?text=No+Image";
  } catch (error) {
    console.error(`Error fetching image for "${query}":`, error);
    return "https://via.placeholder.com/60?text=No+Image";
  }
}

function getCategoryStyle(category: Ingredient["category"]) {
  switch (category) {
    case "Freezer":
      return { backgroundColor: "#DBF0FF", color: "#1E3A8A" };
    case "Fridge":
      return { backgroundColor: "#D1FADF", color: "#065F46" };
    case "Pantry":
    default:
      return { backgroundColor: "#F3F4F6", color: "#374151" };
  }
}

export default function InventoryScreen() {
  const { inventory, setInventory, selectedCategory } = useInventory();
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [reviewList, setReviewList] = useState<{ id: string; name: string }[]>([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);


  useEffect(() => {
    async function updateImages() {
      const updated = await Promise.all(
        inventory.map(async (ingredient) => {
          if (!ingredient.image) {
            const imageUrl = await fetchImageUrl(ingredient.name);
            return { ...ingredient, image: imageUrl };
          }
          return ingredient;
        })
      );
      setInventory(updated);
      setLoading(false);
    }
    updateImages();
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    setInventory((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    setSelectMode(false);
  };

  const saveEdit = () => {
    if (editingItem) {
      const isNew = !inventory.find((i) => i.id === editingItem.id);
      if (isNew) {
        setInventory((prev) => [...prev, editingItem]);
      } else {
        setInventory((prev) =>
          prev.map((item) => (item.id === editingItem.id ? editingItem : item))
        );
      }
      setEditingItem(null);
    }
  };

  const handleScanPantry = async () => {
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

    setScanning(true);

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
    } finally {
      setScanning(false);
    }
  };

  const confirmReviewList = async () => {
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
    setInventory((prev) => [...prev, ...newItems]);
    setReviewList([]);
    setReviewModalVisible(false);
  };

  const filteredInventory =
    selectedCategory === "All"
      ? inventory
      : inventory.filter((item) => item.category === selectedCategory);

  const renderItem = ({ item }: { item: Ingredient }) => {
    const isSelected = selectedIds.includes(item.id);
    const categoryStyle = getCategoryStyle(item.category);

    return (
      <TouchableOpacity
        onPress={() => {
          if (selectMode) {
            toggleSelection(item.id);
          } else {
            setEditingItem(item);
          }
        }}
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
      >
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/60?text=No+Image" }}
          style={styles.itemImage}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        {item.amount && (
          <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{item.amount}</Text>
        )}
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Text
            style={{
              backgroundColor: categoryStyle.backgroundColor,
              color: categoryStyle.color,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 999,
              fontSize: 12,
            }}
          >
            {item.category}
          </Text>
          {item.expirationDate && (
            <Text style={{ fontSize: 12, color: "#6B7280", marginLeft: 8 }}>
              Expires: {item.expirationDate}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: theme.spacing.sm, marginTop: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.colors.primary }}>
          Inventory
        </Text>
        <Text style={{ fontSize: 14, color: "#6b7280" }}>Manage your ingredients</Text>
      </View>

      <LocationFilter />

      <TouchableOpacity
        onPress={() => setSelectMode(!selectMode)}
        style={{ alignSelf: "flex-end", marginBottom: theme.spacing.xs, marginRight: theme.spacing.sm }}
      >
        <Text style={{ color: theme.colors.primary, fontSize: 14, fontWeight: "500" }}>
          {selectMode ? "Cancel" : "Select"}
        </Text>
      </TouchableOpacity>

      {selectMode && selectedIds.length > 0 && (
        <Animated.View entering={FadeInUp} exiting={FadeOutDown} style={{ marginBottom: theme.spacing.sm }}>
          <Button title="Delete Selected" danger onPress={deleteSelected} />
        </Animated.View>
      )}

      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 140 }]}
      />

      {/* Edit/Add Modal */}
      <Modal visible={!!editingItem} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {inventory.find((i) => i.id === editingItem?.id) ? "Edit" : "Add"} Ingredient
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editingItem?.name || ""}
              onChangeText={(text) => setEditingItem((prev) => (prev ? { ...prev, name: text } : prev))}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={editingItem?.amount || ""}
              onChangeText={(text) => setEditingItem((prev) => (prev ? { ...prev, amount: text } : prev))}
            />
            <TextInput
              style={styles.input}
              placeholder="Expiration Date"
              value={editingItem?.expirationDate || ""}
              onChangeText={(text) => setEditingItem((prev) => (prev ? { ...prev, expirationDate: text } : prev))}
            />
            <View style={styles.categoryContainer}>
              {["Fridge", "Freezer", "Pantry"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    editingItem?.category === cat && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setEditingItem((prev) => (prev ? { ...prev, category: cat } : prev))}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancel" variant="secondary" onPress={() => setEditingItem(null)} />
              <Button title="Save" onPress={saveEdit} disabled={!editingItem?.name.trim()} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={reviewModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Review Detected Ingredients</Text>
            <ScrollView style={{ maxHeight: 300, marginBottom: 12 }}>
              {reviewList.map((item) => (
                <View key={item.id} style={styles.reviewItem}>
                  <TextInput
                    style={styles.input}
                    value={item.name}
                    onChangeText={(text) =>
                      setReviewList((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, name: text } : i))
                      )
                    }
                  />
                  <Button
                    title="Remove"
                    danger
                    onPress={() => setReviewList((prev) => prev.filter((i) => i.id !== item.id))}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <Button title="Cancel" variant="secondary" onPress={() => setReviewModalVisible(false)} />
              <Button title="Confirm" onPress={confirmReviewList} disabled={reviewList.length === 0} />
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      {!editingItem && !selectMode && (
        <View style={{ position: "absolute", right: 20, bottom: 32, alignItems: "flex-end" }}>
          <Animated.View style={{ overflow: "hidden" }}>
            {actionsVisible && (
              <Animated.View entering={FadeInUp} exiting={FadeOutDown} style={{ marginBottom: 12, width: 180 }}>
                <Button title="📷 Scan ingredients" onPress={handleScanPantry} />
              </Animated.View>
            )}
            {actionsVisible && (
              <Animated.View entering={FadeInUp.delay(50)} exiting={FadeOutDown} style={{ marginBottom: 12, width: 180 }}>
                <Button
                  title="Add ingredient"
                  onPress={() => {
                    setActionsVisible(false);
                    setEditingItem({
                      id: Date.now().toString(),
                      name: "",
                      image: "",
                      category: "Pantry",
                      amount: "",
                      expirationDate: "",
                    });
                  }}
                />
              </Animated.View>
            )}
          </Animated.View>
          <TouchableOpacity
            onPress={() => setActionsVisible((prev) => !prev)}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 999,
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              ...theme.shadow.medium,
            }}
          >
            <Text style={{ fontSize: 32, color: "white", marginTop: -4 }}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Scanning Modal */}
      <Modal visible={scanning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, fontSize: 16, color: "#333" }}>
              Scanning ingredients...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
