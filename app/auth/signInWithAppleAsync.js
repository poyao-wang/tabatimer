import * as firebase from "firebase";
import * as AppleAuthentication from "expo-apple-authentication";
import { Alert } from "react-native";

function nonceGen(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function signInWithAppleAsync(params) {
  try {
    const nonceString = nonceGen(32);

    const result = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      state: nonceString,
    });

    const provider = new firebase.auth.OAuthProvider("apple.com");
    const authCredential = provider.credential({
      idToken: result.identityToken,
      rawNonce: nonceString,
    });

    firebase
      .auth()
      .signInWithCredential(authCredential)
      .then(function (result) {
        if (result.additionalUserInfo?.isNewUser) {
          console.log("User signed up for the first time.");
        } else {
          console.log("User signed in.");
        }

        Alert.alert("currentFirebaseUser", JSON.stringify(result, null, 2));

        firebase
          .database()
          .ref("/users/" + result.user.uid)
          .update({
            additionalUserInfo: result.additionalUserInfo,
          });
      });
  } catch (e) {
    Alert.alert("Error", JSON.stringify(e.message));
  }
}
