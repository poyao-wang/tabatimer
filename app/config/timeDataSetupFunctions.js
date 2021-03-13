const makeWorkoutsArray = (mainData) => {
  let newArray = [];
  const setAmt = mainData.sets.value;
  const workoutAmt = mainData.workouts.value;
  const workoutTime = mainData.workoutTime.value;
  const restTime = mainData.restTime.value;
  const restTimeSets = mainData.restTimeSets.value;

  let id = 0;
  let end = mainData.prepareTime.value;

  newArray.push({
    id: id,
    setNo: 1,
    workoutNo: 0,
    type: "prepare",
    duration: mainData.prepareTime.value,
    start: 0,
    end: end,
  });
  id++;

  for (let i = 1; i <= setAmt; i++) {
    for (let j = 1; j <= workoutAmt; j++) {
      newArray.push({
        id: id,
        setNo: i,
        workoutNo: j,
        type: "workout",
        duration: workoutTime,
        start: end,
        end: end + workoutTime,
      });
      end = end + workoutTime;
      id++;

      if (j !== workoutAmt) {
        newArray.push({
          id: id,
          setNo: i,
          workoutNo: j,
          type: "rest",
          duration: restTime,
          start: end,
          end: end + restTime,
        });
        end = end + restTime;
        id++;
      }
    }

    if (i !== setAmt) {
      newArray.push({
        id: id,
        setNo: i + 1,
        workoutNo: 0,
        type: "prepare",
        duration: restTimeSets,
        start: end,
        end: end + restTimeSets,
      });
      end = end + restTimeSets;
      id++;
    }
  }

  return newArray;
};

const makeFlatListArray = (mainData, workoutAmt) => {
  let newArray = [...mainData.workoutSetup.flatListArray];
  let arrayLength = newArray.length;
  if (arrayLength > workoutAmt) {
    for (let i = 0; i < arrayLength - workoutAmt; i++) {
      newArray.pop();
    }
  } else if (arrayLength < workoutAmt) {
    for (let i = 0; i < workoutAmt - arrayLength; i++) {
      newArray.push({});
    }
  }

  for (let i = 0; i < newArray.length; i++) {
    newArray[i].id = i;
    if (!newArray[i].name) newArray[i].name = `workout${i}`;
    if (!newArray[i].image) newArray[i].image = "";
  }

  return newArray;
};

const timeDataSetupFunctions = { makeWorkoutsArray, makeFlatListArray };

export default timeDataSetupFunctions;
