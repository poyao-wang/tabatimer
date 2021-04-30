import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";

import { MainContext } from "../config/MainContext";
import colors from "../config/colors";
import CustomIcons from "../components/CustomIcons";
import timeDataSetupFunctions from "../config/timeDataSetupFunctions";
import useCache from "../utility/cache";
import useWindowDimentions from "../hook/useWindowDimentions";

const BORDER_WIDTH = 0;

function WorkoutListDetailScreen({ route, navigation }) {
  const {
    tabBar: { setTabBarShow },
    timer: { timerSetup: mainData, setTimerSetup: setMainData },
    language: { uiText },
  } = useContext(MainContext);

  const windowDimentions = useWindowDimentions();
  const { width, height, centerContainerSize } = windowDimentions;

  const [imageUri, setImageUri] = useState();

  const itemSize = Math.round(width > height ? height * 0.1 : width * 0.1);
  const selectorSize = itemSize * 5;

  const item = route.params;

  const requestPermission = async () => {
    const photosPermissionsStatus = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!photosPermissionsStatus.granted) {
      if (photosPermissionsStatus.canAskAgain) {
        Alert.alert(
          uiText.workoutListDetailScreen.alertPhotosPermissionTitle,
          uiText.workoutListDetailScreen.alertPhotosPermissionMsg,
          [
            {
              text: uiText.workoutListDetailScreen.alertPhotosPermissionCancel,
              onPress: () => navigation.navigate("WorkoutListScreen"),
            },
            {
              text: uiText.workoutListDetailScreen.alertPhotosPermissionOk,
              onPress: async () => {
                const {
                  granted,
                } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!granted) {
                  navigation.navigate("WorkoutListScreen");
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        navigation.navigate("WorkoutListScreen");
        Alert.alert(
          uiText.workoutListDetailScreen.alertPhotosPermissionTitle,
          Platform.OS === "android"
            ? uiText.workoutListDetailScreen.alertPhotosPermissionMsgAndroid
            : uiText.workoutListDetailScreen.alertPhotosPermissionMsgIos,
          [{ text: uiText.workoutListDetailScreen.alertPhotosPermissionOk }],
          { cancelable: false }
        );
      }
    }
  };

  useEffect(() => {
    requestPermission();
    setImageUri(timeDataSetupFunctions.checkImageUri(item.image));
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const resizedPhoto = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
          { compress: 0.7, format: "jpeg", base64: true }
        );
        setImageUri(timeDataSetupFunctions.checkImageUri(resizedPhoto.uri));
        const imageUri = "data:image/jpeg;base64," + resizedPhoto.base64;
        mainData.workoutSetup.flatListArray[item.id].image = imageUri;
        mainData.workoutSetup.updated = true;
        setMainData(mainData);
        useCache.store(mainData);
      }
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const deleteImage = () => {
    setImageUri(null);
    mainData.workoutSetup.flatListArray[item.id].image = "";
    setMainData(mainData);
    useCache.store(mainData);
  };

  useEffect(() => {
    setTabBarShow(false);
    return () => setTabBarShow(true);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: centerContainerSize,
          height: centerContainerSize,
          alignItems: "center",
          justifyContent: "center",
          padding: centerContainerSize * 0.05,
          borderWidth: BORDER_WIDTH,
        }}
      >
        <Text style={{ fontSize: itemSize * 1.2 }}>{item.id + 1 + "."}</Text>
        <View
          style={{
            width: selectorSize,
            height: selectorSize,
            borderRadius: selectorSize * 0.15,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            margin: itemSize * 0.5,
          }}
        >
          {imageUri && (
            <Image
              source={imageUri}
              style={{ width: "100%", height: "100%" }}
            />
          )}
          {imageUri && (
            <TouchableOpacity
              style={{
                position: "absolute",
                width: itemSize * 1.1,
                height: itemSize * 1.1,
                borderRadius: itemSize * 0.3,
                bottom: itemSize * 0.5,
                right: itemSize * 0.5,
                borderWidth: itemSize * 0.07,
                borderColor: colors.dark,
                backgroundColor: colors.white,
                opacity: 0.5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomIcons
                icnoName={"delete-forever"}
                onPress={deleteImage}
                size={itemSize * 0.9}
                color={colors.dark}
              />
            </TouchableOpacity>
          )}
          {!imageUri && (
            <CustomIcons
              icnoName={"plus"}
              onPress={selectImage}
              size={itemSize * 2.5}
              color={colors.medium}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "space-between",
            borderWidth: BORDER_WIDTH,
          }}
        >
          <View style={styles.iconContainer}>
            <CustomIcons
              icnoName={"arrow-left-bold-circle"}
              onPress={() => {
                navigation.navigate("WorkoutListScreen");
              }}
              size={itemSize * 1.5}
              color={colors.dark}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: { flex: 1, borderWidth: BORDER_WIDTH },
});
export default WorkoutListDetailScreen;
