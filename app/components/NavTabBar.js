import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

function NavTabBar({ state, descriptors, navigation, tabBarShowState }) {
  const { width, height } = Dimensions.get("window");

  const tabBarAnimation = useRef(new Animated.Value(0)).current;

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
    outputRange: [0, 200],
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
      position: width > height ? "absolute" : "relative",
      left: width > height ? width * 0.05 : null,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: "5%",
      flexDirection: "row",
      height: width > height ? "13%" : "10%",
      aspectRatio: 4,
      backgroundColor: "#e6ebf2",
      // flexDirection: "column",
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderRadius: "50%",
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

        const isFocused = state.index === index;

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
            style={{ flex: 1, alignItems: "center" }}
            key={index}
          >
            <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

export default NavTabBar;
