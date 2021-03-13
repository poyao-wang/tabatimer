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
import { Audio } from "expo-av";

import useWindowDimentions from "../hook/useWindowDimentions";
import CustomIcons from "../components/CustomIcons";

const BORDER_WIDTH = 0;

const outPutColorByType = (type) => {
  if (type == "prepare") return { value: 0, text: "rgba(200,200,200,0.7)" };
  if (type == "prepare-dark") return { value: 0, text: "rgba(200,200,200,1)" };
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

  const [sound, setSound] = useState();
  const [tickingSound, setTickingSound] = useState();

  async function playTickingSound(type) {
    const { sound } =
      type == "tick"
        ? await Audio.Sound.createAsync(require("../assets/tick.mp3"))
        : type == "countDown"
        ? await Audio.Sound.createAsync(require("../assets/count-down.mp3"))
        : undefined;

    setTickingSound(sound);
    if (sound) await sound.playAsync();
  }

  async function playSound(type) {
    const { sound } =
      type == "workOutStart"
        ? await Audio.Sound.createAsync(require("../assets/workout-start.mp3"))
        : type == "countDown"
        ? await Audio.Sound.createAsync(require("../assets/count-down.mp3"))
        : type == "rest"
        ? await Audio.Sound.createAsync(require("../assets/rest-bell.mp3"))
        : type == "finished"
        ? await Audio.Sound.createAsync(require("../assets/finished.mp3"))
        : undefined;

    setSound(sound);
    if (sound) await sound.playAsync();
  }

  React.useEffect(() => {
    return tickingSound
      ? () => {
          tickingSound.unloadAsync();
        }
      : undefined;
  }, [tickingSound]);

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const longSide = width > height ? width : height;
  const shortside = width > height ? height : width;

  const longSideCal = longSide * 0.6;
  const shortSodeCal = shortside;

  const CENTER_CONTAINER_SIZE =
    shortSodeCal > longSideCal ? longSideCal : shortSodeCal;
  const ITEM_SIZE = Math.round(CENTER_CONTAINER_SIZE * 0.45);
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
    const soundType =
      timeData[sectionId].type == "prepare"
        ? "rest"
        : timeData[sectionId].type == "workout"
        ? "workOutStart"
        : timeData[sectionId].type == "rest"
        ? "rest"
        : "";

    playSound(soundType);
    Animated.sequence([
      Animated.delay(300),
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
      ]),
    ]).start(({ finished }) => {
      if (sectionId + 1 > timeData.length - 1) {
        setTimerOn(false);
        setTabBarShow(true);
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
    setTabBarShow(timerOn);
  }

  function setPlusOrMinus(plus) {
    setTimerOn(false);
    setTabBarShow(true);

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
      text:
        timeData[newSectionId].setNo +
        " / " +
        useTimerSetupState.timerSetup.sets.value,
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
    setTabBarShow(true);
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
      text: "1" + " / " + useTimerSetupState.timerSetup.sets.value,
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
        setFlatListArray(
          useTimerSetupState.timerSetup.workoutSetup.flatListArray
        );
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
      console.log("setNo", timeData[sectionId].setNo);
      console.log("workoutNo", timeData[sectionId].workoutNo);
      console.log("type", timeData[sectionId].type);
      console.log("--------------");

      let flatListIndex = timeData[sectionId].workoutNo - 1;
      if (flatListIndex < 0) flatListIndex = 0;

      flatlist?.current?.scrollToOffset({
        offset: ITEM_SIZE * flatListIndex,
        animated: true,
      });
      sectionSeconds.setValue(0);
      backgroundAnimation.setValue(-height);
      setInputRef?.current?.setNativeProps({
        text:
          timeData[sectionId].setNo.toString() +
          " / " +
          useTimerSetupState.timerSetup.sets.value,
      });
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
      const workoutNo = Math.round(value / ITEM_SIZE) + 1;

      workoutInputRef?.current?.setNativeProps({
        text:
          workoutNo.toString() +
          " / " +
          useTimerSetupState.timerSetup.workouts.value,
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
          text: newSectionSecondsRemainsCeil.toString(),
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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "40%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            ref={sectionSecondsRemainsInputRef}
            defaultValue={"0"}
            style={[
              styles.text,
              {
                fontSize: ITEM_SIZE * 0.7,
                borderWidth: BORDER_WIDTH,
                width: ITEM_SIZE * 2,
                height: ITEM_SIZE * 0.7,
              },
            ]}
            editable={false}
          />
        </View>
        <View
          style={{
            height: "50%",
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
                const workoutNo = Math.round(scrollX._value / ITEM_SIZE) + 1;
                let setNo = timeData[sectionId].setNo;
                if (setNo <= 0) setNo = 1;

                const totalWorkoutAmt =
                  useTimerSetupState.timerSetup.workouts.value;

                const newSectionId =
                  1 + (setNo - 1) * 2 * totalWorkoutAmt + (workoutNo - 1) * 2;

                totalSeconds.setValue(timeData[newSectionId].start);
                sectionSeconds.setValue(0);
                totalSecondsInputRef?.current?.setNativeProps({
                  text: timeData[newSectionId].start.toString(),
                });
                setInputRef?.current?.setNativeProps({
                  text:
                    timeData[newSectionId].setNo +
                    " / " +
                    useTimerSetupState.timerSetup.sets.value,
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
                outputRange: [0.5, 0.6, 1, 0.6, 0.5],
              });

              const translateX = scrollX.interpolate({
                inputRange,
                outputRange: [
                  -ITEM_SIZE * 0.5,
                  -ITEM_SIZE * 0.2,
                  1,
                  ITEM_SIZE * 0.2,
                  ITEM_SIZE * 0.5,
                ],
              });

              let imageUri = item.image;

              if (!imageUri) imageUri = "";

              return (
                <Animated.View
                  style={{
                    width: ITEM_SIZE,
                    height: ITEM_SIZE,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: ITEM_SIZE * 0.07,
                    borderRadius: ITEM_SIZE * 0.15,
                    borderColor: outPutColorByType(item.type + "-dark").text,
                    overflow: "hidden",
                    backgroundColor: outPutColorByType(item.type).text,
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
                      source={{ uri: imageUri }}
                      style={{ width: "100%", height: "100%" }}
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
                      {item.id + 1}
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
      </View>
      <View
        style={{
          position: "absolute",
          bottom:
            width > height
              ? null
              : (height - CENTER_CONTAINER_SIZE) / 2 - ITEM_SIZE * 0.6,
          left:
            width > height
              ? (width - CENTER_CONTAINER_SIZE) / 2 - ITEM_SIZE * 0.8
              : null,
          // height: ITEM_SIZE * 0.6,
          // width: "100%",
          flexDirection: width > height ? "column" : "row",
          height: width > height ? CENTER_CONTAINER_SIZE : ITEM_SIZE * 0.6,
          width: width > height ? ITEM_SIZE * 0.8 : CENTER_CONTAINER_SIZE,
          borderWidth: BORDER_WIDTH,

          // flexDirection: "row",
        }}
      >
        <View style={styles.flatListLowerSubContainer}>
          <Button
            disabled={!btnPressable || flatListScrolling || timerOn}
            onPress={() => setPlusOrMinus(true)}
            title="+"
          />
          <TextInput
            ref={setInputRef}
            defaultValue={
              timeData[0].setNo.toString() +
              " / " +
              useTimerSetupState.timerSetup.sets.value
            }
            editable={false}
            style={{ fontSize: 30 }}
          />
          <Button
            disabled={!btnPressable || flatListScrolling || timerOn}
            onPress={() => setPlusOrMinus(false)}
            title="-"
          />
        </View>
        <View style={styles.flatListLowerSubContainer}>
          <CustomIcons
            icnoName={timerOn ? "pause-circle" : "play-circle"}
            disabled={!btnPressable || flatListScrolling}
            onPress={toggle}
            size={ITEM_SIZE * 0.45}
          />
          <Button
            disabled={!btnPressable || timerOn}
            onPress={reset}
            title="Reset"
          />
        </View>
        <View style={styles.flatListLowerSubContainer}>
          <TextInput
            ref={workoutInputRef}
            defaultValue={
              timeData[0].workoutNo.toString() +
              " / " +
              useTimerSetupState.timerSetup.workouts.value
            }
            editable={false}
            style={{ fontSize: 30 }}
          />
        </View>
      </View>
      <Button
        disabled={!btnPressable || timerOn}
        onPress={reset}
        title="Reset"
      />
      <Button onPress={() => playSound("finished")} title="Sound" />
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
