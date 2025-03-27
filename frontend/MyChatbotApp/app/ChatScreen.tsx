import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, FlatList, KeyboardAvoidingView, Platform, View, Text } from "react-native";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ExpandedMessageOverlay from "./components/ExpandedMessageOverlay";
import { useInventory } from "./InventoryContext";
import styles from "./ChatScreen.styles";
import useChat from "./hooks/useChat";
import TypingIndicator from "./components/TypingIndicator";


export default function ChatScreen() {
  const { inventory } = useInventory();
  const [message, setMessage] = useState("");
  const { chat, sendMessage, isBotTyping } = useChat(inventory);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const renderChatItem = ({ item }) => {
    if (item.type === "typing") {
      return <TypingIndicator />;
    }
  
    // Optional: guard against malformed messages
    if (!item || !item.text) return null;
  
    return <ChatMessage message={item} onExpand={setExpandedMessage} />;
  };
  

  // Whenever the chat updates, scroll to the end
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chat]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // Adjust this value as needed
    >
      <SafeAreaView style={styles.container}>
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={isBotTyping ? [...chat, { id: "typing-indicator", type: "typing" }] : chat}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          style={styles.chatList}
        />

        {/* Input Row */}
        <View style={styles.inputContainer}>
          <ChatInput
            message={message}
            onChange={setMessage}
            onSend={() => {
              sendMessage(message);
              setMessage("");
            }}
          />
        </View>

        {/* Expanded Overlay */}
        {expandedMessage !== null && (
          <ExpandedMessageOverlay
            message={expandedMessage}
            onClose={() => setExpandedMessage(null)}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
