import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated, Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Localization from "expo-localization";

import timerSetupDefaultData from "./app/config/timerSetupDefaultData";

import AppNavigator from "./app/navigation/AppNavigator";
import WelcomeScreen from "./app/screen/WelcomeScreen";
import useCache from "./app/utility/cache";
import uiTextDefaultData from "./app/config/uiTextDefaultData";
import { navigationRef } from "./app/navigation/rootNavigation";

const Stack = createStackNavigator();

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);
  const [language, setLanguage] = useState("eng");
  const [uiText, setUiText] = useState(uiTextDefaultData["eng"]);

  const lanCodeTransfer = (deviceLanCode) => {
    return deviceLanCode == "ja"
      ? "jpn"
      : deviceLanCode == "zh"
      ? "cht"
      : "eng";
  };

  const deviceLanguage = lanCodeTransfer(Localization.locale.split("-")[0]);

  const readFromCache = async () => {
    const result = await useCache.get();
    if (result) {
      if (!result.settings.language) {
        result.settings.language = deviceLanguage;
        useCache.store(result);
      }
      setTimerSetup(result);
      setLanguage(result.settings.language);
    } else {
      setLanguage(deviceLanguage);
    }
  };

  const setLanAndStoreToCache = (languageCode) => {
    setLanguage(languageCode);
    timerSetup.settings.language = languageCode;
    useCache.store(timerSetup);
  };

  useEffect(() => {
    readFromCache();
  }, []);

  useEffect(() => {
    setUiText(uiTextDefaultData[language]);
  }, [language]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator mode="card" backBehavior="none">
        <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }}>
          {(props) => (
            <WelcomeScreen
              {...props}
              onSetLanguage={(languageCode) => {
                setLanAndStoreToCache(languageCode);
              }}
              language={language}
            />
          )}
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
              useLanguageSetting={{ uiText, setLanguage }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
