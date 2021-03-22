import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Button, Text, Image, Animated } from "react-native";
import * as Animatable from "react-native-animatable";

import colors from "../config/colors";
import useWindowDimentions from "../hook/useWindowDimentions";
import CustomIcons from "../components/CustomIcons";
import AppIconSvg from "../components/AppIconSvg";

const BORDER_WIDTH = 0;

const blink = {
  0: {
    scale: 1,
    opacity: 0.8,
  },
  0.5: {
    scale: 1.1,
    opacity: 1,
  },
  1: {
    scale: 1,
    opacity: 0.8,
  },
};

function WelcomeScreen({ navigation }) {
  const windowDimentions = useWindowDimentions();
  const CENTER_CONTAINER_SIZE = windowDimentions.centerContainerSize;
  const ITEM_SIZE = Math.round(CENTER_CONTAINER_SIZE * 0.4);

  const middleIconShow = useRef(new Animated.Value(0)).current;
  const playButtonShow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(middleIconShow, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(middleIconShow, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(playButtonShow, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          borderWidth: BORDER_WIDTH,
          height: CENTER_CONTAINER_SIZE,
          width: CENTER_CONTAINER_SIZE,
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={[
              styles.text,
              {
                fontSize: ITEM_SIZE * 0.2,
                textAlignVertical: "bottom",
                borderWidth: BORDER_WIDTH,
                width: ITEM_SIZE * 2,
                letterSpacing: ITEM_SIZE * 0.07,
                color: colors.medium,
              },
            ]}
            editable={false}
          >
            Taba Timer
          </Text>
        </View>
        <Animated.View
          style={{
            height: "40%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: middleIconShow,
            transform: [
              {
                scale: middleIconShow,
              },
            ],
          }}
        >
          <AppIconSvg />
        </Animated.View>
        <Animated.View
          style={{
            height: "30%",
            width: "100%",
            borderWidth: BORDER_WIDTH,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: playButtonShow,
          }}
        >
          <Animatable.View
            animation={blink}
            duration={700}
            iterationDelay={2000}
            iterationCount="infinite"
          >
            <CustomIcons
              icnoName="play-circle"
              onPress={() => {
                navigation.navigate("AppNavigator");
              }}
              size={ITEM_SIZE * 0.45}
            />
          </Animatable.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: {
    textAlign: "center",
    color: colors.dark,
  },
});
export default WelcomeScreen;
