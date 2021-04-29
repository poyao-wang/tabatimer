import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import EditorScreen from "../screen/EditorScreen";

import { createStackNavigator } from "@react-navigation/stack";
import EditorDetailScreen from "../screen/EditorDetailScreen";
import timerSetupDefaultData from "../config/timerSetupDefaultData";
import WorkoutListScreen from "../screen/WorkoutListScreen";
import WorkoutListDetailScreen from "../screen/WorkoutListDetailScreen";

const Stack = createStackNavigator();

function WorkoutListNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutListScreen" options={{ headerShown: false }}>
        {(props) => <WorkoutListScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="WorkoutListDetailScreen"
        options={{ headerShown: false }}
      >
        {(props) => <WorkoutListDetailScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default WorkoutListNavigator;
