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

const outPutColorByType = (type) => {
  if (type == "prepare") return { value: 0, text: "rgb(200,200,200)" };
  if (type == "workout") return { value: 1, text: "rgb(255,114,50)" };
  if (type == "rest") return { value: 2, text: "rgb(20,196,108)" };
  if (type == "finished") return { value: 3, text: "rgb(255,255,255)" };

  return "gray";
};

export default function TimerScreen({ setTabBarShow, useTimerSetupState }) {
  const { width, height } = useWindowDimentions();

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );

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
  const sectionSeconds = React.useRef(new Animated.Value(0)).current;
  const totalSeconds = React.useRef(new Animated.Value(0)).current;
  const backgroundAnimation = React.useRef(new Animated.Value(-height)).current;
  const backgroundColorAnimation = React.useRef(new Animated.Value(0)).current;

  const [sectionId, setSectionId] = useState(0);

  const backgroundColorForScreen = backgroundColorAnimation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      outPutColorByType("prepare").text,
      outPutColorByType("workout").text,
      outPutColorByType("rest").text,
      outPutColorByType("finished").text,
    ],
  });

  function changeBackgroundColor(toValue) {
    Animated.timing(backgroundColorAnimation, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function toggle() {
    if (sectionSeconds._value >= timeMax) return Alert.alert("End");
    setTimerOn(!timerOn);
    setTabBarShow(timerOn);
  }

  function reset() {
    setTimerOn(false);
    setTabBarShow(true);
    totalSeconds.setValue(0);
    sectionSeconds.setValue(0);
    secondsInputRef?.current?.setNativeProps({
      text: timeData[0].start.toString(),
    });
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });

    Animated.timing(backgroundAnimation, {
      toValue: -height,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setSectionId(0);
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
    if ((flatListScrolling == false) & timerOn) {
      flatlist?.current?.scrollToOffset({
        offset: ITEM_SIZE * sectionId,
        animated: true,
      });
      sectionSeconds.setValue(0);
      backgroundAnimation.setValue(-height);
      Animated.parallel([
        Animated.timing(sectionSeconds, {
          toValue: timeData[sectionId].duration,
          duration: timeData[sectionId].duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: timeData[sectionId].duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(({ finished }) => {
        if (sectionId + 1 > timeData.length - 1) {
          setTimerOn(false);
          setTabBarShow(true);
          if (finished)
            changeBackgroundColor(outPutColorByType("finished").value);
        } else {
          if (finished) setSectionId(sectionId + 1);
        }
      });
    }
    changeBackgroundColor(outPutColorByType(timeData[sectionId].type).value);
  }, [sectionId]);

  useEffect(() => {
    setTimeMax(timeData[timeData.length - 1].end);
    sectionSeconds.setValue(0);
    sectionSecondsInputRef?.current?.setNativeProps({
      text: Math.ceil(timeData[0].end).toString(),
    });
  }, [timeData]);

  useEffect(() => {
    if (timerOn) {
      Animated.parallel([
        Animated.timing(sectionSeconds, {
          toValue: timeData[sectionId].duration,
          duration:
            (timeData[sectionId].duration - sectionSeconds._value) * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration:
            (timeData[sectionId].duration - sectionSeconds._value) * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(({ finished }) => {
        if (sectionId + 1 > timeData.length - 1) {
          setTimerOn(false);
          setTabBarShow(true);
          if (finished)
            changeBackgroundColor(outPutColorByType("finished").value);
        } else {
          if (finished) setSectionId(sectionId + 1);
        }
      });
    } else {
      sectionSeconds.stopAnimation();
    }
  }, [timerOn]);

  useEffect(() => {
    const scrollXListener = scrollX.addListener(({ value }) => {
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
    const sectionSecondsListener = sectionSeconds.addListener(({ value }) => {
      if (timerOn) {
        totalSeconds.setValue(timeData[sectionId].start + value);
        secondsInputRef?.current?.setNativeProps({
          text: Math.ceil(totalSeconds._value).toString(),
        });
        sectionSecondsInputRef?.current?.setNativeProps({
          text: Math.ceil(timeData[sectionId].duration - value).toString(),
        });
        // backgroundAnimation.setValue(
        //   height * (sectionSeconds._value / timeData[sectionId].duration)
        // );
      }
    });
    return () => {
      scrollX.removeListener(scrollXListener);
      scrollX.removeAllListeners();
      sectionSeconds.removeListener(sectionSecondsListener);
      sectionSeconds.removeAllListeners();
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
            // backgroundColor: "red",
            backgroundColor: backgroundColorForScreen,
          },
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            height,
            width,
            opacity: 1,
            backgroundColor: "white",
            transform: [{ translateY: backgroundAnimation }],
          },
        ]}
      />
      <Animated.FlatList
        initialNumToRender={10}
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
          if (!timerOn) {
            setFlatListScrolling(false);
            // console.log("onMomentumScrollEnd");

            let newSectionId = Math.round(scrollX._value / ITEM_SIZE);
            if (newSectionId <= 0) newSectionId = 0;
            if (newSectionId >= timeData.length - 1)
              newSectionId = timeData.length - 1;
            totalSeconds.setValue(timeData[newSectionId].start);
            sectionSeconds.setValue(0);
            secondsInputRef?.current?.setNativeProps({
              text: timeData[newSectionId].start.toString(),
            });

            Animated.timing(backgroundAnimation, {
              // toValue: height * (timeData[newSectionId].start / timeMax),
              toValue: -height,
              duration: 100,
              useNativeDriver: true,
            }).start();
            setSectionId(newSectionId);
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
            outputRange: [0.8, 1, 0.8],
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
          });

          const indexOfFlaiListArray =
            item.workoutNo - 1 < 0 ? 0 : item.workoutNo - 1;

          return (
            <Animated.View
              style={{
                width: ITEM_SIZE,
                height: height * 0.3,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                backgroundColor: outPutColorByType(item.type).text,
                opacity,
                transform: [
                  {
                    scale,
                  },
                ],
              }}
            >
              <Text style={{ fontSize: 25 }}>{item.type}</Text>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: height * 0.15,
                  },
                ]}
              >
                {item.id}
              </Text>
              <Text style={{ fontSize: 25 }}>
                {
                  useTimerSetupState.timerSetup.workoutSetup.flatListArray[
                    indexOfFlaiListArray
                  ].name
                }
              </Text>
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
