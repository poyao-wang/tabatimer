import React, { useState, useCallback } from "react";
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

import useWindowDimentions from "../hook/useWindowDimentions";

const BORDER_WIDTH = 0;

function WorkoutListScreen({ navigation, mainData, setMainData }) {
  const { width, height, centerContainerSize } = useWindowDimentions();
  const [data, setData] = useState(mainData.workoutSetup.flatListArray);

  const listDimentions = {
    width: centerContainerSize,
    height: centerContainerSize,
  };
  const ITEM_WIDTH = listDimentions.width * 0.8;
  const ITEM_HEIGHT = listDimentions.height * 0.15;

  useFocusEffect(
    React.useCallback(() => {
      setData(mainData.workoutSetup.flatListArray);

      return;
    }, [])
  );

  const renderItem = useCallback(
    ({ item, index, drag, isActive }) => {
      return (
        <TouchableOpacity
          style={{
            height: width > height ? height * 0.15 : height * 0.08,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: BORDER_WIDTH,
          }}
          onPress={() => {
            navigation.navigate("WorkoutListDetailScreen", item);
          }}
          onLongPress={drag}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: width > height ? height * 0.07 : height * 0.03,
            }}
          >
            {isActive && "↕"}
            {index + 1 + " :"}
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [data]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: centerContainerSize,
          height: centerContainerSize,
          borderWidth: BORDER_WIDTH,
        }}
      >
        <DraggableFlatList
          bounces={false}
          contentContainerStyle={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
          style={{}}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          onDragEnd={({ data }) => {
            for (let i = 0; i < data.length; i++) {
              data[i].id = i;
            }
            mainData.workoutSetup.flatListArray = data;
            mainData.workoutSetup.updated = true;
            setMainData(mainData);
            setData(data);
          }}
        />
      </View>
    </View>
  );
}

export default WorkoutListScreen;
