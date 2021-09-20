import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const cacheKeyName = "mainData";

const store = async (object: {}) => {
  try {
    await AsyncStorage.setItem(cacheKeyName, JSON.stringify(object));
  } catch (error) {
    Alert.alert(error.message);
  }
};

const get = async () => {
  try {
    const value = await AsyncStorage.getItem(cacheKeyName);
    const object = JSON.parse(value);

    return object;
  } catch (error) {
    Alert.alert(error.message);
  }
};

const useCache = { store, get };

export default useCache;
