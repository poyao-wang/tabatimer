import AsyncStorage from "@react-native-async-storage/async-storage";

const cacheKeyName = "mainData";

const store = async (object) => {
  try {
    await AsyncStorage.setItem(cacheKeyName, JSON.stringify(object));
  } catch (error) {
    console.log(error);
  }
};

const get = async () => {
  try {
    const value = await AsyncStorage.getItem(cacheKeyName);
    const object = JSON.parse(value);

    return object;
  } catch (error) {
    console.log(error);
  }
};

const useCache = { store, get };

export default useCache;
