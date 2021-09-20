import LottieView from "lottie-react-native";
import React from "react";
import { View, StyleSheet } from "react-native";

type LoaderProps = {
  size?: number;
};

const Loader: React.FC<LoaderProps> = ({ size = 150 }) => {
  const styles = StyleSheet.create({
    overlay: {
      justifyContent: "center",
      alignItems: "center",
      height: size,
      aspectRatio: 1,
    },
  });

  return (
    <View style={styles.overlay}>
      <LottieView
        autoPlay
        loop
        source={require("../assets/animations/loader.json")}
      />
    </View>
  );
};

export default Loader;
