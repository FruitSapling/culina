// useChat.ts
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config";

export default function useChat(inventory: any) {
  const [chat, setChat] = useState<Array<{id: string; sender: string; text: string}>>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
    };
    // Create a new conversation history including the new message
    const currentHistory = [...chat, userMsg];
    // Immediately update the chat to show the user message
    setChat(currentHistory);
    setIsBotTyping(true);
    // Add a placeholder for the bot response
    setChat((prev) => [...prev, { id: "placeholder", sender: "bot", text: "" }]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, inventory, history: currentHistory }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      const botMsg = {
        id: Date.now().toString(),
        sender: "bot",
        text: data.response,
      };
      setChat((prev) =>
        prev.map((msg) => (msg.id === "placeholder" ? botMsg : msg))
      );
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMsg = {
        id: Date.now().toString(),
        sender: "bot",
        text: "Error: " + (error.message || "Unknown error"),
      };
      setChat((prev) =>
        prev.map((msg) => (msg.id === "placeholder" ? errorMsg : msg))
      );
    } finally {
      setIsBotTyping(false);
    }
  };

  return { chat, sendMessage, isBotTyping, setChat };
}
