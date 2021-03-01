import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

function EditorDetailScreen({ route, navigation }) {
  const item = route.params;
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>{item.title}</Text>
      <Button
        fontSize={30}
        title="Ok"
        onPress={() => {
          navigation.navigate("EditorScreen");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default EditorDetailScreen;
