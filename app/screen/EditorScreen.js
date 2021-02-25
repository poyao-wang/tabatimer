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
  {
    id: 0,
    title: "Preparation Time",
    subtitle: "Preparation before Start",
    value: 5,
  },
  {
    id: 1,
    title: "Workout Time",
    subtitle: "Duration for  Workout",
    value: 5,
  },
  {
    id: 2,
    title: "Rest Time",
    subtitle: "Rest between Workouts",
    value: 5,
  },
  {
    id: 3,
    title: "Rest Time - Sets",
    subtitle: "Rest between Sets",
    value: 2,
  },
  { id: 4, title: "Sets", subtitle: "Set Amount", value: 2 },
  { id: 5, title: "Workouts", subtitle: "Workouts per Set", value: 1 },
];

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = height * 0.1;
const BORDER_WIDTH = 0;

function EditorScreen(props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={mainData}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 0 }}
        bounces={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: ITEM_WIDTH,
              padding: ITEM_HEIGHT * 0.1,
              borderWidth: BORDER_WIDTH,
            }}
          />
        )}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.titlesContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>
                {item.value}
                {" >"}
              </Text>
            </View>
          </View>
        )}
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
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    flexDirection: "row",
  },
  titlesContainer: {
    borderWidth: BORDER_WIDTH,
  },
  title: {
    fontSize: ITEM_HEIGHT * 0.3,
    height: "50%",
    textAlign: "left",
    color: "black",
    fontWeight: "bold",
    borderWidth: BORDER_WIDTH,
  },
  subtitle: {
    height: "50%",
    fontSize: ITEM_HEIGHT * 0.2,
    paddingLeft: ITEM_WIDTH * 0.03,
    borderWidth: BORDER_WIDTH,
  },
  valueTextContainer: {
    flex: 1,
    borderWidth: BORDER_WIDTH,
    justifyContent: "center",
  },
  valueText: {
    borderWidth: BORDER_WIDTH,
    fontSize: ITEM_HEIGHT * 0.4,
    textAlign: "right",
    color: "black",
    fontWeight: "bold",
  },
});
export default EditorScreen;
