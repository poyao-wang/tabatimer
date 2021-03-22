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
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

import useWindowDimentions from "../hook/useWindowDimentions";
import CustomIcons from "../components/CustomIcons";
import FractionDisplay from "../components/FractionDisplay";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import colors from "../config/colors";

const BORDER_WIDTH = 0;
const FONT_FAMILY =
  Platform.OS === "ios"
    ? "Menlo"
    : Platform.OS === "android"
    ? "monospace"
    : null;

const outPutColorByType = (type) => {
  if (type == "prepare") return { value: 0, text: "rgba(200,200,200,0.7)" };
  if (type == "prepare-dark") return { value: 0, text: "rgba(150,150,150,1)" };
  if (type == "workout") return { value: 1, text: "rgba(249, 142, 142, 1)" };
  if (type == "workout-dark") return { value: 1, text: "rgba(243, 77, 77,1)" };
  if (type == "rest") return { value: 2, text: "rgba(79, 236, 160,1)" };
  if (type == "rest-dark") return { value: 2, text: "rgba(29, 195, 114,1)" };
  if (type == "finished") return { value: 3, text: "rgba(255,255,255,0.7)" };
  if (type == "finished-dark") return { value: 3, text: "rgba(255,255,255,1)" };

  return "gray";
};

export default function TimerScreen({ setTabBarShow, useTimerSetupState }) {
  const windowDimentions = useWindowDimentions();
  const { width, height } = windowDimentions;

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );
  const [flatListArray, setFlatListArray] = useState(
    useTimerSetupState.timerSetup.workoutSetup.flatListArray
  );
  // const [timeMax, setTimeMax] = useState(
  //   useTimerSetupState.timerSetup.workoutSetup.workoutArray[timeData.length - 1]
  //     .end
  // );
  const [timerOn, setTimerOn] = useState(false);
  const [btnPressable, setBtnPressable] = useState(true);
  const [flatListScrolling, setFlatListScrolling] = useState(false);
  const [sectionId, setSectionId] = useState(0);
  const [screenFocused, setScreenFocused] = useState(false);

  const [tickSound, setTickSound] = useState();
  const [countDownSound, setCountDownSound] = useState();
  const [workOutStartSound, setWorkOutStartSound] = useState();
  const [restSound, setRestSound] = useState();
  const [finishedSound, setFinishedSound] = useState();

  async function loadSound() {
    const { sound: tickSound } = await Audio.Sound.createAsync(
      require("../assets/tick.mp3")
    );
    setTickSound(tickSound);
    const { sound: countDownSound } = await Audio.Sound.createAsync(
      require("../assets/count-down.mp3")
    );
    setCountDownSound(countDownSound);
    const { sound: workOutStartSound } = await Audio.Sound.createAsync(
      require("../assets/workout-start.mp3")
    );
    setWorkOutStartSound(workOutStartSound);
    const { sound: restSound } = await Audio.Sound.createAsync(
      require("../assets/rest-bell.mp3")
    );
    setRestSound(restSound);
    const { sound: finishedSound } = await Audio.Sound.createAsync(
      require("../assets/finished.mp3")
    );
    setFinishedSound(finishedSound);
  }

  async function unloadSound() {
    if (tickSound) tickSound.unloadAsync();
    if (countDownSound) countDownSound.unloadAsync();
    if (workOutStartSound) workOutStartSound.unloadAsync();
    if (restSound) restSound.unloadAsync();
    if (finishedSound) finishedSound.unloadAsync();
  }

  async function playTickingSound(type) {
    if (!useTimerSetupState.timerSetup.settings.playSound) return;
    const sound =
      type == "tick"
        ? tickSound
        : type == "countDown"
        ? countDownSound
        : undefined;
    if (sound) await sound.replayAsync();
  }

  async function playSound(type) {
    if (!useTimerSetupState.timerSetup.settings.playSound) return;
    const sound =
      type == "workOutStart"
        ? workOutStartSound
        : type == "countDown"
        ? countDownSound
        : type == "rest"
        ? restSound
        : type == "finished"
        ? finishedSound
        : undefined;

    if (sound) await sound.replayAsync();
  }

  React.useEffect(() => {
    loadSound();
    return () => unloadSound();
  }, []);

  const CENTER_CONTAINER_SIZE = windowDimentions.centerContainerSize;
  const ITEM_SIZE = Math.round(CENTER_CONTAINER_SIZE * 0.4);
  const ITEM_SPACING = (CENTER_CONTAINER_SIZE - ITEM_SIZE) / 2;

  const flatlist = useRef();
  const totalSecondsInputRef = useRef();
  const sectionSecondsRemainsInputRef = useRef();
  const setInputRef = useRef();
  const workoutInputRef = useRef();

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const sectionSeconds = React.useRef(new Animated.Value(0)).current;
  const sectionSecondsRemainsCeil = React.useRef(new Animated.Value(0)).current;
  const totalSeconds = React.useRef(new Animated.Value(0)).current;
  const backgroundAnimation = React.useRef(new Animated.Value(-height)).current;
  const backgroundColorAnimation = React.useRef(new Animated.Value(0)).current;
  const bottomViewAnimation = useRef(new Animated.Value(0)).current;
  const sectionTypeTextOpacity = useRef(new Animated.Value(0)).current;

  const backgroundColorForScreen = backgroundColorAnimation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      outPutColorByType("prepare").text,
      outPutColorByType("workout").text,
      outPutColorByType("rest").text,
      outPutColorByType("finished").text,
    ],
  });
  const colorForText = backgroundColorAnimation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      outPutColorByType("prepare-dark").text,
      outPutColorByType("workout-dark").text,
      outPutColorByType("rest-dark").text,
      outPutColorByType("finished-dark").text,
    ],
  });

  const bottomViewOpacity = bottomViewAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const bottomViewTranslateY = bottomViewAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width > height ? height : height * 0.3],
  });

  const sectionSecondsRemainsOpacity = sectionTypeTextOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const scrollValueToSectionId = (scrollValue) => {
    const idMax = timeData.length - 1;
    const newSectionId = Math.round(scrollValue / ITEM_SIZE);
    return newSectionId <= 0 ? 0 : newSectionId >= idMax ? idMax : newSectionId;
  };

  const navBarAndBottomViewAnime = (show) => {
    setTabBarShow(show);

    Animated.timing(bottomViewAnimation, {
      toValue: show ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  function changeBackgroundColor(toValue) {
    Animated.timing(backgroundColorAnimation, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function timerAnimationLoop(startTime = 0) {
    const soundType =
      timeData[sectionId].type == "prepare"
        ? "rest"
        : timeData[sectionId].type == "workout"
        ? "workOutStart"
        : timeData[sectionId].type == "rest"
        ? "rest"
        : "";

    const textAnime = Animated.sequence([
      Animated.timing(sectionTypeTextOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(sectionTypeTextOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]);

    const countDownAnime = Animated.parallel([
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
    ]);

    playSound(soundType);

    Animated.parallel([
      Animated.sequence([
        Animated.delay(300), //
        countDownAnime,
      ]),
      textAnime,
    ]).start(({ finished }) => {
      if (sectionId + 1 > timeData.length - 1) {
        setTimerOn(false);
        navBarAndBottomViewAnime(true);
        if (finished) {
          changeBackgroundColor(outPutColorByType("finished").value);
          playSound("finished");
        }
      } else {
        if (finished) setSectionId(sectionId + 1);
      }
    });
  }

  function toggle() {
    // if (sectionSeconds._value >= timeMax) return Alert.alert("End");
    setTimerOn(!timerOn);
    navBarAndBottomViewAnime(timerOn);
  }

  function setPlusOrMinus(plus) {
    setTimerOn(false);
    navBarAndBottomViewAnime(true);

    const workoutNo = 1;
    let setNo = timeData[sectionId].setNo;
    if (setNo == 0) setNo = 1;
    setNo = plus ? setNo + 1 : setNo - 1;

    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;
    const totalSetAmt = useTimerSetupState.timerSetup.sets.value;

    if (setNo <= 0) return;
    if (setNo > totalSetAmt) return;

    const newSectionId =
      1 + (setNo - 1) * 2 * totalWorkoutAmt + (workoutNo - 1) * 2;

    totalSeconds.setValue(timeData[newSectionId].start);
    sectionSeconds.setValue(0);
    totalSecondsInputRef?.current?.setNativeProps({
      text: timeData[newSectionId].start.toString(),
    });
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
    setInputRef?.current?.setNativeProps({
      text: timeData[newSectionId].setNo.toString(),
    });

    Animated.timing(backgroundAnimation, {
      toValue: -height,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setSectionId(newSectionId);
  }

  function reset() {
    setTimerOn(false);
    navBarAndBottomViewAnime(true);
    totalSeconds.setValue(0);
    sectionSeconds.setValue(0);
    totalSecondsInputRef?.current?.setNativeProps({
      text: timeData[0].start.toString(),
    });
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
    setInputRef?.current?.setNativeProps({
      text: "1",
    });
    sectionSecondsRemainsInputRef?.current?.setNativeProps({
      text: timeDataSetupFunctions
        .totalSecToMinAndSec(timeData[0].end)
        .mixedText.toString(),
    });

    Animated.timing(backgroundAnimation, {
      toValue: -height,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setSectionId(0);
  }

  function scrollingChangeSection() {
    const workoutNo = Math.round(scrollX._value / ITEM_SIZE) + 1;
    let setNo = timeData[sectionId].setNo;
    if (setNo <= 0) setNo = 1;

    const totalWorkoutAmt = useTimerSetupState.timerSetup.workouts.value;

    const newSectionId =
      1 + (setNo - 1) * 2 * totalWorkoutAmt + (workoutNo - 1) * 2;
    totalSeconds.setValue(timeData[newSectionId].start);
    sectionSeconds.setValue(0);

    sectionSecondsRemainsInputRef?.current?.setNativeProps({
      text: timeDataSetupFunctions
        .totalSecToMinAndSec(useTimerSetupState.timerSetup.workoutTime.value)
        .mixedText.toString(),
    });

    totalSecondsInputRef?.current?.setNativeProps({
      text: timeData[newSectionId].start.toString(),
    });
    setInputRef?.current?.setNativeProps({
      text: timeData[newSectionId].setNo.toString(),
    });

    Animated.timing(backgroundAnimation, {
      toValue: -height,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setSectionId(newSectionId);
  }

  useFocusEffect(
    React.useCallback(() => {
      setScreenFocused(true);
      if (useTimerSetupState.timerSetup.workoutSetup.updated) {
        setFlatListArray(
          useTimerSetupState.timerSetup.workoutSetup.flatListArray
        );
        setTimeData(useTimerSetupState.timerSetup.workoutSetup.workoutArray);
        reset();
        useTimerSetupState.timerSetup.workoutSetup.updated = false;
        useTimerSetupState.setTimerSetup(useTimerSetupState.timerSetup);
      }
      return () => {
        setScreenFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    sectionTypeTextOpacity.setValue(0);
    Animated.timing(sectionTypeTextOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (screenFocused) {
      setTimerOn(false);
      backgroundAnimation.setValue(
        -height *
          ((timeData[sectionId].duration - sectionSeconds._value) /
            timeData[sectionId].duration)
      );
      setTimeout(() => {
        navBarAndBottomViewAnime(false);
        navBarAndBottomViewAnime(true);
      }, 500);
    }
  }, [windowDimentions]);

  useEffect(() => {
    // setTimeMax(timeData[timeData.length - 1].end);
    sectionSeconds.setValue(0);
    sectionSecondsRemainsInputRef?.current?.setNativeProps({
      text: timeDataSetupFunctions
        .totalSecToMinAndSec(timeData[0].end)
        .mixedText.toString(),
    });
  }, [timeData]);

  useEffect(() => {
    changeBackgroundColor(outPutColorByType(timeData[sectionId].type).value);
    if (timerOn) {
      let flatListIndex = timeData[sectionId].workoutNo - 1;
      if (flatListIndex < 0) flatListIndex = 0;

      flatlist?.current?.scrollToOffset({
        offset: ITEM_SIZE * flatListIndex,
        animated: true,
      });
      sectionSeconds.setValue(0);
      backgroundAnimation.setValue(-height);
      setInputRef?.current?.setNativeProps({
        text: timeData[sectionId].setNo.toString(),
      });
      timerAnimationLoop();
    }
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
      const workoutNo = Math.round(value / ITEM_SIZE) + 1;

      workoutInputRef?.current?.setNativeProps({
        text: workoutNo.toString(),
      });
    });
    const sectionSecondsListener = sectionSeconds.addListener(({ value }) => {
      totalSeconds.setValue(timeData[sectionId].start + value);
      totalSecondsInputRef?.current?.setNativeProps({
        text: Math.ceil(totalSeconds._value).toString(),
      });

      const newSectionSecondsRemainsCeil = Math.ceil(
        timeData[sectionId].duration - value
      );
      if (newSectionSecondsRemainsCeil !== sectionSecondsRemainsCeil._value) {
        if (timerOn) {
          if (
            newSectionSecondsRemainsCeil == 3 ||
            newSectionSecondsRemainsCeil == 2 ||
            newSectionSecondsRemainsCeil == 1
          ) {
            playTickingSound("countDown");
          } else if (newSectionSecondsRemainsCeil == 0) {
          } else {
            playTickingSound("tick");
          }
        }
        sectionSecondsRemainsCeil.setValue(newSectionSecondsRemainsCeil);
        sectionSecondsRemainsInputRef?.current?.setNativeProps({
          text: timeDataSetupFunctions
            .totalSecToMinAndSec(newSectionSecondsRemainsCeil)
            .mixedText.toString(),
        });
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
      <View
        style={{
          borderWidth: BORDER_WIDTH,
          height: CENTER_CONTAINER_SIZE,
          width: CENTER_CONTAINER_SIZE,
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: sectionSecondsRemainsOpacity,
          }}
        >
          <TextInput
            ref={sectionSecondsRemainsInputRef}
            defaultValue={"0"}
            style={[
              styles.text,
              {
                fontSize: ITEM_SIZE * 0.5,
                textAlignVertical: "bottom",
                borderWidth: BORDER_WIDTH,
                width: ITEM_SIZE * 2,
                fontFamily: FONT_FAMILY,
              },
            ]}
            editable={false}
          />
        </Animated.View>
        <Animated.View
          style={{
            position: "absolute",
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: sectionTypeTextOpacity,
          }}
        >
          <Animated.Text
            style={[
              styles.text,
              {
                fontSize: ITEM_SIZE * 0.45,
                textAlignVertical: "bottom",
                borderWidth: BORDER_WIDTH,
                color: colorForText,
              },
            ]}
          >
            {timeData[sectionId].type.toUpperCase()}
          </Animated.Text>
        </Animated.View>
        <View
          style={{
            height: "40%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.FlatList
            initialNumToRender={10}
            ref={flatlist}
            data={flatListArray}
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
                scrollingChangeSection();
              }
            }}
            onScrollBeginDrag={() => {
              setTimerOn(false);
              navBarAndBottomViewAnime(true);
            }}
            onScrollEndDrag={() => {
              setFlatListScrolling(false);
              const totalWorkoutAmt =
                useTimerSetupState.timerSetup.workouts.value;
              const atTheEnd =
                scrollX._value == ITEM_SIZE * (totalWorkoutAmt - 1);
              const atTheStart = scrollX._value == 0;
              if (atTheEnd || atTheStart) {
                scrollingChangeSection();
              }
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
                outputRange: [0.5, 0.6, 1, 0.6, 0.5],
              });

              const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [
                  -ITEM_SIZE * 0.5,
                  -ITEM_SIZE * 0.1,
                  1,
                  ITEM_SIZE * 0.1,
                  ITEM_SIZE * 0.5,
                ],
              });

              let imageUri = timeDataSetupFunctions.checkImageUri(item.image);

              return (
                <Animated.View
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: ITEM_SIZE * 0.04,
                    borderRadius: ITEM_SIZE * 0.15,
                    borderColor: colors.dark,
                    overflow: "hidden",
                    backgroundColor: colors.light,
                    opacity,
                    transform: [
                      {
                        translateX,
                      },
                      {
                        scale,
                      },
                    ],
                  }}
                >
                  {/* <Text style={{ fontSize: 25 }}>{item.type}</Text> */}

                  {!(imageUri == "") && (
                    <Image
                      source={imageUri}
                      style={{ width: "101%", height: "101%" }}
                    />
                  )}
                  {imageUri == "" && (
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: ITEM_SIZE * 0.5,
                        },
                      ]}
                    >
                      {(item.id + 1).toString()}
                    </Text>
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
        </View>
        <View
          style={{
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.flatListLowerSubContainer}>
            <FractionDisplay
              refs={setInputRef}
              defaultValue={1}
              totalAmount={useTimerSetupState.timerSetup.sets.value}
              itemSize={ITEM_SIZE}
              title="SET"
            />
          </View>
          <View style={styles.flatListLowerSubContainer}>
            <CustomIcons
              icnoName={timerOn ? "pause-circle" : "play-circle"}
              disabled={!btnPressable || flatListScrolling}
              onPress={toggle}
              size={ITEM_SIZE * 0.45}
            />
          </View>
          <View style={styles.flatListLowerSubContainer}>
            <FractionDisplay
              refs={workoutInputRef}
              defaultValue={1}
              totalAmount={useTimerSetupState.timerSetup.workouts.value}
              itemSize={ITEM_SIZE}
              title="WORK"
            />
          </View>
        </View>
      </View>
      <Animated.View
        style={{
          position: "absolute",
          bottom:
            width > height
              ? (height - CENTER_CONTAINER_SIZE) / 2
              : ((height - CENTER_CONTAINER_SIZE) / 2 -
                  CENTER_CONTAINER_SIZE * 0.2) /
                2,
          left: width > height ? "5%" : null,
          flexDirection: width > height ? "column" : "row",
          height: width > height ? CENTER_CONTAINER_SIZE : ITEM_SIZE * 0.6,
          width: width > height ? ITEM_SIZE * 0.8 : CENTER_CONTAINER_SIZE,
          borderWidth: BORDER_WIDTH,
          opacity: bottomViewOpacity,
          transform: [
            {
              translateY: bottomViewTranslateY,
            },
          ],
        }}
      >
        <View style={styles.flatListLowerSubContainer}>
          <CustomIcons
            icnoName={"plus-circle"}
            disabled={!btnPressable || flatListScrolling || timerOn}
            onPress={() => setPlusOrMinus(true)}
            size={CENTER_CONTAINER_SIZE * 0.13}
          />
        </View>
        <View style={styles.flatListLowerSubContainer}>
          <CustomIcons
            icnoName={"minus-circle"}
            disabled={!btnPressable || flatListScrolling || timerOn}
            onPress={() => setPlusOrMinus(false)}
            size={CENTER_CONTAINER_SIZE * 0.13}
          />
        </View>
        <View style={styles.flatListLowerSubContainer}>
          <CustomIcons
            icnoName={"restore"}
            disabled={!btnPressable || timerOn}
            onPress={() => {
              Alert.alert(
                "Reset Timer",
                "Do you want to reset the Timer?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      reset();
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
            size={CENTER_CONTAINER_SIZE * 0.13}
          />
        </View>
      </Animated.View>
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
    // height: "100%",
    // width: "32%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
