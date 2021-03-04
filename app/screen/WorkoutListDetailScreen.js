import React from "react";
import NumberPicker from "../components/NumberPicker";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  Button,
  FlatList,
  Dimensions,
} from "react-native";

function WorkoutListDetailScreen({ route, navigation, mainData, setMainData }) {
  const { width, height } = Dimensions.get("window");

  const itemSize = Math.round(width > height ? height * 0.1 : width * 0.1);
  const selectorSize = itemSize * 5;

  const finalValue = { minutes: 0, seconds: 0, numbers: 0 };

  const item = route.params;

  const makeWorkoutsArray = () => {};

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>{item.name}</Text>
      <View
        style={{
          width: selectorSize,
          height: selectorSize,
          flexDirection: "row",
        }}
      ></View>
      <Button
        fontSize={30}
        title="Ok"
        onPress={() => {
          navigation.navigate("WorkoutListScreen");
        }}
      />
      <Button
        fontSize={30}
        title="ValueCheck"
        onPress={() => {
          console.log("Value check");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default WorkoutListDetailScreen;
