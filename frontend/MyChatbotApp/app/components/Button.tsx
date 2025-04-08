import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "../theme";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  danger?: boolean;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  danger = false,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        danger && styles.danger,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minWidth: 120,
  },
  text: {
    color: "#fff", // <-- CRUCIAL
    fontSize: 14,
    fontWeight: "600",
  },
  danger: {
    backgroundColor: "#ef4444",
  },
  disabled: {
    opacity: 0.6,
  },
});
