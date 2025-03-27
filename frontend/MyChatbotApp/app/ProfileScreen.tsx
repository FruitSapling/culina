import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [preferences, setPreferences] = useState("");

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem("userPreferences");
        if (storedPreferences) {
          setPreferences(storedPreferences);
        }
      } catch (error) {
        console.error("Error loading preferences from AsyncStorage:", error);
      }
    };
    loadPreferences();
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem("userPreferences", preferences);
      } catch (error) {
        console.error("Error saving preferences to AsyncStorage:", error);
      }
    };
    savePreferences();
  }, [preferences]);

  const handleSave = () => {
    // Optionally, provide feedback that preferences were saved.
    alert("Preferences saved!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Your Dietary Preferences & Requirements
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="The food needs to be halal, I prefer not to cook with meat but sometimes do. Don't really like tomatoes. Prefer high-protein meals."
          multiline
          value={preferences}
          onChangeText={setPreferences}
        />
        <Button title="Save Preferences" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    textAlignVertical: "top", // ensures text starts at the top on Android
    marginBottom: 16,
  },
});
