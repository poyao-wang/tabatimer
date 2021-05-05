import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

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
    signInWithAppleAsync,
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
      height: containerHeight * 0.2,
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
            onLongPress={() => {
              Alert.alert(JSON.stringify(currentUser, null, 2));
            }}
          >
            <Text>
              {!currentUser
                ? "Not signed in."
                : !currentUser.displayName
                ? "No user name."
                : currentUser.displayName}
              {currentUser
                ? " Signed in with " + currentUser.providerData[0]?.providerId
                : null}
            </Text>
          </TouchableOpacity>
          {Platform.OS === "ios" && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{ width: 200, height: 44 }}
              onPress={() => {
                signInWithAppleAsync();
              }}
            />
          )}
        </View>
      </View>
    </>
  );
}

export default AccountScreen;
