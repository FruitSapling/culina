// frontend/MyChatbotApp/InventoryContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Ingredient = {
  id: string;
  name: string;
  image: string;
  category: "Fridge" | "Freezer" | "Pantry";
};

type InventoryContextType = {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  selectedCategory: "All" | "Fridge" | "Freezer" | "Pantry";
  setSelectedCategory: React.Dispatch<React.SetStateAction<"All" | "Fridge" | "Freezer" | "Pantry">>;
};


const InventoryContext = createContext<InventoryContextType>({
  inventory: [],
  setInventory: () => {},
  selectedCategory: "All",
  setSelectedCategory: () => {},
});

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Fridge" | "Freezer" | "Pantry">("All");

  // Load inventory from AsyncStorage when the app starts
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const storedInventory = await AsyncStorage.getItem("userInventory");
        if (storedInventory) {
          setInventory(JSON.parse(storedInventory));
        }
      } catch (error) {
        console.error("Error loading inventory from AsyncStorage:", error);
      }
    };
    loadInventory();
  }, []);

  // Save inventory to AsyncStorage whenever it changes
  useEffect(() => {
    const saveInventory = async () => {
      try {
        await AsyncStorage.setItem("userInventory", JSON.stringify(inventory));
      } catch (error) {
        console.error("Error saving inventory to AsyncStorage:", error);
      }
    };
    // You can decide if you only want to save when there are items, or on every change
    saveInventory();
  }, [inventory]);

  return (
    <InventoryContext.Provider value={{ inventory, setInventory, selectedCategory, setSelectedCategory }}>
      {children}
    </InventoryContext.Provider>
  );
};
