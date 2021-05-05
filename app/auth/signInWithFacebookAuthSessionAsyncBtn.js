import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";
import firebase from "firebase";
import { Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function signInWithFacebookAuthSessionAsyncBtn() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    webClientId: "780300276005493",
    iosClientId: "780300276005493",
    androidClientId: "780300276005493",
    expoClientId: "780300276005493",
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
