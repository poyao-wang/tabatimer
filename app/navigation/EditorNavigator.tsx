import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import EditorDetailScreen from "../screen/EditorDetailScreen";
import EditorScreen from "../screen/EditorScreen";
import { ItemEditorScreenProps } from "../config/timerSetupDefaultData";

export type EditorNavigatorParamList = {
  EditorScreen: undefined;
  EditorDetailScreen: {
    itemKey: string;
    item: ItemEditorScreenProps;
    title: string;
    subtitle: string;
  };
};

const Stack = createStackNavigator<EditorNavigatorParamList>();

const EditorNavigator: React.FC = () => {
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
};

export default EditorNavigator;
