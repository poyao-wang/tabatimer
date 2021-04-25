import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";

import useWindowDimentions from "../hook/useWindowDimentions";
import CustomIcons from "../components/CustomIcons";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";
import rootNavigation from "../navigation/rootNavigation";
import colors from "../config/colors";

const BORDER_WIDTH = 1;
const FONT_FAMILY =
  Platform.OS === "ios"
    ? "Courier"
    : Platform.OS === "android"
    ? "monospace"
    : null;

function AccountScreen({ navigation, mainData, setMainData, uiText }) {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: BORDER_WIDTH,
    },
    googleLoginBtn: {
      width: containerHeight * 0.7,
      height: containerHeight * 0.3,
      borderWidth: BORDER_WIDTH,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            borderWidth: BORDER_WIDTH,
            borderColor: colors.dark,
            borderRadius: centerContainerSize * 0.04,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity style={styles.googleLoginBtn}>
            <Text>Login With Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default AccountScreen;
