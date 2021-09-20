import firebase from "firebase/app";

const upload = async (uid: string, value: {}) => {
  try {
    await firebase
      .database()
      .ref("/users/" + uid + "/timerSetup")
      .set(value);
  } catch (error) {
    throw error;
  }
};

const download = async (uid: string) => {
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
