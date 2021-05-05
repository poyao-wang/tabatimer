import React, { useCallback, useContext, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

import { MainContext } from "../config/MainContext";
import CustomIcons from "../components/CustomIcons";
import rootNavigation from "../navigation/rootNavigation";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";
import useWindowDimentions from "../hook/useWindowDimentions";

const BORDER_WIDTH = 0;
const FONT_FAMILY =
  Platform.OS === "ios"
    ? "Courier"
    : Platform.OS === "android"
    ? "monospace"
    : null;

function EditorScreen({ navigation }) {
  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    language: { uiText },
  } = useContext(MainContext);
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
    iconContainer: {
      borderWidth: BORDER_WIDTH,
      justifyContent: "center",
      alignItems: "center",
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
      fontFamily: FONT_FAMILY,
    },
  });

  const blink = {
    0: {
      scale: 1,
    },
    0.5: {
      scale: 1.2,
    },
    1: {
      scale: 1,
    },
  };

  const renderItem = useCallback(
    (item, title, subtitle) => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("EditorDetailScreen", { item, title, subtitle });
        }}
        style={styles.itemContainer}
      >
        <View style={styles.titlesContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.valueTextContainer}>
          <Text style={styles.valueText}>
            {item.type == "number" && item.value}
            {!(item.type == "number") &&
              timeDataSetupFunctions.totalSecToMinAndSec(item.value)
                .displayText}
          </Text>
        </View>
        <Animatable.View
          animation={blink}
          duration={300}
          iterationDelay={2000}
          iterationCount="infinite"
          style={styles.iconContainer}
        >
          <CustomIcons
            iconName={"chevron-double-right"}
            disabled={true}
            size={ITEM_HEIGHT * 0.45}
          />
        </Animatable.View>
      </TouchableOpacity>
    ),
    [screenData]
  );

  return (
    <>
      <View style={styles.container}>
        {renderItem(
          screenData["prepareTime"],
          uiText.editorScreen["prepareTime"].title,
          uiText.editorScreen["prepareTime"].subtitle
        )}
        {renderItem(
          screenData["workoutTime"],
          uiText.editorScreen["workoutTime"].title,
          uiText.editorScreen["workoutTime"].subtitle
        )}
        {renderItem(
          screenData["restTime"],
          uiText.editorScreen["restTime"].title,
          uiText.editorScreen["restTime"].subtitle
        )}
        {renderItem(
          screenData["restTimeSets"],
          uiText.editorScreen["restTimeSets"].title,
          uiText.editorScreen["restTimeSets"].subtitle
        )}
        {renderItem(
          screenData["sets"],
          uiText.editorScreen["sets"].title,
          uiText.editorScreen["sets"].subtitle
        )}
        {renderItem(
          screenData["workouts"],
          uiText.editorScreen["workouts"].title,
          uiText.editorScreen["workouts"].subtitle
        )}
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
            iconName={
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
            iconName={"restore"}
            onPress={() => {
              Alert.alert(
                uiText.editorScreen.resetAlertTitle,
                uiText.editorScreen.resetAlertMsg,
                [
                  {
                    text: uiText.editorScreen.resetAlertCancel,
                    onPress: () => console.log("Cancel Pressed"),
                  },
                  {
                    text: uiText.editorScreen.resetAlertOk,
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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <CustomIcons
            iconName={"translate"}
            onPress={() => {
              rootNavigation.navigate("WelcomeScreen");
            }}
            size={centerContainerSize * 0.13}
          />
        </View>
      </View>
    </>
  );
}

export default EditorScreen;
