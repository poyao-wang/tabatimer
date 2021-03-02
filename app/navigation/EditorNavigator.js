import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import EditorScreen from "../screen/EditorScreen";

import { createStackNavigator } from "@react-navigation/stack";
import EditorDetailScreen from "../screen/EditorDetailScreen";
import timerSetupDefaultData from "../config/timerSetupDefaultData";

const Stack = createStackNavigator();

function EditorNavigator(props) {
  const [mainData, setMainData] = useState(timerSetupDefaultData);

  return (
    <Stack.Navigator>
      <Stack.Screen name="EditorScreen" options={{ headerShown: false }}>
        {(props) => <EditorScreen {...props} mainData={mainData} />}
      </Stack.Screen>
      <Stack.Screen name="EditorDetailScreen">
        {(props) => (
          <EditorDetailScreen
            {...props}
            mainData={mainData}
            setMainData={setMainData}
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