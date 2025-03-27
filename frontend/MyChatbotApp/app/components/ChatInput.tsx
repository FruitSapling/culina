import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../ChatScreen.styles";

type ChatInputProps = {
  message: string;
  onChange: (text: string) => void;
  onSend: () => void;
};

export default function ChatInput({ message, onChange, onSend }: ChatInputProps) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={message}
        onChangeText={onChange}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
