import {
  Animated,
  View,
  StyleSheet,
  Text,
  Button,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import useCache from "../utility/cache";

function WorkoutListDetailScreen({ route, navigation, mainData, setMainData }) {
  const { width, height } = Dimensions.get("window");

  const [imageUri, setImageUri] = useState();

  const itemSize = Math.round(width > height ? height * 0.1 : width * 0.1);
  const selectorSize = itemSize * 5;

  const item = route.params;

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the library.");
  };

  useEffect(() => {
    requestPermission();
    setImageUri(item.image == "" ? null : item.image);
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
        setImageUri(resizedPhoto.uri);
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

  // console.log(item);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 40 }}>{item.name}</Text>
      <View
        style={{
          width: selectorSize,
          height: selectorSize,
        }}
      >
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
      <Button
        fontSize={30}
        title="Ok"
        onPress={() => {
          navigation.navigate("WorkoutListScreen");
        }}
      />
      <Button fontSize={30} title="selectImage" onPress={selectImage} />
      <Button fontSize={30} title="deleteImage" onPress={deleteImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default WorkoutListDetailScreen;
