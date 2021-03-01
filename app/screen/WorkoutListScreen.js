import React, { useState, useCallback } from "react";
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";

import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

const { width, height } = Dimensions.get("window");

const NUM_ITEMS = 10;

function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const exampleData = [...Array(NUM_ITEMS)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${backgroundColor}`,
    label: String(index),
    backgroundColor,
  };
});

function WorkoutListScreen(props) {
  const [data, setData] = useState(exampleData);

  const renderItem = useCallback(({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={{
          height: height * 0.08,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        }}
        onLongPress={drag}
        // onPressIn={drag}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            fontSize: height * 0.03,
          }}
        >
          {isActive && "↕"}
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => setData(data)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default WorkoutListScreen;
