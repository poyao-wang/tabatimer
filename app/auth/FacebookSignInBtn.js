import { Button, Platform } from "react-native";
import { ResponseType } from "expo-auth-session";
import * as ExpoAuthSessionFacebook from "expo-auth-session/providers/facebook";
import * as React from "react";
import Constants from "expo-constants";
import firebase from "firebase";
import * as ExpoFacebook from "expo-facebook";

import { FACEBOOK_APP_ID } from "@env";

const isNative = Constants.appOwnership !== "expo" && Platform.OS !== "web";
const isAndroid = Platform.OS === "android";

function byExpoAuthSession() {
  const [
    request,
    response,
    promptAsync,
  ] = ExpoAuthSessionFacebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: FACEBOOK_APP_ID,
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;

      const credential = firebase.auth.FacebookAuthProvider.credential(
        access_token
      );
      // Sign in with the credential from the Facebook user.
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
            .update({
              additionalUserInfo: result.additionalUserInfo,
            });
        });
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="AuthSessionFbLogin"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}

function byExpoFacebook() {
  async function signInAsync(params) {
    try {
      await ExpoFacebook.initializeAsync({
        appId: FACEBOOK_APP_ID,
      });
      const result = await ExpoFacebook.logInWithReadPermissionsAsync({
        appId: FACEBOOK_APP_ID,
        permissions: ["public_profile"],
      });

      const { type, token } = result;
      if (type === "success") {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase
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
              .update({
                additionalUserInfo: result.additionalUserInfo,
              });
          });
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  return (
    <Button
      title="ExpoFbLogin"
      onPress={() => {
        signInAsync();
      }}
    />
  );
}

const FacebookSignInBtn =
  isNative && isAndroid ? byExpoFacebook : byExpoAuthSession;

export default FacebookSignInBtn;