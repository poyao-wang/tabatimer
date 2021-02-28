import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated } from "react-native";

import EditorScreen from "./app/screen/EditorScreen";
import TimerScreen from "./app/screen/TimerScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavTabBar from "./app/components/NavTabBar";

const Tab = createBottomTabNavigator();

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);

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
        <Tab.Screen name="Editor">{() => <EditorScreen />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
