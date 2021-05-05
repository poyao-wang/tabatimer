import React, { useContext } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

import { MainContext } from "../config/MainContext";
import { useAuth } from "../auth/AuthContext";
import cloudDbFunctions from "../auth/cloudDbFunctions";
import colors from "../config/colors";
import ScreenLowerFlexBox from "../components/ScreenLowerFlexBox";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";
import useWindowDimentions from "../hook/useWindowDimentions";

const BORDER_WIDTH = 1;

function AccountScreen() {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    language: { uiText },
  } = useContext(MainContext);

  const {
    currentUser,
    signInWithAppleAsync,
    signInWithGoogleAsync,
    signInWithFacebookAsync,
    logout,
  } = useAuth();

  const mainDataToString = (mainData) => {
    if (mainData) {
      const prepareTime = mainData?.prepareTime?.value;
      const restTimeSets = mainData?.restTimeSets?.value;
      const restTime = mainData?.restTime?.value;
      const sets = mainData?.sets?.value;
      const workouts = mainData?.workouts?.value;
      const workoutList = mainData?.workoutSetup?.flatListArray;
      const workoutTime = mainData?.workoutTime?.value;
      const returnObj = {
        prepareTime,
        restTimeSets,
        restTime,
        sets,
        workouts,
        workoutList,
        workoutTime,
      };
      return JSON.stringify(returnObj);
    }
    return null;
  };

  const stringToSetMainData = (inputText) => {
    const parsedObject = JSON.parse(inputText);
    const {
      prepareTime,
      restTime,
      restTimeSets,
      sets,
      workoutList,
      workouts,
      workoutTime,
    } = parsedObject;

    mainData.prepareTime.value = prepareTime;
    mainData.restTime.value = restTime;
    mainData.restTimeSets.value = restTimeSets;
    mainData.sets.value = sets;
    mainData.workouts.value = workouts;
    mainData.workoutTime.value = workoutTime;
    mainData.workoutSetup.flatListArray = workoutList;

    mainData.workoutSetup.updated = true;
    mainData.workoutSetup.workoutArray = timeDataSetupFunctions.makeWorkoutsArray(
      mainData
    );
    setMainData(mainData);
    useCache.store(mainData);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: BORDER_WIDTH,
    },
    googleLoginBtn: {
      width: containerHeight * 0.7,
      height: containerHeight * 0.2,
      borderWidth: BORDER_WIDTH,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            borderWidth: BORDER_WIDTH,
            borderColor: colors.dark,
            borderRadius: centerContainerSize * 0.04,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={styles.googleLoginBtn}
            onPress={() => {
              signInWithFacebookAsync();
            }}
          >
            <Text>Login With Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.googleLoginBtn}
            onPress={() => {
              signInWithGoogleAsync();
            }}
          >
            <Text>Login With Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.googleLoginBtn}
            onPress={() => {
              logout();
            }}
            onLongPress={() => {
              Alert.alert(JSON.stringify(currentUser, null, 2));
            }}
          >
            <Text>
              {!currentUser
                ? "Not signed in."
                : !currentUser.displayName
                ? "No user name."
                : currentUser.displayName}
              {currentUser
                ? " Signed in with " + currentUser.providerData[0]?.providerId
                : null}
            </Text>
          </TouchableOpacity>
          {Platform.OS === "ios" && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{ width: 200, height: 44 }}
              onPress={() => {
                signInWithAppleAsync();
              }}
            />
          )}
        </View>
        <ScreenLowerFlexBox
          windowDimentions={{ width, height, centerContainerSize }}
          icons={[
            {
              iconName: "cloud-upload",
              onPress: () => {
                cloudDbFunctions.upload(
                  currentUser.uid,
                  mainDataToString(mainData)
                );
              },
            },
            {
              iconName: "cloud-download",
              onPress: async () => {
                const result = await cloudDbFunctions.download(currentUser.uid);
                stringToSetMainData(result.val());
              },
            },
          ]}
        />
      </View>
    </>
  );
}

export default AccountScreen;
