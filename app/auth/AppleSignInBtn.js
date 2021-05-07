import { Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as firebase from "firebase";
import React from "react";

import { useAuth } from "./AuthContext";

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

function AppleSignInBtn({ centerContainerSize }) {
  const { setLoading } = useAuth();

  async function signInWithAppleAsync() {
    try {
      const nonceString = nonceGen(32);

      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        state: nonceString,
      });

      setLoading(true);

      const provider = new firebase.auth.OAuthProvider("apple.com");
      const authCredential = provider.credential({
        idToken: result.identityToken,
        rawNonce: nonceString,
      });

      const userFromFirebase = await firebase
        .auth()
        .signInWithCredential(authCredential);

      await firebase
        .database()
        .ref("/users/" + userFromFirebase.user.uid)
        .update({
          additionalUserInfo: userFromFirebase.additionalUserInfo,
        });
    } catch (e) {
      setLoading(false);
      if (e.code === "ERR_CANCELED") return;
      Alert.alert("Error", JSON.stringify(e.message));
    }
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={centerContainerSize * 0.02}
      style={{
        width: centerContainerSize * 0.7,
        height: centerContainerSize * 0.12,
        margin: centerContainerSize * 0.02,
      }}
      onPress={() => {
        signInWithAppleAsync();
      }}
    />
  );
}

export default AppleSignInBtn;
