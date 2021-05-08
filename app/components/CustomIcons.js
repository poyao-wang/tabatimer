import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
function CustomIcons({
  iconName = "reload",
  textBelow = null,
  color = colors.dark,
  size = 60,
  style,
  onLongPress,
  onPress,
  onPressIn,
  disabled = false,
}) {
  if (!iconName) iconName = "reload";

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
      onLongPress={onLongPress}
      style={[styles.container, style]}
    >
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
      {textBelow && <Text style={{ fontSize: size * 0.2 }}>{textBelow}</Text>}
    </TouchableOpacity>
  );
}

export default CustomIcons;
