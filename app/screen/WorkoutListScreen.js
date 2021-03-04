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

const BORDER_WIDTH = 2;

function WorkoutListScreen({ navigation, mainData, setMainData }) {
  const { width, height } = Dimensions.get("window");
  const [data, setData] = useState(mainData.workoutSetup.flatListArray);
  // console.log(data, mainData.workoutSetup.flatListArray);
  const renderItem = useCallback(({ item, index, drag, isActive }) => {
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
          {index + " :"}
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        contentContainerStyle={{
          paddingTop: height * 0.05,
          paddingBottom: width > height ? height * 0.2 : height * 0.15,
        }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data }) => {
          for (let i = 0; i < data.length; i++) {
            data[i].id = i;
          }
          mainData.workoutSetup.flatListArray = data;
          setMainData(mainData);
          setData(data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default WorkoutListScreen;
