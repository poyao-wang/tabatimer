import {
  Alert,
  Animated,
  Button,
  Easing,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";

import { useFocusEffect } from "@react-navigation/native";
import useWindowDimentions from "../hook/useWindowDimentions";
import CustomIcons from "../components/CustomIcons";

const BORDER_WIDTH = 0;

const outPutColorByType = (type) => {
  if (type == "prepare") return { value: 0, text: "rgba(200,200,200,1)" };
  if (type == "workout") return { value: 1, text: "rgba(255,114,50,1)" };
  if (type == "rest") return { value: 2, text: "rgba(20,196,108,1)" };
  if (type == "finished") return { value: 3, text: "rgba(255,255,255,1)" };

  return "gray";
};

export default function TimerScreen({ setTabBarShow, useTimerSetupState }) {
  const windowDimentions = useWindowDimentions();
  const { width, height } = windowDimentions;

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );
  // const [timeMax, setTimeMax] = useState(
  //   useTimerSetupState.timerSetup.workoutSetup.workoutArray[timeData.length - 1]
  //     .end
  // );
  const [timerOn, setTimerOn] = useState(false);
  const [btnPressable, setBtnPressable] = useState(true);
  const [flatListScrolling, setFlatListScrolling] = useState(false);
  const [sectionId, setSectionId] = useState(0);

  const longSide = width > height ? width : height;
  const shortside = width > height ? height : width;

  const longSideCal = longSide * 0.6;
  const shortSodeCal = shortside;

  const CENTER_CONTAINER_SIZE =
    shortSodeCal > longSideCal ? longSideCal : shortSodeCal;
  const ITEM_SIZE = Math.round(CENTER_CONTAINER_SIZE * 0.4);
  const ITEM_SPACING = (CENTER_CONTAINER_SIZE - ITEM_SIZE) / 2;

  const flatlist = useRef();
  const totalSecondsInputRef = useRef();
  const sectionSecondsRemainsInputRef = useRef();
  const setInputRef = useRef();
  const workoutInputRef = useRef();

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const sectionSeconds = React.useRef(new Animated.Value(0)).current;
  const totalSeconds = React.useRef(new Animated.Value(0)).current;
  const backgroundAnimation = React.useRef(new Animated.Value(-height)).current;
  const backgroundColorAnimation = React.useRef(new Animated.Value(0)).current;

  const backgroundColorForScreen = backgroundColorAnimation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      outPutColorByType("prepare").text,
      outPutColorByType("workout").text,
      outPutColorByType("rest").text,
      outPutColorByType("finished").text,
    ],
  });
  const scrollValueToSectionId = (scrollValue) => {
    const idMax = timeData.length - 1;
    const newSectionId = Math.round(scrollValue / ITEM_SIZE);
    return newSectionId <= 0 ? 0 : newSectionId >= idMax ? idMax : newSectionId;
  };

  function changeBackgroundColor(toValue) {
    Animated.timing(backgroundColorAnimation, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function timerAnimationLoop(startTime = 0) {
    Animated.parallel([
      Animated.timing(sectionSeconds, {
        toValue: timeData[sectionId].duration,
        duration: (timeData[sectionId].duration - startTime) * 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(backgroundAnimation, {
        toValue: 0,
        duration: (timeData[sectionId].duration - startTime) * 1000,
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

  function toggle() {
    // if (sectionSeconds._value >= timeMax) return Alert.alert("End");
    setTimerOn(!timerOn);
    setTabBarShow(timerOn);
  }

  function reset() {
    setTimerOn(false);
    setTabBarShow(true);
    totalSeconds.setValue(0);
    sectionSeconds.setValue(0);
    totalSecondsInputRef?.current?.setNativeProps({
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
    setTimerOn(false);
    setTabBarShow(true);
    setTimeout(() => {
      flatlist?.current?.scrollToOffset({
        offset: ITEM_SIZE * sectionId,
        animated: false,
      });
    }, 100);
    backgroundAnimation.setValue(
      -height *
        ((timeData[sectionId].duration - sectionSeconds._value) /
          timeData[sectionId].duration)
    );
  }, [windowDimentions]);

  useEffect(() => {
    // setTimeMax(timeData[timeData.length - 1].end);
    sectionSeconds.setValue(0);
    sectionSecondsRemainsInputRef?.current?.setNativeProps({
      text: Math.ceil(timeData[0].end).toString(),
    });
  }, [timeData]);

  useEffect(() => {
    if (timerOn) {
      flatlist?.current?.scrollToOffset({
        offset: ITEM_SIZE * sectionId,
        animated: true,
      });
      sectionSeconds.setValue(0);
      backgroundAnimation.setValue(-height);
      timerAnimationLoop();
    }
    changeBackgroundColor(outPutColorByType(timeData[sectionId].type).value);
  }, [sectionId]);

  useEffect(() => {
    if (timerOn) {
      timerAnimationLoop(sectionSeconds._value);
    } else {
      sectionSeconds.stopAnimation();
    }
  }, [timerOn]);

  useEffect(() => {
    const scrollXListener = scrollX.addListener(({ value }) => {
      const newSectionId = scrollValueToSectionId(value);

      setInputRef?.current?.setNativeProps({
        text: "Set : " + timeData[newSectionId].setNo.toString(),
      });
      workoutInputRef?.current?.setNativeProps({
        text: "Workout : " + timeData[newSectionId].workoutNo.toString(),
      });
    });
    const sectionSecondsListener = sectionSeconds.addListener(({ value }) => {
      totalSeconds.setValue(timeData[sectionId].start + value);
      totalSecondsInputRef?.current?.setNativeProps({
        text: Math.ceil(totalSeconds._value).toString(),
      });
      sectionSecondsRemainsInputRef?.current?.setNativeProps({
        text: Math.ceil(timeData[sectionId].duration - value).toString(),
      });
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
      <View
        style={{
          borderWidth: BORDER_WIDTH,
          height: CENTER_CONTAINER_SIZE,
          width: CENTER_CONTAINER_SIZE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
          }}
        >
          <View style={styles.flatListLowerSubContainer}></View>
          <View style={styles.flatListLowerSubContainer}>
            <TextInput
              ref={sectionSecondsRemainsInputRef}
              defaultValue={"0"}
              style={{ fontSize: ITEM_SIZE * 0.5 }}
              editable={false}
            />
          </View>
          <View style={styles.flatListLowerSubContainer}></View>
        </View>
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
          style={{
            flexGrow: 0,
            overflow: "visible",
            borderWidth: BORDER_WIDTH,
          }}
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

              const newSectionId = scrollValueToSectionId(scrollX._value);

              totalSeconds.setValue(timeData[newSectionId].start);
              sectionSeconds.setValue(0);
              totalSecondsInputRef?.current?.setNativeProps({
                text: timeData[newSectionId].start.toString(),
              });

              Animated.timing(backgroundAnimation, {
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
              (index - 1.5) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
              (index + 1.5) * ITEM_SIZE,
            ];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.0, 0.8, 1, 0.8, 0.0],
            });

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 0.7, 1, 0.7, 0.5],
            });

            const indexOfFlaiListArray =
              item.workoutNo - 1 < 0 ? 0 : item.workoutNo - 1;

            const flatListArrayIndex =
              item.workoutNo == 0 ? 0 : item.workoutNo - 1;
            const imageUri =
              useTimerSetupState.timerSetup.workoutSetup.flatListArray[
                flatListArrayIndex
              ].image;

            return (
              <Animated.View
                style={{
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: BORDER_WIDTH,
                  backgroundColor: outPutColorByType(item.type).text,
                  opacity,
                  transform: [
                    {
                      scale,
                    },
                  ],
                }}
              >
                {/* <Text style={{ fontSize: 25 }}>{item.type}</Text> */}
                {/* <Text
                style={[
                  styles.text,
                  {
                    fontSize: height * 0.15,
                  },
                ]}
              >
                {item.id}
              </Text> */}
                {!(imageUri == "") && (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
                  />
                )}
                {/* <Text style={{ fontSize: 25 }}>
                  {
                    useTimerSetupState.timerSetup.workoutSetup.flatListArray[
                      indexOfFlaiListArray
                    ].name
                  }
                </Text> */}
              </Animated.View>
            );
          }}
        />
        <View
          style={{
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
          }}
        >
          <View style={styles.flatListLowerSubContainer}>
            <TextInput
              ref={setInputRef}
              defaultValue={"Set : " + timeData[0].setNo.toString()}
              editable={false}
            />
          </View>
          <View style={styles.flatListLowerSubContainer}>
            <CustomIcons
              icnoName={timerOn ? "pause-circle" : "play-circle"}
              disabled={!btnPressable || flatListScrolling}
              onPress={toggle}
              size={ITEM_SIZE * 0.6}
            />
          </View>
          <View style={styles.flatListLowerSubContainer}>
            <TextInput
              ref={workoutInputRef}
              defaultValue={"Workout : " + timeData[0].workoutNo.toString()}
              editable={false}
            />
          </View>
        </View>
      </View>
      {/* <Button
        disabled={!btnPressable || timerOn}
        onPress={reset}
        title="Reset"
      /> */}
      {/* <TextInput
        ref={totalSecondsInputRef}
        defaultValue={"0"}
        style={{ fontSize: 40 }}
        editable={false}
      /> */}
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
  flatListLowerSubContainer: {
    height: "100%",
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
  },
});
