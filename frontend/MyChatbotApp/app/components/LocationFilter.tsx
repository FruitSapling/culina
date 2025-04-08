import React from "react";
import { ScrollView, Text, TouchableOpacity} from "react-native";
import { useInventory } from "../InventoryContext";
import { theme } from "../theme";

const locations = ["All", "Fridge", "Freezer", "Pantry"] as const;

export default function LocationFilter() {
  const { selectedCategory, setSelectedCategory } = useInventory();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        gap: theme.spacing.sm,
        alignItems: "center",
      }}
      style={{ marginBottom: theme.spacing.md }}
    >
      {locations.map((location) => {
        const isActive = selectedCategory === location;

        return (
          <TouchableOpacity
            key={location}
            onPress={() => setSelectedCategory(location)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: isActive ? theme.colors.primary : "#f3f4f6",
              borderRadius: 999,
              borderWidth: 1,
              borderColor: isActive ? theme.colors.primary : "#d1d5db",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isActive ? "#fff" : "#374151",
              }}
            >
              {location}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
