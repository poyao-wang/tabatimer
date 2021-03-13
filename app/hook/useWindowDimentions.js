import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

const objectTransform = (object) => {
  const { width, height } = object;
  const longSide = width > height ? width : height;
  const shortSide = width > height ? height : width;
  const longSideCal = longSide * 0.6;
  const shortSideCal = shortSide;
  const centerContainerSize =
    shortSideCal > longSideCal ? longSideCal : shortSideCal;
  object.centerContainerSize = centerContainerSize;
  return object;
};

const useWindowDimentions = () => {
  const [windowDimentions, setWindowDimentions] = useState(
    objectTransform(Dimensions.get("window"))
  );

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimentions(objectTransform(window));
    });
    return () => {
      Dimensions.removeEventListener("change");
    };
  }, []);

  return windowDimentions;
};

export default useWindowDimentions;
