import * as React from "react";
import * as Google from "expo-auth-session/providers/google";
import firebase from "firebase";
import { Button } from "react-native";

import {
  IOS_STANDALONE_APP_CLIENT_ID,
  ANDROID_STANDALONE_APP_CLIENT_ID,
  EXPO_CLIENT_ID,
  WEB_CLIENT_ID,
} from "@env";
import AuthButton from "./AuthButton";

function byExpoAuthSession(centerContainerSize) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_STANDALONE_APP_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_STANDALONE_APP_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
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
    <AuthButton
      btnText="Sign in with Google"
      color="#df4a32"
      centerContainerSize={centerContainerSize}
      iconName="google"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}

const GoogleSignInBtn = byExpoAuthSession;

export default GoogleSignInBtn;
