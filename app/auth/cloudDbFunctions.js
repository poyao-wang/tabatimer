import * as firebase from "firebase";
import { Alert } from "react-native";

const upload = async (uid, value) => {
  try {
    await firebase
      .database()
      .ref("/users/" + uid + "/timerSetup")
      .set(value);
  } catch (error) {
    Alert.alert("error", JSON.stringify(error.message));
  }
};

const download = async (uid) => {
  try {
    const result = await firebase
      .database()
      .ref("/users/" + uid + "/timerSetup")
      .get();

    return result;
  } catch (error) {
    Alert.alert("error", JSON.stringify(error.message));
  }
};

const cloudDbFunctions = {
  upload,
  download,
};

export default cloudDbFunctions;
