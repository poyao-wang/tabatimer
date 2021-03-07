import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated, Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import timerSetupDefaultData from "./app/config/timerSetupDefaultData";

import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);

  return (
    <NavigationContainer>
      <AppNavigator
        useTabBarShowState={{ tabBarShow, setTabBarShow }}
        useTimerSetupState={{ timerSetup, setTimerSetup }}
      />
    </NavigationContainer>
  );
}
