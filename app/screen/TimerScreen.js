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
import useWindowDimentions from "../hook/useWindowDimentions";

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

const returnSectionId = (seconds) => {
  let findResult = timeData.find(
    (section) => seconds >= section.start && seconds < section.end
  );
  if (!findResult)
    findResult = timeData.find((section) => seconds === section.end);

  return findResult?.id;
};

export default function TimerScreen({ setTabBarShow }) {
  const { width, height } = useWindowDimentions();

  const [timerOn, setTimerOn] = useState(false);
  const [timeMax, setTimeMax] = useState(defaultState.timeMax);
  const [btnPressable, setBtnPressable] = useState(true);

  const ITEM_SIZE = width * 0.38;
  const ITEM_SPACING = (width - ITEM_SIZE) / 2;

  const flatlist = useRef();
  const secondsInputRef = useRef();
  const sectionSecondsInputRef = useRef();
  const setInputRef = useRef();
  const workoutInputRef = useRef();

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const totalSeconds = React.useRef(new Animated.Value(0)).current;
  const backgroundAnimation = React.useRef(new Animated.Value(0)).current;

  let sectionId = 0;
  let flatListScrolling = false;

  function toggle() {
    if (totalSeconds._value >= timeMax) return Alert.alert("End");
    setTimerOn(!timerOn);
    setTabBarShow(timerOn);
  }

  function reset() {
    if (scrollX._value == 0) totalSeconds.setValue(0);
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    setTimerOn(false);
    setTabBarShow(true);
  }

  useEffect(() => {
    if (timerOn) {
      Animated.timing(totalSeconds, {
        toValue: timeMax,
        duration: (timeMax - totalSeconds._value) * 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {
        setTimerOn(false);
        setTabBarShow(true);
      });
    } else {
      totalSeconds.stopAnimation();
    }
  }, [timerOn]);

  useEffect(() => {
    const scrollXListener = scrollX.addListener(({ value }) => {
      scrollX._value = value;
      let newSectionId = Math.round(value / ITEM_SIZE);
      if (newSectionId <= 0) newSectionId = 0;
      if (newSectionId >= timeData.length - 1)
        newSectionId = timeData.length - 1;

      setInputRef?.current?.setNativeProps({
        text: "Set : " + timeData[newSectionId].setNo.toString(),
      });
      workoutInputRef?.current?.setNativeProps({
        text: "Workout : " + timeData[newSectionId].workoutNo.toString(),
      });
      if (!timerOn) {
        secondsInputRef?.current?.setNativeProps({
          text: timeData[newSectionId].start.toString(),
        });
        totalSeconds.setValue(timeData[newSectionId].start);
      }
    });
    const totalSecondsListener = totalSeconds.addListener(({ value }) => {
      const newSectionId = returnSectionId(value);
      secondsInputRef?.current?.setNativeProps({
        text: Math.ceil(value).toString(),
      });
      sectionSecondsInputRef?.current?.setNativeProps({
        text: Math.ceil(timeData[newSectionId].end - value).toString(),
      });
      totalSeconds._value = value;

      backgroundAnimation.setValue(height * (value / defaultState.timeMax));

      if (Math.ceil(value) !== totalSeconds._ceiledValue && timerOn) {
        totalSeconds._ceiledValue = Math.ceil(value);
        if (sectionId !== newSectionId) {
          sectionId = newSectionId;
          if (flatListScrolling == false) {
            flatlist?.current?.scrollToOffset({
              offset: ITEM_SIZE * sectionId,
              animated: true,
            });
          }
        }
      }
    });
    return () => {
      scrollX.removeListener(scrollXListener);
      scrollX.removeAllListeners();
      totalSeconds.removeListener(totalSecondsListener);
      totalSeconds.removeAllListeners();
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height,
            width,
            backgroundColor: "gray",
            transform: [{ translateY: backgroundAnimation }],
          },
        ]}
      />
      <Animated.FlatList
        ref={flatlist}
        data={timeData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
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
          flatListScrolling = true;
        }}
        onMomentumScrollEnd={() => {
          flatListScrolling = false;
        }}
        onScrollBeginDrag={() => {
          setTimerOn(false);
          setTabBarShow(true);
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
            outputRange: [0.5, 1, 0.5],
          });

          return (
            <Animated.View
              style={{
                width: ITEM_SIZE,
                height: height * 0.3,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                opacity,
                transform: [
                  {
                    scale,
                  },
                ],
              }}
            >
              <Animated.Text
                style={[
                  styles.text,
                  {
                    fontSize: height * 0.15,
                  },
                ]}
              >
                {item.id}
              </Animated.Text>
            </Animated.View>
          );
        }}
      />
      <Button
        disabled={!btnPressable}
        title={timerOn ? "pause" : "play"}
        onPress={toggle}
      />
      <Button
        disabled={!btnPressable || timerOn}
        onPress={reset}
        title="Reset"
      />
      <TextInput
        ref={secondsInputRef}
        defaultValue={"0"}
        style={{ fontSize: 40 }}
        editable={false}
      />
      <TextInput
        ref={sectionSecondsInputRef}
        defaultValue={"0"}
        style={{ fontSize: 40 }}
        editable={false}
      />
      <TextInput
        ref={setInputRef}
        defaultValue={"Set : " + timeData[0].setNo.toString()}
        editable={false}
      />
      <TextInput
        ref={workoutInputRef}
        defaultValue={"Workout : " + timeData[0].workoutNo.toString()}
        editable={false}
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
    textAlign: "center",
    color: "black",
    fontWeight: "900",
  },
});
