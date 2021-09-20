import React from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";

import AccountScreen from "../screen/AccountScreen";
import EditorNavigator from "./EditorNavigator";
import NavTabBar from "../components/NavTabBar";
import TimerScreen from "../screen/TimerScreen";
import WorkoutListNavigator from "./WorkoutListNavigator";
import { AvailableIconNames } from "../components/CustomIcons";
import { StackScreenProps } from "@react-navigation/stack";
import { MainNavigatorParamList } from "../../App";

export type AppNavigatorParamList = {
  Timer: undefined;
  Editor: undefined;
  WorkoutList: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<AppNavigatorParamList>();

export interface CustomAppNavigatorScreenOptions
  extends BottomTabNavigationOptions {
  iconName: AvailableIconNames;
}

type AppNavigatorPropsFromNavigator = StackScreenProps<
  MainNavigatorParamList,
  "AppNavigator"
>;

const AppNavigator: React.FC<AppNavigatorPropsFromNavigator> = () => {
  return (
    <Tab.Navigator tabBar={(props) => <NavTabBar {...props} />}>
      <Tab.Screen
        name="Timer"
        options={{ iconName: "timer" } as CustomAppNavigatorScreenOptions}
      >
        {() => <TimerScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Editor"
        options={
          { iconName: "square-edit-outline" } as CustomAppNavigatorScreenOptions
        }
      >
        {() => <EditorNavigator />}
      </Tab.Screen>
      <Tab.Screen
        name="WorkoutList"
        options={
          {
            iconName: "format-list-bulleted",
          } as CustomAppNavigatorScreenOptions
        }
      >
        {() => <WorkoutListNavigator />}
      </Tab.Screen>
      <Tab.Screen name="Account" options={{ iconName: "account-cog" } as any}>
        {() => <AccountScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigator;
