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

import * as Google from "expo-google-app-auth";
import * as firebase from "firebase";

import { firebaseConfig } from "../../config";
import { IOS_CLIENT_ID } from "@env";

const BORDER_WIDTH = 1;
const FONT_FAMILY =
  Platform.OS === "ios"
    ? "Courier"
    : Platform.OS === "android"
    ? "monospace"
    : null;

const iosClientId = IOS_CLIENT_ID;

const androidClientId = "ANDROID_CLIENT_ID";

function AccountScreen({ navigation, mainData, setMainData, uiText }) {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  console.log(IOS_CLIENT_ID);

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    // console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        console.log("firebaseUser", firebaseUser);
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function (result) {
              console.log("user sign in");
              firebase
                .database()
                .ref("/users" + result.user.uid)
                .set({
                  gmail: result.user.email,
                  profile_picture:
                    result.additionalUserInfo.profile.profile_picture,
                  locale: result.additionalUserInfo.profile_picture.locale,
                  first_name: result.additionalUserInfo.given_name,
                  last_name: result.additionalUserInfo.first_name,
                })
                .then(function (snapshot) {});
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
              console.log(error);
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      });
  };

  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        // androidClientId: androidClientId,
        // iosClientId: IOSClientId,
        // behavior: "web",
        iosClientId: iosClientId, //enter ios client id
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

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
              signInWithGoogleAsync();
            }}
          >
            <Text>Login With Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default AccountScreen;
