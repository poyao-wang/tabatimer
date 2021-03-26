import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
function CustomIcons({
  icnoName = "reload",
  textBelow = null,
  color = colors.dark,
  size = 60,
  style,
  onPress,
  onPressIn,
  disabled = false,
}) {
  if (!icnoName) icnoName = "reload";

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      opacity: disabled ? 0.5 : 1,
    },
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      style={[styles.container, style]}
    >
      <MaterialCommunityIcons name={icnoName} size={size} color={color} />
      {textBelow && <Text style={{ fontSize: size * 0.2 }}>{textBelow}</Text>}
    </TouchableOpacity>
  );
}

export default CustomIcons;
