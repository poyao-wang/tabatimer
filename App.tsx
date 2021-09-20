import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Localization from "expo-localization";
import Constants from "expo-constants";
import semver from "semver";

import timerSetupDefaultData from "./app/config/timerSetupDefaultData";

import AppNavigator from "./app/navigation/AppNavigator";
import WelcomeScreen from "./app/screen/WelcomeScreen";
import useCache from "./app/utility/cache";
import uiTextDefaultData from "./app/config/uiTextDefaultData";
import { navigationRef } from "./app/navigation/rootNavigation";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  DATABASE_URL,
  MESSAGE_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "@env";
// import { firebaseConfig } from "./config";
import firebase from "firebase/app";
import { MainContext } from "./app/config/MainContext";
import { AuthProvider } from "./app/auth/AuthContext";
import timeDataSetupFunctions from "./app/config/timeDataSetupFunctions";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export type MainNavigatorParamList = {
  WelcomeScreen: undefined;
  AppNavigator: undefined;
};

const Stack = createStackNavigator<MainNavigatorParamList>();
const currentAppVer = Constants.manifest.version;

export default function App() {
  const [tabBarShow, setTabBarShow] = useState(true);
  const [timerSetup, setTimerSetup] = useState(timerSetupDefaultData);
  const [language, setLanguage] = useState("en");
  const [uiText, setUiText] = useState(uiTextDefaultData["en"]);

  const lanCodeTransfer = (deviceLanCode) => {
    return deviceLanCode == "ja"
      ? "ja"
      : deviceLanCode == "zh"
      ? "zh_Hant_TW"
      : "en";
  };

  const deviceLanguage = lanCodeTransfer(Localization.locale.split("-")[0]);

  const readFromCache = async () => {
    try {
      const result = await useCache.get();
      if (result) {
        const ifcacheAppVerValid = semver.valid(result.settings?.appVer);
        const cacheAppVer = ifcacheAppVerValid
          ? result.settings?.appVer
          : "0.0.0";
        const currGtCache = semver.gt(currentAppVer, cacheAppVer);
        // console.log("current:", "v" + currentAppVer);
        // console.log("cache:", "v" + cacheAppVer);
        // console.log("current > cache:", currGtCache);

        const cacheLan = result.settings?.language;
        const lanToSet =
          cacheLan === "cht"
            ? "zh_Hant_TW"
            : cacheLan === "jpn"
            ? "ja"
            : cacheLan === "eng"
            ? "en"
            : cacheLan
            ? cacheLan
            : deviceLanguage;

        // console.log("cacheLan", cacheLan);
        // console.log("lanToSet", lanToSet);

        if (currGtCache) {
          timerSetup.prepareTime.value = result.prepareTime.value;
          timerSetup.restTime.value = result.restTime.value;
          timerSetup.restTimeSets.value = result.restTimeSets.value;
          timerSetup.sets.value = result.sets.value;
          timerSetup.workouts.value = result.workouts.value;
          timerSetup.workoutTime.value = result.workoutTime.value;
          timerSetup.workoutSetup.flatListArray =
            result.workoutSetup.flatListArray;
          timerSetup.workoutSetup.workoutArray =
            timeDataSetupFunctions.makeWorkoutsArray(result);
          timerSetup.settings.language = lanToSet;

          useCache.store(timerSetup);
          setTimerSetup(timerSetup);
        } else {
          setTimerSetup(result);
        }
        setLanguage(lanToSet);
      } else {
        setLanguage(deviceLanguage);
      }
    } catch (error) {
      Alert.alert(error.message);
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
      <AuthProvider>
        <MainContext.Provider
          value={{
            tabBar: { tabBarShow, setTabBarShow },
            timer: { timerSetup, setTimerSetup },
            language: { uiText, setLanguage },
          }}
        >
          <Stack.Navigator mode="card">
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
              {(props) => <AppNavigator {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </MainContext.Provider>
      </AuthProvider>
    </NavigationContainer>
  );
}
