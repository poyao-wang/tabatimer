import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import useWindowDimentions from "../hook/useWindowDimentions";

const BORDER_WIDTH = 0;

function EditorScreen({ navigation, mainData }) {
  const { width, height } = useWindowDimentions();

  const listDimentions = {
    width: width > height ? height : width,
    height: height,
  };
  const ITEM_WIDTH = listDimentions.width * 0.9;
  const ITEM_HEIGHT = listDimentions.height * 0.1;

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

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("EditorDetailScreen", item);
      }}
      style={styles.itemContainer}
    >
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderItem(mainData["prepareTime"])}
      {renderItem(mainData["workoutTime"])}
      {renderItem(mainData["restTime"])}
      {renderItem(mainData["restTimeSets"])}
      {renderItem(mainData["sets"])}
      {renderItem(mainData["workouts"])}
    </View>
  );
}

export default EditorScreen;
