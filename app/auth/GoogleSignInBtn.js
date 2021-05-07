import * as React from "react";
import * as Google from "expo-auth-session/providers/google";
import firebase from "firebase";

import {
  IOS_STANDALONE_APP_CLIENT_ID,
  ANDROID_STANDALONE_APP_CLIENT_ID,
  EXPO_CLIENT_ID,
  WEB_CLIENT_ID,
} from "@env";
import AuthButton from "./AuthButton";
import { useAuth } from "./AuthContext";

function byExpoAuthSession(centerContainerSize) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_STANDALONE_APP_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_STANDALONE_APP_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  });

  const { setLoading } = useAuth();

  const firebaseSignIn = async (response) => {
    if (response?.type === "success") {
      setLoading(true);

      const { id_token } = response.params;

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
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
  };

  React.useEffect(() => {
    firebaseSignIn(response);
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
