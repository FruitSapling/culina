import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import styles, { markdownStyles } from "../ChatScreen.styles";

type ChatMessageProps = {
  message: {
    id: string;
    sender: "user" | "bot";
    text: string;
  };
  onExpand?: (text: string) => void;
};

export default function ChatMessage({ message, onExpand }: ChatMessageProps) {
  return message.sender === "bot" ? (
    <TouchableOpacity onPress={() => onExpand && onExpand(message.text)} activeOpacity={0.8}>
      <View style={[styles.bubble, styles.botBubble]}>
        <Text style={styles.senderLabel}>Culina:</Text>
        <Markdown style={markdownStyles}>{message.text}</Markdown>
      </View>
    </TouchableOpacity>
  ) : (
    <View style={[styles.bubble, styles.userBubble]}>
      <Text style={styles.senderLabel}>You:</Text>
      <Markdown style={markdownStyles}>{message.text}</Markdown>
    </View>
  );
}
