import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome To Tabatimer</Text>
      <Button //
        title="Start Tabata"
        onPress={() => {
          navigation.navigate("AppNavigator");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
export default WelcomeScreen;
