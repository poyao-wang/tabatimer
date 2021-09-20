import React from "react";
import { StyleSheet, Text, TouchableOpacity, ColorValue } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AvailableIconNames } from "../components/CustomIcons";

interface AuthButtonProps {
  btnText?: string;
  centerContainerSize?: number;
  color?: ColorValue;
  iconName?: AvailableIconNames;
  onPress: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  btnText = "Login",
  centerContainerSize = 300,
  color = "black",
  iconName = "reload",
  onPress,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: color,
      borderRadius: centerContainerSize * 0.02,
      height: centerContainerSize * 0.12,
      justifyContent: "center",
      width: centerContainerSize * 0.7,
      margin: centerContainerSize * 0.02,
    },
    text: {
      fontSize: centerContainerSize * 0.048,
      fontWeight: "600",
      color: "white",
    },
  });
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <MaterialCommunityIcons
        name={iconName}
        size={centerContainerSize * 0.048}
        color="white"
      />
      <Text style={styles.text}> {btnText}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
