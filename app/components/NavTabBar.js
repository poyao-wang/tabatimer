import React, { useRef, useState, useEffect } from "react";
import useWindowDimentions from "../hook/useWindowDimentions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import colors from "../config/colors";

function NavTabBar({ state, descriptors, navigation, tabBarShowState }) {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const tabBarAnimation = useRef(new Animated.Value(0)).current;

  const BAR_SIZE = centerContainerSize * 0.2;

  const tabBarShowAnime = () => {
    Animated.timing(tabBarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const tabBarHideAnime = () => {
    Animated.timing(tabBarAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const opacity = tabBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const translateY = tabBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width > height ? -height : -height * 0.3],
  });

  useEffect(() => {
    if (tabBarShowState) {
      tabBarShowAnime();
    } else {
      tabBarHideAnime();
    }
  }, [tabBarShowState]);

  const styles = StyleSheet.create({
    container: {
      // borderWidth: 2,
      // position: width > height ? "absolute" : "relative",
      right: width > height ? "5%" : null,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top:
        width > height
          ? (height - centerContainerSize) / 2
          : ((height - centerContainerSize) / 2 - BAR_SIZE) / 2,
      flexDirection: width > height ? "column" : "row",
      height: width > height ? centerContainerSize : BAR_SIZE,
      width: width > height ? BAR_SIZE : centerContainerSize,
      aspectRatio: width > height ? 0.25 : 4,
      // backgroundColor: "#e6ebf2",
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          // borderRadius: 20,
          opacity,
          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const iconName = options.iconName;
        const isFocused = state.index === index;

        const tabIconAnimation = useRef(new Animated.Value(0)).current;

        useEffect(() => {
          if (isFocused) {
            Animated.timing(tabIconAnimation, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.timing(tabIconAnimation, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        }, [isFocused]);

        const iconScale = tabIconAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });
        const iconOpacity = tabIconAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        });

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            key={index}
          >
            {iconName && (
              <Animated.View
                style={{
                  opacity: iconOpacity,
                  transform: [
                    {
                      scale: iconScale,
                    },
                  ],
                }}
              >
                <MaterialCommunityIcons //
                  name={iconName}
                  size={centerContainerSize * 0.13}
                  color={colors.dark}
                  style={
                    {
                      // borderWidth: 2,
                      // padding: BAR_SIZE * 0.06,
                      // borderRadius: BAR_SIZE * 0.2,
                    }
                  }
                />
              </Animated.View>
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

export default NavTabBar;
