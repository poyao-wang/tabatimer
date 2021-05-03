import { Alert } from "react-native";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as GoogleSignIn from "expo-google-sign-in";

import {
  IOS_CLIENT_ID,
  IOS_STANDALONE_APP_CLIENT_ID,
  ANDROID_CLIENT_ID,
  ANDROID_STANDALONE_APP_CLIENT_ID,
} from "@env";

const onSignIn = (googleUser) => {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.

    var credential = firebase.auth.GoogleAuthProvider.credential(
      googleUser.idToken,
      googleUser.accessToken
    );
    // Sign in with credential from the Google user.
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(function (result) {
        if (result.additionalUserInfo?.isNewUser) {
          console.log("User signed up for the first time.");
        } else {
          console.log("User signed in.");
        }

        firebase
          .database()
          .ref("/users/" + result.user.uid)
          .set({
            additionalUserInfo: result.additionalUserInfo,
          });
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
  });
};

const ExpoGo = async (params) => {
  try {
    const result = await Google.logInAsync({
      androidClientId: ANDROID_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      iosStandaloneAppClientId: IOS_STANDALONE_APP_CLIENT_ID,
      androidStandaloneAppClientId: ANDROID_STANDALONE_APP_CLIENT_ID,
      scopes: ["profile", "email"],
    });
    if (result.type === "success") {
      onSignIn(result);
    }
    return result;
  } catch (e) {
    Alert.alert("Sign In Error", JSON.stringify(e.message, null, 2));
    return e;
  }
};

const StandAlone = async (params) => {
  try {
    await GoogleSignIn.initAsync();
    await GoogleSignIn.askForPlayServicesAsync();
    const result = await GoogleSignIn.signInAsync();

    if (result.type === "success") {
      const { idToken, accessToken } = result.user.auth;
      onSignIn({ idToken, accessToken });
    }
    return result;
  } catch (e) {
    Alert.alert("Sign In Error", JSON.stringify(e.message, null, 2));
    return e;
  }
};

const signInWithGoogleAsync = { ExpoGo, StandAlone };

export default signInWithGoogleAsync;
