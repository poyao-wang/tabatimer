import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ExpoFacebook from "expo-facebook";
import React, { useContext, useEffect, useState } from "react";

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
import Loader from "../components/Loader";

const BORDER_WIDTH = 0;
const isAndroid = Platform.OS === "android";

function AccountScreen() {
  const [trackingAuthorized, setTrackingAuthorized] = useState(false);

  const { width, height, centerContainerSize } = useWindowDimentions();

  const containerHeight = centerContainerSize * 0.9;
  const containerWidth = centerContainerSize * 0.9;

  const {
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    language: { uiText },
  } = useContext(MainContext);

  const { currentUser, logout, loading, setLoading } = useAuth();

  const translationText = uiText.accountScreen;

  const checkPermission = async () => {
    try {
      const trackingPermissionsStatus = await ExpoFacebook.getPermissionsAsync();
      setTrackingAuthorized(trackingPermissionsStatus.granted);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

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
    if (!inputText) throw new Error("noData");
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
          ? translationText.subtitle.noUser
          : !currentUser.displayName
          ? translationText.subtitle.withUserNameNotAvailable
          : currentUser.displayName}
        {currentUser
          ? translationText.subtitle.withUserBeforeProvidor +
            providerText() +
            translationText.subtitle.withUserAfterProvidor
          : null}
        {trackingAuthorized
          ? ""
          : translationText.subtitle.noTrackingPermission}
      </Text>
    );
  };

  const PermissionBtns = () => {
    return (
      <View style={styles.btnsContainer}>
        <AuthButton
          centerContainerSize={centerContainerSize}
          btnText={translationText.trackingPermission.btnText}
          iconName="hand-okay"
          onPress={async () => {
            try {
              const trackingPermissionsStatus = await ExpoFacebook.getPermissionsAsync();
              if (trackingPermissionsStatus?.canAskAgain) {
                const {
                  granted,
                } = await ExpoFacebook.requestPermissionsAsync();
                setTrackingAuthorized(granted);
              } else {
                Alert.alert(
                  translationText.trackingPermission.alertMainTitle,
                  translationText.trackingPermission.alertMainMsg,
                  [
                    {
                      text:
                        translationText.trackingPermission.alertMainOkBtnText,
                    },
                  ],
                  { cancelable: false }
                );
              }
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          }}
        />
      </View>
    );
  };

  const SigninBtns = () => {
    return (
      <View style={styles.btnsContainer}>
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
        <AuthButton
          centerContainerSize={centerContainerSize}
          btnText={translationText.signOutBtnText}
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
      <View style={[styles.btnsContainer]}>
        <Loader size={centerContainerSize * 0.5} />
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
      justifyContent: "flex-start",
      alignItems: "center",
      borderWidth: BORDER_WIDTH,
      paddingTop: centerContainerSize * 0.035,
      height: centerContainerSize * 0.6,
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
      width: centerContainerSize * 0.9,
      height: centerContainerSize * 0.13,
      borderWidth: BORDER_WIDTH,
    },
    subtitle: {
      textAlign: "center",
      fontSize: isAndroid
        ? centerContainerSize * 0.035
        : centerContainerSize * 0.04,
      lineHeight: centerContainerSize * 0.06,
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
            <Text style={styles.title}>{translationText.title}</Text>
          </View>
          <View style={styles.subtitleContainer}>
            <SubTitle />
          </View>
          {loading && <LoadingView />}
          {!loading && !trackingAuthorized && <PermissionBtns />}
          {!loading && trackingAuthorized && !currentUser && <SigninBtns />}
          {!loading && trackingAuthorized && currentUser && <SignOutBtns />}
        </View>
        <ScreenLowerFlexBox
          windowDimentions={{ width, height, centerContainerSize }}
          icons={[
            {
              iconName: "cloud-upload",
              onPress: () => {
                Alert.alert(
                  translationText.uploadBtn.alertMainTitle,
                  translationText.uploadBtn.alertMainMsg,
                  [
                    {
                      text: translationText.uploadBtn.alertMainCancelBtnText,
                      onPress: () => console.log("Cancel Pressed"),
                    },
                    {
                      text: translationText.uploadBtn.alertMainOkBtnText,
                      onPress: async () => {
                        try {
                          setLoading(true);
                          await cloudDbFunctions.upload(
                            currentUser.uid,
                            mainDataToString(mainData)
                          );
                          setLoading(false);
                          Alert.alert(
                            translationText.uploadBtn.alertSucceedTitle,
                            translationText.uploadBtn.alertSucceedMsg
                          );
                        } catch (error) {
                          Alert.alert(
                            translationText.uploadBtn.alertErrorTitle,
                            error.message
                          );
                          setLoading(false);
                        }
                      },
                    },
                  ],
                  { cancelable: false }
                );
              },
              textBelow: translationText.uploadBtn.textBelow,
              disabled: !currentUser || loading,
            },
            {
              iconName: "cloud-download",
              onPress: () => {
                Alert.alert(
                  translationText.downloadBtn.alertMainTitle,
                  translationText.downloadBtn.alertMainMsg,
                  [
                    {
                      text: translationText.downloadBtn.alertMainCancelBtnText,
                      onPress: () => console.log("Cancel Pressed"),
                    },
                    {
                      text: translationText.downloadBtn.alertMainOkBtnText,
                      onPress: async () => {
                        try {
                          setLoading(true);
                          const result = await cloudDbFunctions.download(
                            currentUser.uid
                          );
                          stringToSetMainData(result.val());
                          setLoading(false);
                          Alert.alert(
                            translationText.downloadBtn.alertSucceedTitle,
                            translationText.downloadBtn.alertSucceedMsg
                          );
                        } catch (error) {
                          setLoading(false);
                          if (error.message === "noData")
                            return Alert.alert(
                              translationText.downloadBtn.alertNoDataTitle,
                              translationText.downloadBtn.alertNoDataMsg
                            );
                          Alert.alert(
                            translationText.downloadBtn.alertErrorTitle,
                            error.message
                          );
                        }
                      },
                    },
                  ],
                  { cancelable: false }
                );
              },
              textBelow: translationText.downloadBtn.textBelow,
              disabled: !currentUser || loading,
            },
          ]}
        />
      </View>
    </>
  );
}

export default AccountScreen;
