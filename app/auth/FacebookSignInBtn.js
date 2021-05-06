import * as React from "react";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";
import firebase from "firebase";
import { Button } from "react-native";
import { FACEBOOK_APP_ID } from "@env";

function signInWithFacebookAuthSessionAsyncBtn() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
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

const FacebookSignInBtn = signInWithFacebookAuthSessionAsyncBtn;

export default FacebookSignInBtn;
