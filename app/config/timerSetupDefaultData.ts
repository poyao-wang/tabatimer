import Constants from "expo-constants";
const currentAppVer = Constants.manifest.version;

export interface ItemWorkoutArrayProps {
  duration: number;
  end: number;
  id: number;
  setNo: number;
  start: number;
  type: "prepare" | "workout" | "rest";
  workoutNo: number;
}

export interface ItemFlatListArrayProps {
  id: number | string;
  image: NodeRequire | null;
  name: string;
}

export interface ItemEditorScreenProps {
  type: "time" | "number";
  value: number;
}

export interface WorkoutSetupProps {
  workoutSetup: {
    updated: boolean;
    workoutArray: ItemWorkoutArrayProps[];
    flatListArray: ItemFlatListArrayProps[];
  };
  settings: { playSound: boolean; language: string; appVer: string };
  prepareTime: ItemEditorScreenProps;
  workoutTime: ItemEditorScreenProps;
  restTime: ItemEditorScreenProps;
  restTimeSets: ItemEditorScreenProps;
  sets: ItemEditorScreenProps;
  workouts: ItemEditorScreenProps;
}

const timerSetupDefaultData: WorkoutSetupProps = {
  workoutSetup: {
    updated: false,
    workoutArray: [
      {
        duration: 15,
        end: 15,
        id: 0,
        setNo: 1,
        start: 0,
        type: "prepare",
        workoutNo: 0,
      },
      {
        duration: 30,
        end: 45,
        id: 1,
        setNo: 1,
        start: 15,
        type: "workout",
        workoutNo: 1,
      },
      {
        duration: 10,
        end: 55,
        id: 2,
        setNo: 1,
        start: 45,
        type: "rest",
        workoutNo: 1,
      },
      {
        duration: 30,
        end: 85,
        id: 3,
        setNo: 1,
        start: 55,
        type: "workout",
        workoutNo: 2,
      },
      {
        duration: 10,
        end: 95,
        id: 4,
        setNo: 1,
        start: 85,
        type: "rest",
        workoutNo: 2,
      },
      {
        duration: 30,
        end: 125,
        id: 5,
        setNo: 1,
        start: 95,
        type: "workout",
        workoutNo: 3,
      },
      {
        duration: 10,
        end: 135,
        id: 6,
        setNo: 1,
        start: 125,
        type: "rest",
        workoutNo: 3,
      },
      {
        duration: 30,
        end: 165,
        id: 7,
        setNo: 1,
        start: 135,
        type: "workout",
        workoutNo: 4,
      },
      {
        duration: 10,
        end: 175,
        id: 8,
        setNo: 1,
        start: 165,
        type: "rest",
        workoutNo: 4,
      },
      {
        duration: 30,
        end: 205,
        id: 9,
        setNo: 1,
        start: 175,
        type: "workout",
        workoutNo: 5,
      },
      {
        duration: 10,
        end: 215,
        id: 10,
        setNo: 1,
        start: 205,
        type: "rest",
        workoutNo: 5,
      },
      {
        duration: 30,
        end: 245,
        id: 11,
        setNo: 1,
        start: 215,
        type: "workout",
        workoutNo: 6,
      },
      {
        duration: 30,
        end: 275,
        id: 12,
        setNo: 2,
        start: 245,
        type: "prepare",
        workoutNo: 0,
      },
      {
        duration: 30,
        end: 305,
        id: 13,
        setNo: 2,
        start: 275,
        type: "workout",
        workoutNo: 1,
      },
      {
        duration: 10,
        end: 315,
        id: 14,
        setNo: 2,
        start: 305,
        type: "rest",
        workoutNo: 1,
      },
      {
        duration: 30,
        end: 345,
        id: 15,
        setNo: 2,
        start: 315,
        type: "workout",
        workoutNo: 2,
      },
      {
        duration: 10,
        end: 355,
        id: 16,
        setNo: 2,
        start: 345,
        type: "rest",
        workoutNo: 2,
      },
      {
        duration: 30,
        end: 385,
        id: 17,
        setNo: 2,
        start: 355,
        type: "workout",
        workoutNo: 3,
      },
      {
        duration: 10,
        end: 395,
        id: 18,
        setNo: 2,
        start: 385,
        type: "rest",
        workoutNo: 3,
      },
      {
        duration: 30,
        end: 425,
        id: 19,
        setNo: 2,
        start: 395,
        type: "workout",
        workoutNo: 4,
      },
      {
        duration: 10,
        end: 435,
        id: 20,
        setNo: 2,
        start: 425,
        type: "rest",
        workoutNo: 4,
      },
      {
        duration: 30,
        end: 465,
        id: 21,
        setNo: 2,
        start: 435,
        type: "workout",
        workoutNo: 5,
      },
      {
        duration: 10,
        end: 475,
        id: 22,
        setNo: 2,
        start: 465,
        type: "rest",
        workoutNo: 5,
      },
      {
        duration: 30,
        end: 505,
        id: 23,
        setNo: 2,
        start: 475,
        type: "workout",
        workoutNo: 6,
      },
      {
        duration: 30,
        end: 535,
        id: 24,
        setNo: 3,
        start: 505,
        type: "prepare",
        workoutNo: 0,
      },
      {
        duration: 30,
        end: 565,
        id: 25,
        setNo: 3,
        start: 535,
        type: "workout",
        workoutNo: 1,
      },
      {
        duration: 10,
        end: 575,
        id: 26,
        setNo: 3,
        start: 565,
        type: "rest",
        workoutNo: 1,
      },
      {
        duration: 30,
        end: 605,
        id: 27,
        setNo: 3,
        start: 575,
        type: "workout",
        workoutNo: 2,
      },
      {
        duration: 10,
        end: 615,
        id: 28,
        setNo: 3,
        start: 605,
        type: "rest",
        workoutNo: 2,
      },
      {
        duration: 30,
        end: 645,
        id: 29,
        setNo: 3,
        start: 615,
        type: "workout",
        workoutNo: 3,
      },
      {
        duration: 10,
        end: 655,
        id: 30,
        setNo: 3,
        start: 645,
        type: "rest",
        workoutNo: 3,
      },
      {
        duration: 30,
        end: 685,
        id: 31,
        setNo: 3,
        start: 655,
        type: "workout",
        workoutNo: 4,
      },
      {
        duration: 10,
        end: 695,
        id: 32,
        setNo: 3,
        start: 685,
        type: "rest",
        workoutNo: 4,
      },
      {
        duration: 30,
        end: 725,
        id: 33,
        setNo: 3,
        start: 695,
        type: "workout",
        workoutNo: 5,
      },
      {
        duration: 10,
        end: 735,
        id: 34,
        setNo: 3,
        start: 725,
        type: "rest",
        workoutNo: 5,
      },
      {
        duration: 30,
        end: 765,
        id: 35,
        setNo: 3,
        start: 735,
        type: "workout",
        workoutNo: 6,
      },
    ],
    flatListArray: [
      {
        id: 0,
        image: require("../assets/plank-elbow.jpg"),
        name: "workout1",
      },
      {
        id: 1,
        image: require("../assets/plank-full.jpg"),
        name: "workout2",
      },
      {
        id: 2,
        image: require("../assets/plank-side-L.jpg"),
        name: "workout3",
      },
      {
        id: 3,
        image: require("../assets/plank-side-R.jpg"),
        name: "workout4",
      },
      {
        id: 4,
        image: require("../assets/plank-full.jpg"),
        name: "workout5",
      },
      {
        id: 5,
        image: require("../assets/plank-elbow.jpg"),
        name: "workout6",
      },
    ],
  },
  settings: { playSound: true, language: "en", appVer: currentAppVer },
  prepareTime: {
    type: "time",
    value: 15,
  },
  workoutTime: {
    type: "time",
    value: 30,
  },
  restTime: {
    type: "time",
    value: 10,
  },
  restTimeSets: {
    type: "time",
    value: 30,
  },
  sets: {
    type: "number",
    value: 3,
  },
  workouts: {
    type: "number",
    value: 6,
  },
};
export default timerSetupDefaultData;
