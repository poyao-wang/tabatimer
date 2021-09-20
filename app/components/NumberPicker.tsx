import React, { useEffect } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface NumberPickerProps {
  itemSize: number;
  numItems?: number;
  onScroll?: (index: number) => void;
}

const NumberPicker: React.FC<NumberPickerProps> = ({
  itemSize,
  numItems = 60,
  onScroll,
}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const BORDER_WIDTH = 0;

  const data = [...Array(numItems)].map((d, index) => {
    return {
      key: index,
      value: index,
    };
  });

  useEffect(() => {
    const scrollYListener = scrollY.addListener(({ value }) => {
      let indexOfData = Math.round(value / itemSize);
      onScroll(indexOfData);
      // console.log(indexOfData);
    });
    return () => {
      scrollY.removeAllListeners();
      scrollY.removeListener(scrollYListener);
    };
  });

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.key.toString()}
      showsVerticalScrollIndicator={false}
      bounces={false}
      snapToInterval={itemSize}
      style={{ borderWidth: BORDER_WIDTH, flexGrow: 1 }}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingVertical: itemSize * 2,
        justifyContent: "center",
        alignItems: "center",
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 2) * itemSize,
          (index - 1) * itemSize,
          index * itemSize,
          (index + 1) * itemSize,
          (index + 2) * itemSize,
        ];
        const opacity = scrollY.interpolate({
          inputRange,
          outputRange: [0.05, 0.1, 1, 0.1, 0.05],
        });
        const scale = scrollY.interpolate({
          inputRange,
          outputRange: [0.7, 1, 1.2, 1, 0.7],
        });

        return (
          <Animated.View
            style={{
              borderWidth: BORDER_WIDTH,
              height: itemSize,
              aspectRatio: 2,
              opacity,
              transform: [{ scale }],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: itemSize * 0.65,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              {item.value}
            </Text>
          </Animated.View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});
export default NumberPicker;
