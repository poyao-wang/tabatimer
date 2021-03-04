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
  const sectionSeconds = React.useRef(new Animated.Value(0)).current;
  const totalSeconds = React.useRef(new Animated.Value(0)).current;
  const backgroundAnimation = React.useRef(new Animated.Value(0)).current;

  const [sectionId, setSectionId] = useState(0);

  function toggle() {
    if (sectionSeconds._value >= timeMax) return Alert.alert("End");
    setTimerOn(!timerOn);
    setTabBarShow(timerOn);
  }

  function reset() {
    setTimerOn(false);
    setTabBarShow(true);
    Animated.timing(sectionSeconds, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    flatlist?.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
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
      backgroundAnimation.setValue(0);
      Animated.parallel([
        Animated.timing(sectionSeconds, {
          toValue: timeData[sectionId].duration,
          duration: timeData[sectionId].duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: height,
          duration: timeData[sectionId].duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(({ finished }) => {
        if (sectionId + 1 > timeData.length - 1) {
          setTimerOn(false);
          setTabBarShow(true);
        } else {
          if (finished) setSectionId(sectionId + 1);
        }
      });
    }
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
          toValue: height,
          duration:
            (timeData[sectionId].duration - sectionSeconds._value) * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(({ finished }) => {
        if (sectionId + 1 > timeData.length - 1) {
          setTimerOn(false);
          setTabBarShow(true);
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
            backgroundColor: "gray",
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
              toValue: 0,
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
