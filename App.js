import {
  Animated,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TextInput,
  Easing,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";

import Timer from "./app/Timer";

const timeData = [
  {
    id: 0,
    setNo: 1,
    workoutNo: 1,
    type: "rest",
    duration: 5,
    start: 0,
    end: 5,
  },
  {
    id: 1,
    setNo: 2,
    workoutNo: 2,
    type: "workout",
    duration: 5,
    start: 5,
    end: 10,
  },
  {
    id: 2,
    setNo: 3,
    workoutNo: 1,
    type: "rest",
    duration: 5,
    start: 10,
    end: 15,
  },
  {
    id: 3,
    setNo: 3,
    workoutNo: 2,
    type: "rest",
    duration: 5,
    start: 15,
    end: 20,
  },
  {
    id: 4,
    setNo: 3,
    workoutNo: 3,
    type: "rest",
    duration: 5,
    start: 20,
    end: 25,
  },
  {
    id: 5,
    setNo: 4,
    workoutNo: 1,
    type: "rest",
    duration: 2,
    start: 25,
    end: 27,
  },
];

const defaultState = {
  end: timeData[0].end,
  isActive: false,
  seconds: 0,
  sectionId: 0,
  sectoinCountDownSeconds: timeData[0].duration,
  setNo: timeData[0].setNo,
  start: timeData[0].start,
  timeMax: timeData[timeData.length - 1].end,
  type: timeData[0].type,
  workoutNo: timeData[0].workoutNo,
};

const { width, height } = Dimensions.get("window");
const ITEM_SIZE = width * 0.38;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const returnSectionId = (seconds) => {
  let findResult = timeData.find(
    (section) => seconds >= section.start && seconds < section.end
  );
  if (!findResult)
    findResult = timeData.find((section) => seconds === section.end);

  return findResult?.id;
};

export default function App() {
  const [state, setState] = useState(defaultState);
  const [timerOn, setTimerOn] = useState(false);

  const flatlist = useRef();
  const secondsInputRef = useRef();
  const setInputRef = useRef();
  const workoutInputRef = useRef();

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const totalSeconds = React.useRef(new Animated.Value(0)).current;
  let totalSecondsTemp = 0;

  function setPartOfState(object) {
    const newObject = { ...state, ...object };
    setState(newObject);
  }

  function toggle() {
    if (state.seconds >= state.timeMax) return Alert.alert("End");
    setPartOfState({ isActive: !state.isActive });
    setTimerOn(!timerOn);
  }

  function reset() {
    setPartOfState(defaultState);
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    totalSeconds.setValue(0);
    setTimerOn(false);
  }

  useEffect(() => {
    if (timerOn) {
      Animated.timing(totalSeconds, {
        toValue: state.timeMax,
        duration: (state.timeMax - totalSecondsTemp) * 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(totalSeconds).stop();
    }
  }, [timerOn]);

  useEffect(() => {
    const scrollXListener = scrollX.addListener(({ value }) => {
      const newSectionId = Math.round(value / ITEM_SIZE);
      setInputRef?.current?.setNativeProps({
        text: "Set : " + timeData[newSectionId].setNo.toString(),
      });
      workoutInputRef?.current?.setNativeProps({
        text: "Workout : " + timeData[newSectionId].workoutNo.toString(),
      });
    });
    const totalSecondsListener = totalSeconds.addListener(({ value }) => {
      secondsInputRef?.current?.setNativeProps({
        text: (Math.ceil(value * 10) / 10).toString(),
      });
      totalSecondsTemp = value;
    });
    return () => {
      scrollX.removeListener(scrollXListener);
      scrollX.removeAllListeners();
      totalSeconds.removeListener(totalSecondsListener);
      totalSeconds.removeAllListeners();
    };
  });

  useEffect(() => {
    let interval = null;
    if (state.isActive && state.seconds < state.timeMax) {
      interval = setInterval(() => {
        const newSectionId = returnSectionId(state.seconds + 1);
        const scrollOrNot = !(newSectionId == state.sectionId);
        const newIsActive =
          state.seconds + 1 == state.timeMax ? { isActive: false } : {};

        setPartOfState({
          seconds: state.seconds + 1,
          sectionId: newSectionId,
          sectoinCountDownSeconds:
            timeData[newSectionId].end - state.seconds - 1,
          setNo: timeData[newSectionId].setNo,
          type: timeData[newSectionId].type,
          workoutNo: timeData[newSectionId].workoutNo,
          start: timeData[newSectionId].start,
          end: timeData[newSectionId].end,
          ...newIsActive,
        });
        if (scrollOrNot) {
          flatlist?.current?.scrollToOffset({
            offset: ITEM_SIZE * newSectionId,
            animated: true,
          });
        }
      }, 1000);
    } else if (!state.isActive && state.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [state]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatlist}
        data={timeData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        bounces={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollBegin={() => {
          setPartOfState({ isActive: false });
        }}
        onMomentumScrollEnd={(event) => {
          const newSectionId = Math.round(
            event.nativeEvent.contentOffset.x / ITEM_SIZE
          );
          setPartOfState({
            seconds: timeData[newSectionId].start,
            sectionId: newSectionId,
            sectoinCountDownSeconds: timeData[newSectionId].duration,
            setNo: timeData[newSectionId].setNo,
            type: timeData[newSectionId].type,
            workoutNo: timeData[newSectionId].workoutNo,
            start: timeData[newSectionId].start,
            end: timeData[newSectionId].end,
          });
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
          });

          return (
            <View
              style={{
                width: ITEM_SIZE,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Animated.Text
                style={[styles.text, { opacity, transform: [{ scale }] }]}
              >
                {item.id}
              </Animated.Text>
            </View>
          );
        }}
      />
      <Timer seconds={state.seconds} />
      <Timer seconds={state.sectoinCountDownSeconds} />
      <Text>{`Set : ${state.setNo}`}</Text>
      <Text>{`Workout : ${state.workoutNo}`}</Text>
      <Text>{`Type : ${state.type}`}</Text>
      <Button
        title={state.isActive ? "pause" : "play"}
        onPress={toggle}
      ></Button>
      <Button onPress={reset} title="Reset"></Button>
      <TextInput
        ref={secondsInputRef}
        defaultValue={"0"}
        style={{ fontSize: 40 }}
      />
      <TextInput
        ref={setInputRef}
        defaultValue={"Set : " + timeData[state.sectionId].setNo.toString()}
      />
      <TextInput
        ref={workoutInputRef}
        defaultValue={
          "Workout : " + timeData[state.sectionId].workoutNo.toString()
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: ITEM_SIZE * 0.8,
    color: "black",
    fontWeight: "900",
  },
});
