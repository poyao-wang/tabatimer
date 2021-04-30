import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AccountScreen from "../screen/AccountScreen";
import EditorNavigator from "../navigation/EditorNavigator";
import NavTabBar from "../components/NavTabBar";
import TimerScreen from "../screen/TimerScreen";
import WorkoutListNavigator from "../navigation/WorkoutListNavigator";

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <NavTabBar {...props} />}>
      <Tab.Screen name="Timer" options={{ iconName: "timer" }}>
        {() => <TimerScreen />}
      </Tab.Screen>
      <Tab.Screen name="Editor" options={{ iconName: "square-edit-outline" }}>
        {() => <EditorNavigator />}
      </Tab.Screen>
      <Tab.Screen
        name="WorkoutList"
        options={{ iconName: "format-list-bulleted" }}
      >
        {() => <WorkoutListNavigator />}
      </Tab.Screen>
      <Tab.Screen name="Account" options={{ iconName: "account-cog" }}>
        {() => <AccountScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default AppNavigator;
