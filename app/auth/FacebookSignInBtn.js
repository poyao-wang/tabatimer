import { Alert, Button, TouchableOpacity, Text, Platform } from "react-native";
import { ResponseType } from "expo-auth-session";
import * as ExpoAuthSessionFacebook from "expo-auth-session/providers/facebook";
import * as React from "react";
import Constants from "expo-constants";
import firebase from "firebase";
import * as ExpoFacebook from "expo-facebook";
import * as Localization from "expo-localization";

import { FACEBOOK_APP_ID } from "@env";
import AuthButton from "./AuthButton";
import { useAuth } from "./AuthContext";

const isNative = Constants.appOwnership !== "expo" && Platform.OS !== "web";
const isAndroid = Platform.OS === "android";

const deviceLanguage = Localization.locale.split("-")[0];
const btnText =
  deviceLanguage === "ja"
    ? "Facebookでログイン"
    : deviceLanguage === "zh"
    ? "使用Facebook登入"
    : "Log in With Facebook";

const buttonReturn = (onPress, centerContainerSize) => (
  <AuthButton
    centerContainerSize={centerContainerSize}
    color="#4267b2"
    btnText={btnText}
    onPress={onPress}
    iconName="facebook"
  />
);

function byExpoAuthSession(centerContainerSize) {
  const [
    request,
    response,
    promptAsync,
  ] = ExpoAuthSessionFacebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: FACEBOOK_APP_ID,
  });

  const { setLoading } = useAuth();

  const firebaseSignIn = async (response) => {
    try {
      if (response?.type === "success") {
        setLoading(true);
        const { access_token } = response.params;

        const credential = firebase.auth.FacebookAuthProvider.credential(
          access_token
        );
        // Sign in with the credential from the Facebook user.

        const userFromFirebase = await firebase
          .auth()
          .signInWithCredential(credential);

        await firebase
          .database()
          .ref("/users/" + userFromFirebase.user.uid)
          .update({
            additionalUserInfo: userFromFirebase.additionalUserInfo,
          });
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  React.useEffect(() => {
    firebaseSignIn(response);
  }, [response]);

  return buttonReturn(() => promptAsync(), centerContainerSize);
}

function byExpoFacebook(centerContainerSize) {
  const { setLoading } = useAuth();

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
        setLoading(true);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase
          .auth()
          .signInWithCredential(credential);

        await firebase
          .database()
          .ref("/users/" + facebookProfileData.user.uid)
          .update({
            additionalUserInfo: facebookProfileData.additionalUserInfo,
          });
      }
    } catch ({ message }) {
      setLoading(false);
      Alert.alert("Error", message);
    }
  }

  return buttonReturn(() => signInAsync(), centerContainerSize);
}

const FacebookSignInBtn =
  isNative && isAndroid ? byExpoFacebook : byExpoAuthSession;

export default FacebookSignInBtn;
