import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";

import EditorDetailScreen from "../screen/EditorDetailScreen";
import EditorScreen from "../screen/EditorScreen";

const Stack = createStackNavigator();

function EditorNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EditorScreen" options={{ headerShown: false }}>
        {(props) => <EditorScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="EditorDetailScreen" options={{ headerShown: false }}>
        {(props) => <EditorDetailScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default EditorNavigator;
