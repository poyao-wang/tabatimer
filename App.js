import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import Timer from "./app/Timer";

const timeData = [
  {
    id: 0,
    setNo: 1,
    workoutNo: 1,
    type: "rest",
    duration: 5,
    start: 0,
    end: 5,
  },
  {
    id: 1,
    setNo: 2,
    workoutNo: 2,
    type: "workout",
    duration: 5,
    start: 5,
    end: 10,
  },
  {
    id: 2,
    setNo: 3,
    workoutNo: 1,
    type: "rest",
    duration: 5,
    start: 10,
    end: 15,
  },
  {
    id: 3,
    setNo: 3,
    workoutNo: 2,
    type: "rest",
    duration: 5,
    start: 15,
    end: 20,
  },
  {
    id: 4,
    setNo: 3,
    workoutNo: 3,
    type: "rest",
    duration: 5,
    start: 20,
    end: 25,
  },
  {
    id: 5,
    setNo: 4,
    workoutNo: 1,
    type: "rest",
    duration: 2,
    start: 25,
    end: 27,
  },
];

const defaultState = {
  end: timeData[0].end,
  isActive: false,
  seconds: 0,
  sectionId: 0,
  sectoinCountDownSeconds: timeData[0].duration,
  setNo: timeData[0].setNo,
  start: timeData[0].start,
  timeMax: timeData[timeData.length - 1].end,
  type: timeData[0].type,
  workoutNo: timeData[0].workoutNo,
};

const returnSectionId = (seconds) => {
  let findResult = timeData.find(
    (section) => seconds >= section.start && seconds < section.end
  );
  if (!findResult)
    findResult = timeData.find((section) => seconds === section.end);

  return findResult?.id;
};

export default function App() {
  const [state, setState] = useState(defaultState);

  function setPartOfState(object) {
    const newObject = { ...state, ...object };
    setState(newObject);
  }

  function toggle() {
    if (state.seconds >= state.timeMax) return Alert.alert("End");
    setPartOfState({ isActive: !state.isActive });
  }

  function reset() {
    setPartOfState(defaultState);
  }

  useEffect(() => {
    let interval = null;
    if (state.isActive && state.seconds < state.timeMax) {
      interval = setInterval(() => {
        const newSectionId = returnSectionId(state.seconds + 1);

        const newIsActive =
          state.seconds + 1 == state.timeMax ? { isActive: false } : {};

        setPartOfState({
          seconds: state.seconds + 1,
          sectionId: newSectionId,
          sectoinCountDownSeconds:
            timeData[newSectionId].end - state.seconds - 1,
          setNo: timeData[newSectionId].setNo,
          type: timeData[newSectionId].type,
          workoutNo: timeData[newSectionId].workoutNo,
          start: timeData[newSectionId].start,
          end: timeData[newSectionId].end,
          ...newIsActive,
        });
      }, 1000);
    } else if (!state.isActive && state.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [state]);

  return (
    <View style={styles.container}>
      <Timer seconds={state.seconds} />
      <Timer seconds={state.sectoinCountDownSeconds} />
      <Text>{`Set : ${state.setNo}`}</Text>
      <Text>{`Workout : ${state.workoutNo}`}</Text>
      <Text>{`Type : ${state.type}`}</Text>
      <Button
        title={state.isActive ? "pause" : "play"}
        onPress={toggle}
      ></Button>
      <Button onPress={reset} title="Reset"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
