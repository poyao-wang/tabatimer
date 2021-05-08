import React from "react";
import { View, StyleSheet, TextInput, Text, Platform } from "react-native";
import colors from "../config/colors";

const BORDER_WIDTH = 0;

function FractionDisplay({
  title = "",
  refs,
  defaultValue = 99,
  totalAmount = 99,
  itemSize = 30,
}) {
  return (
    <View style={styles.container}>
      <Text
        style={{
          position: "absolute",
          top: -itemSize * 0.1,
          textAlign: "center",
          fontSize: itemSize * 0.1,
        }}
      >
        {title}
      </Text>
      <TextInput
        ref={refs}
        defaultValue={defaultValue.toString()}
        editable={false}
        style={{
          fontSize:
            Platform.OS === "android" ? itemSize * 0.33 : itemSize * 0.4,
          textAlign: "center",
          color: colors.dark,
        }}
        borderWidth={BORDER_WIDTH}
      />
      <View
        style={{
          opacity: 0.5,
          borderTopWidth: 1,
          paddingTop: itemSize * 0.01,
        }}
      >
        <Text
          style={{
            textAlign: "right",
            fontSize: itemSize * 0.1,
            // opacity: 0.9,
          }}
        >
          {totalAmount.toString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderWidth: BORDER_WIDTH,
    // justifyContent: "center",
    alignItems: "center",
  },
});
export default FractionDisplay;
