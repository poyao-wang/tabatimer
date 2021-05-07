import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext } from "react";

import { MainContext } from "../config/MainContext";
import { useAuth } from "../auth/AuthContext";
import AuthButton from "../auth/AuthButton";
import cloudDbFunctions from "../auth/cloudDbFunctions";
import FacebookSignInBtn from "../auth/FacebookSignInBtn";
import GoogleSignInBtn from "../auth/GoogleSignInBtn";
import ScreenLowerFlexBox from "../components/ScreenLowerFlexBox";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";
import useWindowDimentions from "../hook/useWindowDimentions";
import AppleSignInBtn from "../auth/AppleSignInBtn";

const BORDER_WIDTH = 0;

function AccountScreen() {
  const { width, height, centerContainerSize } = useWindowDimentions();

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    language: { uiText },
  } = useContext(MainContext);

  const { currentUser, logout, loading, setLoading } = useAuth();

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

  const SubTitle = () => {
    const providerText = () => {
      const textFeomFirebaseAuth = currentUser.providerData[0]?.providerId;
      if (textFeomFirebaseAuth === "apple.com") return "Apple";
      if (textFeomFirebaseAuth === "facebook.com") return "Facebook";
      if (textFeomFirebaseAuth === "google.com") return "Google";
    };

    return (
      <Text style={styles.subtitle}>
        {!currentUser
          ? "Sign in for upload / download settings"
          : !currentUser.displayName
          ? ""
          : currentUser.displayName}
        {currentUser ? " Signed in with " + providerText() : null}
      </Text>
    );
  };

  const SigninBtns = () => {
    return (
      <View style={styles.btnsContainer}>
        <View style={styles.subtitleContainer}>
          <SubTitle />
        </View>
        {Platform.OS === "ios" && (
          <AppleSignInBtn centerContainerSize={centerContainerSize} />
        )}
        {FacebookSignInBtn(centerContainerSize)}
        {GoogleSignInBtn(centerContainerSize)}
      </View>
    );
  };

  const SignOutBtns = () => {
    return (
      <View style={styles.btnsContainer}>
        <View style={styles.subtitleContainer}>
          <SubTitle />
        </View>
        <AuthButton
          centerContainerSize={centerContainerSize}
          btnText="Sign out"
          iconName="logout"
          onPress={() => {
            logout();
          }}
        />
      </View>
    );
  };

  const LoadingView = () => {
    return (
      <View style={styles.btnsContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: BORDER_WIDTH,
    },
    btnsContainer: {
      justifyContent: "center",
      alignItems: "center",
      borderWidth: BORDER_WIDTH,
      height: centerContainerSize * 0.63,
      width: centerContainerSize * 0.8,
    },
    titleContainer: {
      width: centerContainerSize * 0.9,
      height: centerContainerSize * 0.15,
      borderWidth: BORDER_WIDTH,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: centerContainerSize * 0.08,
      fontWeight: "600",
      letterSpacing: 2,
    },
    subtitleContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: centerContainerSize * 0.8,
      height: centerContainerSize * 0.13,
      borderWidth: BORDER_WIDTH,
    },
    subtitle: {
      fontSize: centerContainerSize * 0.04,
      marginTop: centerContainerSize * 0.02,
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
            borderRadius: centerContainerSize * 0.04,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>User Account</Text>
          </View>
          {loading && <LoadingView />}
          {!currentUser && !loading && <SigninBtns />}
          {currentUser && !loading && <SignOutBtns />}
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
              textBelow: "upload",
              disabled: !currentUser,
            },
            {
              iconName: "cloud-download",
              onPress: async () => {
                const result = await cloudDbFunctions.download(currentUser.uid);
                stringToSetMainData(result.val());
              },
              textBelow: "download",
              disabled: !currentUser,
            },
          ]}
        />
      </View>
    </>
  );
}

export default AccountScreen;
