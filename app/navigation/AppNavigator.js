import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EditorDetailScreen from "../screen/EditorDetailScreen";
import timerSetupDefaultData from "../config/timerSetupDefaultData";
import NavTabBar from "../components/NavTabBar";

import EditorScreen from "../screen/EditorScreen";
import WorkoutListScreen from "../screen/WorkoutListScreen";
import EditorNavigator from "../navigation/EditorNavigator";
import WorkoutListNavigator from "../navigation/WorkoutListNavigator";
import TimerScreen from "../screen/TimerScreen";

const Tab = createBottomTabNavigator();

function AppNavigator({ useTimerSetupState, useTabBarShowState, navigation }) {
  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
      }),
    [navigation]
  );

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <NavTabBar {...props} tabBarShowState={useTabBarShowState.tabBarShow} />
      )}
    >
      <Tab.Screen name="Timer">
        {() => (
          <TimerScreen
            setTabBarShow={useTabBarShowState.setTabBarShow}
            useTimerSetupState={useTimerSetupState}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Editor">
        {() => <EditorNavigator useTimerSetupState={useTimerSetupState} />}
      </Tab.Screen>
      <Tab.Screen name="WorkoutList">
        {() => <WorkoutListNavigator useTimerSetupState={useTimerSetupState} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default AppNavigator;
