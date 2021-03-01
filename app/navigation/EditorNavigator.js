import React from "react";
import { View, StyleSheet } from "react-native";
import EditorScreen from "../screen/EditorScreen";

import { createStackNavigator } from "@react-navigation/stack";
import EditorDetailScreen from "../screen/EditorDetailScreen";

const Stack = createStackNavigator();

function EditorNavigator(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EditorScreen"
        component={EditorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EditorDetailScreen" component={EditorDetailScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default EditorNavigator;
