import React from "react";
import { View } from "react-native";
import CustomIcons from "./CustomIcons";

const BORDER_WIDTH = 0;

function ScreenLowerFlexBox({ windowDimentions, icons }) {
  const { width, height, centerContainerSize } = windowDimentions;

  const renderIconFlexBox = (icon, key) => {
    return (
      <View
        key={key}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <CustomIcons
          iconName={icon.iconName}
          size={centerContainerSize * 0.13}
          onPress={icon.onPress}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom:
          width > height
            ? (height - centerContainerSize) / 2
            : ((height - centerContainerSize) / 2 - centerContainerSize * 0.2) /
              2,
        left: width > height ? "5%" : (width - centerContainerSize) / 2,
        flexDirection: width > height ? "column" : "row",
        height:
          width > height ? centerContainerSize : centerContainerSize * 0.24,
        width:
          width > height ? centerContainerSize * 0.24 : centerContainerSize,
        borderWidth: BORDER_WIDTH,
      }}
    >
      {icons && icons.map((icon, index) => renderIconFlexBox(icon, index))}
    </View>
  );
}

export default ScreenLowerFlexBox;
