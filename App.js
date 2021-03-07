import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated, Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import timerSetupDefaultData from "./app/config/timerSetupDefaultData";

import AppNavigator from "./app/navigation/AppNavigator";
import WelcomeScreen from "./app/screen/WelcomeScreen";

const Stack = createStackNavigator();

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);

  return (
    <NavigationContainer>
      <Stack.Navigator mode="card" backBehavior="none">
        <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }}>
          {(props) => <WelcomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen
          name="AppNavigator"
          options={{ headerShown: false, gestureEnabled: false }}
          // options={{ headerShown: false }}
        >
          {(props) => (
            <AppNavigator
              {...props}
              useTabBarShowState={{ tabBarShow, setTabBarShow }}
              useTimerSetupState={{ timerSetup, setTimerSetup }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
