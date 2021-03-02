import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import EditorScreen from "../screen/EditorScreen";

import { createStackNavigator } from "@react-navigation/stack";
import EditorDetailScreen from "../screen/EditorDetailScreen";

const mainDataDefault = [
  {
    id: 0,
    title: "Preparation Time",
    subtitle: "Preparation before Start",
    type: "time",
    value: 5,
  },
  {
    id: 1,
    title: "Workout Time",
    subtitle: "Duration for  Workout",
    type: "time",
    value: 5,
  },
  {
    id: 2,
    title: "Rest Time",
    subtitle: "Rest between Workouts",
    type: "time",
    value: 5,
  },
  {
    id: 3,
    title: "Rest Time - Sets",
    subtitle: "Rest between Sets",
    type: "number",
    value: 2,
  },
  {
    id: 4, //
    title: "Sets",
    subtitle: "Set Amount",
    type: "number",
    value: 2,
  },
  {
    id: 5,
    title: "Workouts",
    subtitle: "Workouts per Set",
    type: "number",
    value: 1,
  },
];

const Stack = createStackNavigator();

function EditorNavigator(props) {
  const [mainData, setMainData] = useState(mainDataDefault);

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
