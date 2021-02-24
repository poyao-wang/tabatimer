import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Text,
} from "react-native";

const mainData = [
  { id: 0, title: "Prepare Time" },
  { id: 1, title: "Workout Time" },
  { id: 2, title: "Rest Time" },
  { id: 3, title: "Rest Time between Sets" },
  { id: 4, title: "Sets" },
  { id: 5, title: "Workouts" },
];

const { width, height } = Dimensions.get("window");
const ITEM_SIZE = width * 0.8;

function EditorScreen(props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={mainData}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 0 }}
        bounces={false}
        renderItem={({ item }) => {
          return <Text style={styles.text}>{item.title}</Text>;
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
  flatList: {},
  text: {
    width: ITEM_SIZE,
    fontSize: ITEM_SIZE * 0.08,
    textAlign: "left",
    color: "black",
    fontWeight: "900",
  },
});
export default EditorScreen;
