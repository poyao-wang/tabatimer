import React, { useState, useCallback } from "react";
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

import useWindowDimentions from "../hook/useWindowDimentions";
import colors from "../config/colors";
import CustomIcons from "../components/CustomIcons";

const BORDER_WIDTH = 0;
function WorkoutListScreen({ navigation, mainData, setMainData }) {
  const { width, height, centerContainerSize } = useWindowDimentions();
  const [data, setData] = useState(mainData.workoutSetup.flatListArray);

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  useFocusEffect(
    React.useCallback(() => {
      setData(mainData.workoutSetup.flatListArray);
      return;
    }, [])
  );

  const renderItem = ({ item, index, drag, isActive }) => {
    let imageUri = item.image;
    return (
      <View
        style={{
          height: centerContainerSize * 0.2,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: BORDER_WIDTH,
          flexDirection: "row",
        }}
        onLongPress={drag}
      >
        <View style={styles.itemIconContainer}>
          <CustomIcons
            icnoName={"drag"}
            onPressIn={drag}
            size={centerContainerSize * 0.07}
            color={colors.medium}
          />
        </View>
        <View
          style={{
            borderWidth: BORDER_WIDTH,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            width: centerContainerSize * 0.15,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: centerContainerSize * 0.07,
            }}
          >
            {index + 1 + "."}
            {/* {item.name} */}
          </Text>
        </View>
        <View
          style={{
            width: centerContainerSize * 0.2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: BORDER_WIDTH,
          }}
        >
          {!(imageUri == "") && (
            <View
              style={{
                borderRadius: centerContainerSize * 0.03,
                borderWidth: BORDER_WIDTH,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: centerContainerSize * 0.17,
                  aspectRatio: 1,
                }}
              />
            </View>
          )}
          {imageUri == "" && (
            <CustomIcons
              icnoName={"image-off"}
              disabled={true}
              size={centerContainerSize * 0.1}
              color={colors.dark}
            />
          )}
        </View>
        <View style={styles.itemIconContainer}>
          {isActive && (
            <CustomIcons
              icnoName={"arrow-up-down-bold"}
              size={centerContainerSize * 0.1}
              color={colors.medium}
            />
          )}
        </View>
        <View style={styles.itemIconContainer}>
          <CustomIcons
            icnoName={"image-plus"}
            onPress={() => {
              navigation.navigate("WorkoutListDetailScreen", item);
            }}
            size={centerContainerSize * 0.1}
            color={colors.dark}
          />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    itemIconContainer: {
      height: "100%",
      width: centerContainerSize * 0.1,
      borderWidth: BORDER_WIDTH,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          borderWidth: 3,
          borderColor: colors.medium,
          borderRadius: centerContainerSize * 0.04,
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
          ItemSeparatorComponent={() => (
            <View
              style={{
                borderBottomWidth: 1,
                borderTopColor: colors.medium,
                width: centerContainerSize * 0.8,
                alignSelf: "center",
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

export default WorkoutListScreen;
