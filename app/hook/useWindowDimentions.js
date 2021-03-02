import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

const useWindowDimentions = () => {
  const [windowDimentions, setWindowDimentions] = useState(
    Dimensions.get("window")
  );

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimentions(window);
    });
    return () => {
      Dimensions.removeEventListener("change");
    };
  }, []);

  return windowDimentions;
};

export default useWindowDimentions;
