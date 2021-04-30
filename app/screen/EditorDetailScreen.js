import { View, StyleSheet, Text } from "react-native";
import React, { useEffect, useContext } from "react";

import { MainContext } from "../config/MainContext";
import CustomIcons from "../components/CustomIcons";
import NumberPicker from "../components/NumberPicker";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";
import useWindowDimentions from "../hook/useWindowDimentions";

const BORDER_WIDTH = 0;

function EditorDetailScreen({ route, navigation }) {
  const {
    tabBar: { setTabBarShow },
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
  } = useContext(MainContext);

  const { width, height, centerContainerSize } = useWindowDimentions();

  const itemSize = Math.round(centerContainerSize * 0.12);
  const selectorSize = itemSize * 5;

  const finalValue = { minutes: 0, seconds: 0, numbers: 0 };

  const item = route.params.item;
  const title = route.params.title;
  const subtitle = route.params.subtitle;

  const timePicker = () => (
    <>
      <NumberPicker
        itemSize={itemSize}
        numItems={60}
        onScroll={(value) => {
          finalValue.minutes = value;
        }}
      />
      <Text
        style={{
          fontSize: itemSize * 0.7,
        }}
      >
        :
      </Text>
      <NumberPicker
        itemSize={itemSize}
        numItems={60}
        onScroll={(value) => {
          finalValue.seconds = value;
        }}
      />
    </>
  );
  const numberPicker = () => (
    <>
      <NumberPicker
        itemSize={itemSize}
        numItems={31}
        onScroll={(value) => {
          finalValue.numbers = value;
        }}
      />
    </>
  );

  useEffect(() => {
    setTabBarShow(false);
    return () => setTabBarShow(true);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: centerContainerSize,
          height: centerContainerSize,
          alignItems: "center",
          justifyContent: "center",
          padding: centerContainerSize * 0.05,
          borderWidth: BORDER_WIDTH,
        }}
      >
        <Text
          style={{
            fontSize: centerContainerSize * 0.08,
            borderWidth: BORDER_WIDTH,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: centerContainerSize * 0.05,
            borderWidth: BORDER_WIDTH,
            paddingTop: centerContainerSize * 0.05,
            opacity: 0.5,
          }}
        >
          {subtitle}
        </Text>
        <View
          style={{
            width: selectorSize,
            height: selectorSize,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: BORDER_WIDTH,
          }}
        >
          {item.type == "time" ? timePicker() : numberPicker()}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "space-between",
            borderWidth: BORDER_WIDTH,
          }}
        >
          <View style={styles.iconContainer}>
            <CustomIcons
              icnoName={"check-circle"}
              onPress={() => {
                item.value =
                  item.type == "number"
                    ? finalValue.numbers < 1
                      ? 1
                      : finalValue.numbers
                    : finalValue.minutes * 60 + finalValue.seconds < 5
                    ? 5
                    : finalValue.minutes * 60 + finalValue.seconds;
                mainData.workoutSetup.workoutArray = timeDataSetupFunctions.makeWorkoutsArray(
                  mainData
                );
                mainData.workoutSetup.updated = true;
                if (item.title == "Workouts") {
                  mainData.workoutSetup.flatListArray = timeDataSetupFunctions.makeFlatListArray(
                    mainData,
                    item.value
                  );
                }
                setMainData(mainData);
                useCache.store(mainData);
                navigation.navigate("EditorScreen");
              }}
              size={itemSize}
              color="rgba(29, 195, 114,1)"
            />
          </View>
          <View style={styles.iconContainer}>
            <CustomIcons
              icnoName={"close-circle"}
              onPress={() => {
                navigation.navigate("EditorScreen");
              }}
              size={itemSize}
              color="rgba(243, 77, 77,1)"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flex: 1,
  },
});
export default EditorDetailScreen;
