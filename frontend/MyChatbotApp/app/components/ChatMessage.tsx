// components/ChatMessage.tsx
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
  const isBot = message.sender === "bot";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isBot ? "flex-start" : "flex-end",
        paddingHorizontal: 12,
        marginBottom: 8,
      }}
    >
      <View
        style={[
          styles.bubble,
          isBot ? styles.botBubble : styles.userBubble,
          { flexShrink: 1, maxWidth: "85%" },
        ]}
      >
        <Text style={styles.senderLabel}>{isBot ? "Culina:" : "You:"}</Text>
        <TouchableOpacity
          disabled={!isBot}
          onPress={() => onExpand?.(message.text)}
          activeOpacity={0.8}
          style={{ flexShrink: 1 }}
        >
          <Markdown style={markdownStyles}>{message.text}</Markdown>
        </TouchableOpacity>
      </View>
    </View>
  );
}
