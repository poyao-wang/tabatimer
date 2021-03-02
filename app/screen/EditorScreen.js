import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const BORDER_WIDTH = 0;

function EditorScreen({ navigation, mainData }) {
  const { width, height } = Dimensions.get("window");

  const listDimentions = {
    width: width > height ? height : width,
    height: height,
  };
  const ITEM_WIDTH = listDimentions.width * 0.9;
  const ITEM_HEIGHT = listDimentions.height * 0.1;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    flatList: {},
    itemContainer: {
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      flexDirection: "row",
    },
    titlesContainer: {
      borderWidth: BORDER_WIDTH,
    },
    title: {
      fontSize: ITEM_HEIGHT * 0.3,
      height: "50%",
      textAlign: "left",
      color: "black",
      fontWeight: "bold",
      borderWidth: BORDER_WIDTH,
    },
    subtitle: {
      height: "50%",
      fontSize: ITEM_HEIGHT * 0.2,
      paddingLeft: ITEM_WIDTH * 0.03,
      borderWidth: BORDER_WIDTH,
    },
    valueTextContainer: {
      flex: 1,
      borderWidth: BORDER_WIDTH,
      justifyContent: "center",
    },
    valueText: {
      borderWidth: BORDER_WIDTH,
      fontSize: ITEM_HEIGHT * 0.4,
      textAlign: "right",
      color: "black",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={mainData}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 0 }}
        bounces={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: ITEM_WIDTH,
              padding: ITEM_HEIGHT * 0.1,
              borderWidth: BORDER_WIDTH,
            }}
          />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditorDetailScreen", item);
            }}
            style={styles.itemContainer}
          >
            <View style={styles.titlesContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>
                {item.value}
                {" >"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default EditorScreen;
