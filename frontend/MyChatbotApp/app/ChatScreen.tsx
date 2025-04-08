// Updated ChatScreen using styles from ChatScreen.styles.ts and Culina-native theme
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ExpandedMessageOverlay from './components/ExpandedMessageOverlay';
import { useInventory } from './InventoryContext';
import useChat from './hooks/useChat';
import TypingIndicator from './components/TypingIndicator';
import styles from './ChatScreen.styles';

export default function ChatScreen() {
  const { inventory } = useInventory();
  const [message, setMessage] = useState('');
  const { chat, sendMessage, isBotTyping } = useChat(inventory);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const renderChatItem = ({ item }) => {
    if (item.type === 'typing') return <TypingIndicator />;
    if (!item || !item.text) return null;
    return <ChatMessage message={item} onExpand={setExpandedMessage} />;
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chat]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={isBotTyping ? [...chat, { id: 'typing-indicator', type: 'typing' }] : chat}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          style={styles.chatList}
        />

        <View style={styles.inputContainer}>
          <ChatInput
            message={message}
            onChange={setMessage}
            onSend={() => {
              sendMessage(message);
              setMessage('');
            }}
          />
        </View>

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
