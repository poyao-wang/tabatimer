import * as firebase from "firebase";

const upload = async (uid, value) => {
  try {
    await firebase
      .database()
      .ref("/users/" + uid + "/timerSetup")
      .set(value);
  } catch (error) {
    throw error;
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
    throw error;
  }
};

const cloudDbFunctions = {
  upload,
  download,
};

export default cloudDbFunctions;
