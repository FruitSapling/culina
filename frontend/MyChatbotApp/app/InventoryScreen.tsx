// /mychatbotapp/app/inventory.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { useInventory, Ingredient } from "./InventoryContext";
import { API_BASE_URL } from "../config"; // Import the base URL

async function fetchImageUrl(query: string): Promise<string> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images?ingredient=${encodeURIComponent(query)}` // Use the base URL
    );
    const data = await response.json();
    return data.imageUrl || "https://via.placeholder.com/60?text=No+Image";
  } catch (error) {
    console.error(`Error fetching image for "${query}":`, error);
    return "https://via.placeholder.com/60?text=No+Image";
  }
}

export default function InventoryScreen() {
  const { inventory, setInventory } = useInventory();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newIngredientName, setNewIngredientName] = useState<string>("");
  const [newIngredientCategory, setNewIngredientCategory] = useState<
    "Fridge" | "Freezer" | "Pantry"
  >("Pantry");

  // Fetch images for all ingredients once on mount
  useEffect(() => {
    async function updateImages() {
      const updatedData = await Promise.all(
        inventory.map(async (ingredient) => {
          if (!ingredient.image) {
            const imageUrl = await fetchImageUrl(ingredient.name);
            return { ...ingredient, image: imageUrl };
          }
          return ingredient;
        })
      );
      setInventory(updatedData);
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
    setInventory((prev) =>
      prev.filter((ingredient) => !selectedIds.includes(ingredient.id))
    );
    setSelectedIds([]);
  };

  const addIngredient = () => {
    const newId = (inventory.length + 1).toString();
    const newIngredient: Ingredient = {
      id: newId,
      name: newIngredientName,
      image: "",
      category: newIngredientCategory,
    };
    setInventory([...inventory, newIngredient]);
    setModalVisible(false);
    setNewIngredientName("");

    fetchImageUrl(newIngredient.name).then((imgUrl) => {
      setInventory((prev) =>
        prev.map((ing) => (ing.id === newId ? { ...ing, image: imgUrl } : ing))
      );
    });
  };

  const renderItem = ({ item }: { item: Ingredient }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelection(item.id)}
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
      >
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/60?text=No+Image",
          }}
          style={styles.itemImage}
        />
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#56ab2f" />
        <Text style={styles.loadingText}>Loading inventory images...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with management buttons */}
      <View style={styles.header}>
        <Button title="Add Ingredient" onPress={() => setModalVisible(true)} />
        {selectedIds.length > 0 && (
          <Button title="Delete Selected" onPress={deleteSelected} color="red" />
        )}
      </View>
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
      {/* Modal for adding new ingredient */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Ingredient</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingredient Name"
              value={newIngredientName}
              onChangeText={setNewIngredientName}
            />
            <View style={styles.categoryContainer}>
              {(["Fridge", "Freezer", "Pantry"] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    newIngredientCategory === cat && styles.selectedCategoryButton,
                  ]}
                  onPress={() => setNewIngredientCategory(cat)}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button
                title="Add"
                onPress={addIngredient}
                disabled={!newIngredientName.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  listContainer: { paddingBottom: 100 },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedItem: { borderWidth: 2, borderColor: "#56ab2f" },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  categoryButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCategoryButton: { borderColor: "#56ab2f", backgroundColor: "#e6f7e6" },
  categoryText: { fontSize: 14 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});

