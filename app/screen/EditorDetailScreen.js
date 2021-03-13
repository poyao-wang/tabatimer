import {
  Animated,
  View,
  StyleSheet,
  Text,
  Button,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";

import NumberPicker from "../components/NumberPicker";
import useCache from "../utility/cache";
import useWindowDimentions from "../hook/useWindowDimentions";

function EditorDetailScreen({
  route,
  navigation,
  mainData,
  setMainData,
  setTabBarShow,
}) {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const itemSize = Math.round(centerContainerSize * 0.15);
  const selectorSize = itemSize * 5;

  const finalValue = { minutes: 0, seconds: 0, numbers: 0 };

  const item = route.params;

  const timePicker = () => (
    <>
      <NumberPicker
        itemSize={itemSize}
        numItems={60}
        onScroll={(value) => {
          finalValue.minutes = value;
        }}
      />
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
        numItems={100}
        onScroll={(value) => {
          finalValue.numbers = value;
        }}
      />
    </>
  );

  const makeWorkoutsArray = () => {
    let newArray = [];
    const setAmt = mainData.sets.value;
    const workoutAmt = mainData.workouts.value;

    let id = 0;
    let end = mainData.prepareTime.value;

    newArray.push({
      id: id,
      setNo: 1,
      workoutNo: 0,
      type: "prepare",
      duration: mainData.prepareTime.value,
      start: 0,
      end: end,
    });
    id++;

    for (let i = 1; i <= setAmt; i++) {
      for (let j = 1; j <= workoutAmt; j++) {
        newArray.push({
          id: id,
          setNo: i,
          workoutNo: j,
          type: "workout",
          duration: mainData.workoutTime.value,
          start: end,
          end: end + mainData.workoutTime.value,
        });
        end = end + mainData.workoutTime.value;
        id++;

        if (j !== workoutAmt) {
          newArray.push({
            id: id,
            setNo: i,
            workoutNo: j,
            type: "rest",
            duration: mainData.restTime.value,
            start: end,
            end: end + mainData.restTime.value,
          });
          end = end + mainData.restTime.value;
          id++;
        }
      }

      if (i !== setAmt) {
        newArray.push({
          id: id,
          setNo: i + 1,
          workoutNo: 0,
          type: "prepare",
          duration: mainData.restTimeSets.value,
          start: end,
          end: end + mainData.restTimeSets.value,
        });
        end = end + mainData.restTimeSets.value;
        id++;
      }
    }

    return newArray;
  };

  const makeFlatListArray = () => {
    let newArray = [...mainData.workoutSetup.flatListArray];
    const workoutAmt = finalValue.numbers;
    let arrayLength = newArray.length;
    if (arrayLength > workoutAmt) {
      for (let i = 0; i < arrayLength - workoutAmt; i++) {
        newArray.pop();
      }
    } else if (arrayLength < workoutAmt) {
      for (let i = 0; i < workoutAmt - arrayLength; i++) {
        newArray.push({});
      }
    }

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].id = i;
      if (!newArray[i].name) newArray[i].name = `workout${i}`;
      if (!newArray[i].image) newArray[i].image = "";
    }

    return newArray;
  };

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
        }}
      >
        <Text style={{ fontSize: centerContainerSize * 0.09 }}>
          {item.title}
        </Text>
        <View
          style={{
            width: selectorSize,
            height: selectorSize,
            flexDirection: "row",
          }}
        >
          {item.type == "time" ? timePicker() : numberPicker()}
        </View>
        <Button
          fontSize={30}
          title="Ok"
          onPress={() => {
            item.value =
              item.type == "time"
                ? finalValue.minutes * 60 + finalValue.seconds
                : finalValue.numbers;
            mainData.workoutSetup.workoutArray = makeWorkoutsArray();
            mainData.workoutSetup.updated = true;
            if (item.title == "Workouts") {
              mainData.workoutSetup.flatListArray = makeFlatListArray();
              // console.log(makeFlatListArray());
            }
            setMainData(mainData);
            useCache.store(mainData);
            navigation.navigate("EditorScreen");
          }}
        />
        <Button
          fontSize={30}
          title="ValueCheck"
          onPress={() => {
            console.log(makeFlatListArray());
            console.log(item.title);
          }}
        />
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
});
export default EditorDetailScreen;
