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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AccountScreen from "../screen/AccountScreen";

const Tab = createBottomTabNavigator();

function AppNavigator({
  useTimerSetupState,
  useTabBarShowState,
  navigation,
  useLanguageSetting: { uiText },
}) {
  // React.useEffect(
  //   () =>
  //     navigation.addListener("beforeRemove", (e) => {
  //       // Prevent default behavior of leaving the screen
  //       e.preventDefault();
  //     }),
  //   [navigation]
  // );

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <NavTabBar {...props} tabBarShowState={useTabBarShowState.tabBarShow} />
      )}
    >
      <Tab.Screen name="Timer" options={{ iconName: "timer" }}>
        {() => (
          <TimerScreen
            setTabBarShow={useTabBarShowState.setTabBarShow}
            useTimerSetupState={useTimerSetupState}
            uiText={uiText}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Editor" options={{ iconName: "square-edit-outline" }}>
        {() => (
          <EditorNavigator
            useTimerSetupState={useTimerSetupState}
            setTabBarShow={useTabBarShowState.setTabBarShow}
            uiText={uiText}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="WorkoutList"
        options={{ iconName: "format-list-bulleted" }}
      >
        {() => (
          <WorkoutListNavigator
            useTimerSetupState={useTimerSetupState}
            setTabBarShow={useTabBarShowState.setTabBarShow}
            uiText={uiText}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Account" options={{ iconName: "account-cog" }}>
        {() => (
          <AccountScreen
            useTimerSetupState={useTimerSetupState}
            setTabBarShow={useTabBarShowState.setTabBarShow}
            uiText={uiText}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default AppNavigator;
