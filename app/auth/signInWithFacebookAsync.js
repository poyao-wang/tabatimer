import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FACEBOOK_APP_ID } from "@env";

const facebookAppId = FACEBOOK_APP_ID;

export default async function signInWithFacebookAsync(params) {
  try {
    await Facebook.initializeAsync({
      appId: facebookAppId,
    });
    const result = await Facebook.logInWithReadPermissionsAsync({
      appId: facebookAppId,
      permissions: ["public_profile"],
    });

    const { type, token } = result;
    if (type === "success") {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
