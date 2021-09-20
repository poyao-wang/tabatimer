import * as Google from "expo-auth-session/providers/google";
import * as Localization from "expo-localization";
import * as React from "react";
import firebase from "firebase";

import {
  IOS_STANDALONE_APP_CLIENT_ID,
  ANDROID_STANDALONE_APP_CLIENT_ID,
  EXPO_CLIENT_ID,
  WEB_CLIENT_ID,
} from "@env";
import AuthButton from "./AuthButton";
import { useAuth } from "./AuthContext";
import { Alert } from "react-native";

const deviceLanguage = Localization.locale.split("-")[0];
const btnText =
  deviceLanguage === "ja"
    ? "Googleでサインイン"
    : deviceLanguage === "zh"
    ? "使用Google登入"
    : "Sign in with Google";

const googleAuthRequestConfig = {
  androidClientId: ANDROID_STANDALONE_APP_CLIENT_ID,
  expoClientId: EXPO_CLIENT_ID,
  iosClientId: IOS_STANDALONE_APP_CLIENT_ID,
  webClientId: WEB_CLIENT_ID,
};

const byExpoAuthSession = (centerContainerSize: number) => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    googleAuthRequestConfig
  );

  const { setLoading } = useAuth();

  const firebaseSignIn = async (response) => {
    try {
      if (response?.type === "success") {
        setLoading(true);

        const { id_token } = response.params;

        const credential =
          firebase.auth.GoogleAuthProvider.credential(id_token);
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
      Alert.alert(error.message);
    }
  };

  React.useEffect(() => {
    firebaseSignIn(response);
  }, [response]);

  return (
    <AuthButton
      btnText={btnText}
      color="#df4a32"
      centerContainerSize={centerContainerSize}
      iconName="google"
      onPress={() => {
        promptAsync();
      }}
    />
  );
};

const GoogleSignInBtn = byExpoAuthSession;

export default GoogleSignInBtn;
