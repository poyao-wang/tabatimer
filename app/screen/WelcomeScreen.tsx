import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useEffect, useRef } from "react";
import Constants from "expo-constants";

import AppIconSvg from "../components/AppIconSvg";
import colors from "../config/colors";
import CustomIcons from "../components/CustomIcons";
import useWindowDimentions from "../hook/useWindowDimentions";
import { StackScreenProps } from "@react-navigation/stack";
import { MainNavigatorParamList } from "../../App";

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

type WelcomeScreenPropsFromNavigator = StackScreenProps<
  MainNavigatorParamList,
  "WelcomeScreen"
>;

interface WelcomeScreenProps extends WelcomeScreenPropsFromNavigator {
  language: string;
  onSetLanguage: (languageCode: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  navigation,
  language,
  onSetLanguage,
}) => {
  const windowDimentions = useWindowDimentions();
  const { width, height, centerContainerSize } = windowDimentions;
  const CENTER_CONTAINER_SIZE = windowDimentions.centerContainerSize;
  const ITEM_SIZE = Math.round(CENTER_CONTAINER_SIZE * 0.4);

  const middleIconShow = useRef(new Animated.Value(0)).current;
  const playButtonShow = useRef(new Animated.Value(0)).current;

  const engBtnActive = useRef(new Animated.Value(0)).current;
  const jaBtnActive = useRef(new Animated.Value(0)).current;
  const chtBtnActive = useRef(new Animated.Value(0)).current;

  const engBtnOpacity = engBtnActive.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const jaBtnOpacity = jaBtnActive.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const chtBtnOpacity = chtBtnActive.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const engBtnScale = engBtnActive.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });
  const jaBtnScale = jaBtnActive.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });
  const chtBtnScale = chtBtnActive.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

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

  useEffect(() => {
    languageAnime(language);
  }, [language]);

  const languageAnime = (lanCode) => {
    Animated.parallel([
      Animated.timing(engBtnActive, {
        toValue: lanCode === "en" ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(jaBtnActive, {
        toValue: lanCode === "ja" ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(chtBtnActive, {
        toValue: lanCode === "zh_Hant_TW" ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
              iconName="play-circle"
              onPress={() => {
                navigation.navigate("AppNavigator");
              }}
              onLongPress={() => {
                const ver = Constants.manifest.version;
                const { deviceName } = Constants;
                console.log(ver);
                Alert.alert("App Info", "v" + ver + `\n` + deviceName);
              }}
              size={ITEM_SIZE * 0.45}
            />
          </Animatable.View>
        </Animated.View>
      </View>
      <Animated.View
        style={{
          position: "absolute",
          bottom:
            width > height
              ? (height - centerContainerSize) / 2
              : ((height - centerContainerSize) / 2 -
                  centerContainerSize * 0.2) /
                2,
          left: width > height ? "5%" : (width - centerContainerSize) / 2,
          flexDirection: width > height ? "column" : "row",
          height:
            width > height ? centerContainerSize : centerContainerSize * 0.24,
          width:
            width > height ? centerContainerSize * 0.24 : centerContainerSize,
          borderWidth: BORDER_WIDTH,
          opacity: playButtonShow,
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: jaBtnOpacity,
            transform: [
              {
                scale: jaBtnScale,
              },
            ],
          }}
        >
          <CustomIcons
            iconName={"alpha-j-box"}
            textBelow="日本語"
            onPress={() => {
              onSetLanguage("ja");
            }}
            size={centerContainerSize * 0.13}
            color={colors.medium}
          />
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: engBtnOpacity,
            transform: [
              {
                scale: engBtnScale,
              },
            ],
          }}
        >
          <CustomIcons
            iconName={"alpha-e-box"}
            textBelow="English"
            size={centerContainerSize * 0.13}
            onPress={() => {
              onSetLanguage("en");
            }}
            color={colors.medium}
          />
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: chtBtnOpacity,
            transform: [
              {
                scale: chtBtnScale,
              },
            ],
          }}
        >
          <CustomIcons
            iconName={"alpha-c-box"}
            textBelow="中　文"
            onPress={() => {
              onSetLanguage("zh_Hant_TW");
            }}
            size={centerContainerSize * 0.13}
            color={colors.medium}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: {
    textAlign: "center",
    color: colors.dark,
  },
});
export default WelcomeScreen;
