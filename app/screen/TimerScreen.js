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
import { useFocusEffect } from "@react-navigation/native";

export default function TimerScreen({ setTabBarShow, useTimerSetupState }) {
  const { width, height } = useWindowDimentions();

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );

  const returnSectionId = (seconds) => {
    let findResult = timeData.find(
      (section) => seconds >= section.start && seconds < section.end
    );
    if (!findResult)
      findResult = timeData.find((section) => seconds === section.end);

    return findResult?.id;
  };

  const [timerOn, setTimerOn] = useState(false);
  const [timeMax, setTimeMax] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray[timeData.length - 1]
      .end
  );
  const [btnPressable, setBtnPressable] = useState(true);
  const [flatListScrolling, setFlatListScrolling] = useState(false);

  const ITEM_SIZE = Math.round(width * 0.38);
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

  function toggle() {
    if (totalSeconds._value >= timeMax) return Alert.alert("End");
    setTimerOn(!timerOn);
    setTabBarShow(timerOn);
  }

  function reset() {
    Animated.timing(totalSeconds, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    setTimerOn(false);
    setTabBarShow(true);
  }

  useFocusEffect(
    React.useCallback(() => {
      if (useTimerSetupState.timerSetup.workoutSetup.updated) {
        setTimeData(useTimerSetupState.timerSetup.workoutSetup.workoutArray);
        reset();
        useTimerSetupState.timerSetup.workoutSetup.updated = false;
        useTimerSetupState.setTimerSetup(useTimerSetupState.timerSetup);
      }
      return;
    }, [])
  );

  useEffect(() => {
    setTimeMax(timeData[timeData.length - 1].end);
    totalSeconds.setValue(0);
  }, [timeData]);

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

      backgroundAnimation.setValue(height * (value / timeMax));

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
          setFlatListScrolling(true);
        }}
        onMomentumScrollEnd={() => {
          setFlatListScrolling(false);

          let newSectionId = Math.round(scrollX._value / ITEM_SIZE);
          if (newSectionId <= 0) newSectionId = 0;
          if (newSectionId >= timeData.length - 1)
            newSectionId = timeData.length - 1;

          if (!timerOn) {
            secondsInputRef?.current?.setNativeProps({
              text: timeData[newSectionId].start.toString(),
            });

            Animated.timing(totalSeconds, {
              toValue: timeData[newSectionId].start,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
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
        disabled={!btnPressable || flatListScrolling}
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
