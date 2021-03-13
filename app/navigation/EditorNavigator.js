import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import EditorScreen from "../screen/EditorScreen";

import { createStackNavigator } from "@react-navigation/stack";
import EditorDetailScreen from "../screen/EditorDetailScreen";
import timerSetupDefaultData from "../config/timerSetupDefaultData";

const Stack = createStackNavigator();

function EditorNavigator({ useTimerSetupState, setTabBarShow }) {
  const mainData = useTimerSetupState.timerSetup;
  const setMainData = useTimerSetupState.setTimerSetup;
  return (
    <Stack.Navigator>
      <Stack.Screen name="EditorScreen" options={{ headerShown: false }}>
        {(props) => <EditorScreen {...props} mainData={mainData} />}
      </Stack.Screen>
      <Stack.Screen name="EditorDetailScreen" options={{ headerShown: false }}>
        {(props) => (
          <EditorDetailScreen
            {...props}
            mainData={mainData}
            setMainData={setMainData}
            setTabBarShow={setTabBarShow}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default EditorNavigator;
