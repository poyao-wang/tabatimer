import {
  AppState,
  AppStateStatus,
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";

import { MainContext } from "../config/MainContext";
import colors from "../config/colors";
import CustomIcons from "../components/CustomIcons";
import FractionDisplay from "../components/FractionDisplay";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useWindowDimentions from "../hook/useWindowDimentions";

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
};

const TimerScreen: React.FC = () => {
  const {
    timer: useTimerSetupState,
    tabBar: { setTabBarShow },
    language: { uiText },
  } = useContext(MainContext);
  const windowDimentions = useWindowDimentions();
  const { width, height } = windowDimentions;

  const appState = useRef(AppState.currentState);

  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [timeData, setTimeData] = useState(
    useTimerSetupState.timerSetup.workoutSetup.workoutArray
  );
  const [flatListArray, setFlatListArray] = useState(
    useTimerSetupState.timerSetup.workoutSetup.flatListArray
  );
  const [timerOn, setTimerOn] = useState(false);
  const [btnPressable, setBtnPressable] = useState(true);
  const [flatListScrolling, setFlatListScrolling] = useState(false);
  const [sectionId, setSectionId] = useState(0);
  const [screenFocused, setScreenFocused] = useState(false);

  const [tickSound, setTickSound] = useState<Audio.Sound>();
  const [countDownSound, setCountDownSound] = useState<Audio.Sound>();
  const [workOutStartSound, setWorkOutStartSound] = useState<Audio.Sound>();
  const [restSound, setRestSound] = useState<Audio.Sound>();
  const [finishedSound, setFinishedSound] = useState<Audio.Sound>();

  const handleAppStateChange: (nextAppState: AppStateStatus) => void = (
    nextAppState
  ) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    // console.log("AppState", appState.current);
  };

  async function loadSound() {
    try {
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
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  async function unloadSound() {
    try {
      if (tickSound) tickSound.unloadAsync();
      if (countDownSound) countDownSound.unloadAsync();
      if (workOutStartSound) workOutStartSound.unloadAsync();
      if (restSound) restSound.unloadAsync();
      if (finishedSound) finishedSound.unloadAsync();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  async function playTickingSound(type) {
    try {
      if (!useTimerSetupState.timerSetup.settings.playSound) return;
      const sound =
        type == "tick"
          ? tickSound
          : type == "countDown"
          ? countDownSound
          : undefined;
      if (sound) await sound.replayAsync();
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.message);
    }
  }

  async function playSound(type) {
    try {
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
    } catch (error) {
      // Alert.alert(error.message);
      console.log(error.message);
    }
  }

  const CENTER_CONTAINER_SIZE = windowDimentions.centerContainerSize;
  const ITEM_SIZE = Math.round(CENTER_CONTAINER_SIZE * 0.4);
  const ITEM_SPACING = (CENTER_CONTAINER_SIZE - ITEM_SIZE) / 2;

  const flatlist = useRef<FlatList>();
  const totalSecondsInputRef = useRef<TextInput>();
  const sectionSecondsRemainsInputRef = useRef<TextInput>();
  const setInputRef = useRef<TextInput>();
  const workoutInputRef = useRef<TextInput>();

  const scrollX: any = React.useRef(new Animated.Value(0)).current;
  const sectionSeconds: any = React.useRef(new Animated.Value(0)).current;
  const sectionSecondsRemainsCeil: any = React.useRef(
    new Animated.Value(0)
  ).current;
  const totalSeconds: any = React.useRef(new Animated.Value(0)).current;
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

  const sectionTypeTextTrans = (textFromTimeData) => {
    if (textFromTimeData == "prepare")
      return uiText.timerScreen.sectionTypePrepare;
    if (textFromTimeData == "workout")
      return uiText.timerScreen.sectionTypeWorkout;
    if (textFromTimeData == "rest") return uiText.timerScreen.sectionTypeRest;
    return null;
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

      backgroundAnimation.setValue(
        -height *
          ((timeData[sectionId].duration - sectionSeconds._value) /
            timeData[sectionId].duration)
      );

      return () => {
        setScreenFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    loadSound();
    return () => unloadSound();
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    sectionTypeTextOpacity.setValue(0);
    Animated.timing(sectionTypeTextOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (screenFocused && appStateVisible !== "active") {
      setTimerOn(false);
      setTimeout(() => {
        navBarAndBottomViewAnime(false);
        navBarAndBottomViewAnime(true);
      }, 500);
    }
  }, [screenFocused, appStateVisible]);

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
            {sectionTypeTextTrans(timeData[sectionId].type)}
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

                  {imageUri && (
                    <Image
                      source={imageUri}
                      style={{ width: "101%", height: "101%" }}
                    />
                  )}
                  {!imageUri && (
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
            justifyContent: "center",
          }}
        >
          <View style={styles.flatListLowerSubContainer}>
            <FractionDisplay
              refs={setInputRef}
              defaultValue={1}
              totalAmount={useTimerSetupState.timerSetup.sets.value}
              itemSize={ITEM_SIZE}
              title={uiText.timerScreen.fractionDisplayTitleLeft}
            />
          </View>
          <View style={styles.flatListLowerSubContainer}>
            <CustomIcons
              iconName={timerOn ? "pause-circle" : "play-circle"}
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
              title={uiText.timerScreen.fractionDisplayTitleRight}
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
            iconName={"plus-circle"}
            disabled={!btnPressable || flatListScrolling || timerOn}
            onPress={() => setPlusOrMinus(true)}
            size={CENTER_CONTAINER_SIZE * 0.13}
          />
        </View>
        <View style={styles.flatListLowerSubContainer}>
          <CustomIcons
            iconName={"minus-circle"}
            disabled={!btnPressable || flatListScrolling || timerOn}
            onPress={() => setPlusOrMinus(false)}
            size={CENTER_CONTAINER_SIZE * 0.13}
          />
        </View>
        <View style={styles.flatListLowerSubContainer}>
          <CustomIcons
            iconName={"restore"}
            disabled={!btnPressable || timerOn}
            onPress={() => {
              Alert.alert(
                uiText.timerScreen.resetAlertTitle,
                uiText.timerScreen.resetAlertMsg,
                [
                  {
                    text: uiText.timerScreen.resetAlertCancel,
                    onPress: () => console.log("Cancel Pressed"),
                  },
                  {
                    text: uiText.timerScreen.resetAlertOk,
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
    </View>
  );
};

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TimerScreen;
