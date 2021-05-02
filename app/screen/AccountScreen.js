import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import useWindowDimentions from "../hook/useWindowDimentions";
import colors from "../config/colors";
import { useAuth } from "../auth/AuthContext";

const BORDER_WIDTH = 1;

function AccountScreen() {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  const {
    currentUser,
    signInWithGoogleAsync,
    signInWithFacebookAsync,
    logout,
  } = useAuth();

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
          <TouchableOpacity
            style={styles.googleLoginBtn}
            onPress={() => {
              signInWithFacebookAsync();
            }}
          >
            <Text>Login With Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.googleLoginBtn}
            onPress={() => {
              signInWithGoogleAsync();
            }}
          >
            <Text>Login With Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.googleLoginBtn}
            onPress={() => {
              logout();
            }}
          >
            <Text>
              {currentUser?.displayName ? currentUser.displayName : "no user"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default AccountScreen;
