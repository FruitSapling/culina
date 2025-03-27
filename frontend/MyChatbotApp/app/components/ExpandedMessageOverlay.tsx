// /mychatbotapp/app/components/ExpandedMessageOverlay.tsx
import React from "react";
import { TouchableWithoutFeedback, TouchableOpacity, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import styles, { markdownStyles } from "../ChatScreen.styles";

type ExpandedMessageOverlayProps = {
  message: string;
  onClose: () => void;
};

export default function ExpandedMessageOverlay({ message, onClose }: ExpandedMessageOverlayProps) {
  return (
    <View style={styles.expandedOverlay}>
      {/* Tappable background to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlayBackground} />
      </TouchableWithoutFeedback>

      {/* Modal container */}
      <View style={styles.modalContainer}>
        {/* Minimize/close button */}
        <TouchableOpacity style={styles.minimizeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>

        {/* Scrollable message container */}
        <ScrollView style={styles.modalScrollView}>
          <Markdown style={markdownStyles}>{message}</Markdown>
        </ScrollView>
      </View>
    </View>
  );
}
