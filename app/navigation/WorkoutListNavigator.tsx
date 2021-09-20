import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import WorkoutListDetailScreen from "../screen/WorkoutListDetailScreen";
import WorkoutListScreen from "../screen/WorkoutListScreen";
import { ItemFlatListArrayProps } from "../config/timerSetupDefaultData";

export type WorkoutListNavigatorParamList = {
  WorkoutListScreen: undefined;
  WorkoutListDetailScreen: ItemFlatListArrayProps;
};

const Stack = createStackNavigator<WorkoutListNavigatorParamList>();

const WorkoutListNavigator: React.FC = () => {
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
};

export default WorkoutListNavigator;
