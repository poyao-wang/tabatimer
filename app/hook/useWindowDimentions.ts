import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

interface WindowWidthAndHeight {
  width: number;
  height: number;
  centerContainerSize: number;
}

const objectTransform = (object: { width: number; height: number }) => {
  const { width, height } = object;
  const longSide = width > height ? width : height;
  const shortSide = width > height ? height : width;
  const longSideCal = longSide * 0.6;
  const shortSideCal = shortSide;
  const centerContainerSize =
    shortSideCal > longSideCal ? longSideCal : shortSideCal;
  return { ...object, centerContainerSize };
};

const useWindowDimentions = () => {
  const [windowDimentions, setWindowDimentions] =
    useState<WindowWidthAndHeight>(objectTransform(Dimensions.get("window")));

  const onChange = ({ window }: { window: ScaledSize }) => {
    setWindowDimentions(objectTransform(window));
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });

  return windowDimentions;
};

export default useWindowDimentions;
