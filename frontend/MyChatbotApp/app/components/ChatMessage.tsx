import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import styles, { markdownStyles } from "../ChatScreen.styles";
import { theme } from "../theme";

type ChatMessageProps = {
  message: {
    id: string;
    sender: "user" | "bot";
    text: string;
  };
  onExpand?: (text: string) => void;
};

const CULINA_ICON = require("../../assets/images/culina-logo-no-text.png");

export default function ChatMessage({ message, onExpand }: ChatMessageProps) {
  const isBot = message.sender === "bot";

  return (
    <View
      style={[
        localStyles.messageRow,
        { justifyContent: isBot ? "flex-start" : "flex-end" },
      ]}
    >
      {isBot && <Image source={CULINA_ICON} style={localStyles.avatar} />}

      <View
        style={[
          styles.bubble,
          isBot ? styles.botBubble : styles.userBubble,
          { flexShrink: 1, maxWidth: "85%" },
        ]}
      >
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

const localStyles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    resizeMode: "contain",
  },
});
