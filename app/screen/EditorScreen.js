import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import useWindowDimentions from "../hook/useWindowDimentions";
import CustomIcons from "../components/CustomIcons";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";

const BORDER_WIDTH = 0;

function EditorScreen({ navigation, mainData, setMainData }) {
  const { width, height, centerContainerSize } = useWindowDimentions();
  const [screenData, setScreenData] = useState(mainData);

  const listDimentions = {
    width: centerContainerSize,
    height: centerContainerSize,
  };
  const ITEM_WIDTH = listDimentions.width * 0.8;
  const ITEM_HEIGHT = listDimentions.height * 0.15;

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

  const renderItem = useCallback(
    (item) => (
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
            {item.type == "number" && item.value}
            {!(item.type == "number") &&
              timeDataSetupFunctions.totalSecToMinAndSec(item.value)
                .displayText}
            {" >"}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [screenData]
  );

  return (
    <>
      <View style={styles.container}>
        {renderItem(screenData["prepareTime"])}
        {renderItem(screenData["workoutTime"])}
        {renderItem(screenData["restTime"])}
        {renderItem(screenData["restTimeSets"])}
        {renderItem(screenData["sets"])}
        {renderItem(screenData["workouts"])}
      </View>
      <View
        style={{
          position: "absolute",
          bottom:
            width > height
              ? (height - centerContainerSize) / 2
              : ((height - centerContainerSize) / 2 -
                  centerContainerSize * 0.2) /
                2,
          left: width > height ? "5%" : (width - centerContainerSize) / 2,
          flexDirection: width > height ? "column" : "row",
          height:
            width > height ? centerContainerSize : centerContainerSize * 0.24,
          width:
            width > height ? centerContainerSize * 0.24 : centerContainerSize,
          borderWidth: BORDER_WIDTH,
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <CustomIcons
            icnoName={
              screenData.settings.playSound ? "volume-high" : "volume-off"
            }
            size={centerContainerSize * 0.13}
            onPress={() => {
              const currentSetting = mainData.settings.playSound;
              mainData.settings.playSound = !currentSetting;
              setMainData(mainData);
              setScreenData(JSON.parse(JSON.stringify(mainData)));
              useCache.store(mainData);
            }}
          />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <CustomIcons
            icnoName={"restore"}
            onPress={() => {
              Alert.alert(
                "Reset To Default",
                "Do you want to reset the settings?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      timeDataSetupFunctions.resetMainData(mainData);
                      setMainData(mainData);
                      setScreenData(JSON.parse(JSON.stringify(mainData)));
                      setScreenData(mainData);
                      useCache.store(mainData);
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
            size={centerContainerSize * 0.13}
          />
        </View>
      </View>
    </>
  );
}

export default EditorScreen;
