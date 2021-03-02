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

function EditorDetailScreen({ route, navigation, mainData, setMainData }) {
  const { width, height } = Dimensions.get("window");

  const itemSize = Math.round(width > height ? height * 0.1 : width * 0.1);
  const selectorSize = itemSize * 5;

  const finalValue = { minutes: 0, seconds: 0, numbers: 0 };

  const item = route.params;

  const timePicker = () => (
    <>
      <NumberPicker
        itemSize={itemSize}
        numItems={60}
        onScroll={(value) => {
          finalValue.minutes = value;
        }}
      />
      <NumberPicker
        itemSize={itemSize}
        numItems={60}
        onScroll={(value) => {
          finalValue.seconds = value;
        }}
      />
    </>
  );
  const numberPicker = () => (
    <>
      <NumberPicker
        itemSize={itemSize}
        numItems={100}
        onScroll={(value) => {
          finalValue.numbers = value;
        }}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>{item.title}</Text>
      <View
        style={{
          width: selectorSize,
          height: selectorSize,
          flexDirection: "row",
        }}
      >
        {item.type == "time" ? timePicker() : numberPicker()}
      </View>
      <Button
        fontSize={30}
        title="Ok"
        onPress={() => {
          mainData[item.id].value =
            item.type == "time"
              ? finalValue.minutes * 60 + finalValue.seconds
              : finalValue.numbers;
          setMainData(mainData);
          navigation.navigate("EditorScreen");
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
export default EditorDetailScreen;
