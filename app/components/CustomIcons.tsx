import React from "react";
import { StyleSheet, TouchableOpacity, Text, ColorValue } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

export type AvailableIconNames =
  | "alpha-c-box"
  | "alpha-e-box"
  | "alpha-j-box"
  | "arrow-left-bold-circle"
  | "arrow-up-down-bold"
  | "check-circle"
  | "chevron-double-right"
  | "close-circle"
  | "cloud-download"
  | "cloud-upload"
  | "delete-forever"
  | "drag"
  | "facebook"
  | "format-list-bulleted"
  | "google"
  | "image-off"
  | "image-plus"
  | "login"
  | "logout"
  | "minus-circle"
  | "pause-circle"
  | "play-circle"
  | "play-circle"
  | "plus-circle"
  | "plus"
  | "reload"
  | "restore"
  | "square-edit-outline"
  | "timer"
  | "translate"
  | "volume-high"
  | "volume-off";

interface CustomIconsProps {
  color?: ColorValue;
  disabled?: boolean;
  iconName?: AvailableIconNames;
  size?: number;
  style?: {};
  textBelow?: string | null;
  onLongPress?: () => void;
  onPress?: () => void;
  onPressIn?: () => void;
}

const CustomIcons: React.FC<CustomIconsProps> = ({
  color = colors.dark,
  disabled = false,
  iconName = "reload",
  size = 60,
  style = {},
  textBelow = null,
  onLongPress,
  onPress,
  onPressIn,
}) => {
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
};

export default CustomIcons;
