import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated } from "react-native";

import EditorScreen from "./app/screen/EditorScreen";
import TimerScreen from "./app/screen/TimerScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

function MyTabBar({ state, descriptors, navigation, tabBarShowState }) {
  const tabBarAnimation = React.useRef(new Animated.Value(0)).current;

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

  return (
    <Animated.View
      style={{
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "30%",
        position: "absolute",
        bottom: "5%",
        flexDirection: "row",
        height: "7%",
        width: "90%",
        backgroundColor: "#e6ebf2",
        opacity,
        transform: [
          {
            translateY,
          },
        ],
      }}
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

const Tab = createBottomTabNavigator();

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} tabBarShowState={tabBarShow} />}
      >
        <Tab.Screen name="Timer">
          {() => <TimerScreen setTabBarShow={setTabBarShow} />}
        </Tab.Screen>
        <Tab.Screen name="Editor">{() => <EditorScreen />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
