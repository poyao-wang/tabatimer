import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated, Dimensions } from "react-native";

import EditorScreen from "./app/screen/EditorScreen";
import TimerScreen from "./app/screen/TimerScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavTabBar from "./app/components/NavTabBar";
import WorkoutListScreen from "./app/screen/WorkoutListScreen";
import EditorNavigator from "./app/navigation/EditorNavigator";

const Tab = createBottomTabNavigator();

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);

  const [screenDimentions, setScreenDimentions] = useState(
    Dimensions.get("window")
  );

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimentions(window);
    });
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => (
          <NavTabBar {...props} tabBarShowState={tabBarShow} />
        )}
      >
        <Tab.Screen name="Timer">
          {() => <TimerScreen setTabBarShow={setTabBarShow} />}
        </Tab.Screen>
        <Tab.Screen name="Editor" component={EditorNavigator} />
        <Tab.Screen name="WorkoutList">
          {() => <WorkoutListScreen />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
