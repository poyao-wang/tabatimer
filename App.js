import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated, Dimensions } from "react-native";

import EditorScreen from "./app/screen/EditorScreen";
import TimerScreen from "./app/screen/TimerScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavTabBar from "./app/components/NavTabBar";
import WorkoutListScreen from "./app/screen/WorkoutListScreen";
import EditorNavigator from "./app/navigation/EditorNavigator";
import timerSetupDefaultData from "./app/config/timerSetupDefaultData";
import WorkoutListNavigator from "./app/navigation/WorkoutListNavigator";

const Tab = createBottomTabNavigator();

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => (
          <NavTabBar {...props} tabBarShowState={tabBarShow} />
        )}
      >
        <Tab.Screen name="Timer">
          {() => (
            <TimerScreen
              setTabBarShow={setTabBarShow}
              useTimerSetupState={{ timerSetup, setTimerSetup }}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Editor">
          {() => (
            <EditorNavigator
              useTimerSetupState={{ timerSetup, setTimerSetup }}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="WorkoutList">
          {() => (
            <WorkoutListNavigator
              useTimerSetupState={{ timerSetup, setTimerSetup }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
