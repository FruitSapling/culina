// components/TypingIndicator.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import styles from "../ChatScreen.styles";

export default function TypingIndicator() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={[styles.bubble, styles.botBubble]}>
      <Text style={styles.senderLabel}>Culina</Text>
      <View style={localStyles.center}>
        <Animated.View
          style={[
            localStyles.breathingDot,
            {
              transform: [{ scale }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  center: {
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  breathingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#8BC34A",
  },
});
