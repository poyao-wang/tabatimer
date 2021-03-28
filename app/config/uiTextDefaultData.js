const uiTextDefaultData = {
  eng: {
    timerScreen: {
      sectionTypeWorkout: "WORKOUT",
      sectionTypeRest: "REST",
      sectionTypePrepare: "PREPARE",
      fractionDisplayTitleLeft: "CYCLE",
      fractionDisplayTitleRight: "WORK",
      resetAlertTitle: "Reset Timer",
      resetAlertMsg: "Do you want to reset the Timer?",
      resetAlertOk: "OK",
      resetAlertCancel: "Cancel",
    },
    editorScreen: {
      prepareTime: {
        title: "Preparation Time",
        subtitle: "Preparation before Start",
      },
      workoutTime: {
        title: "Workout Time",
        subtitle: "Duration for Workout",
      },
      restTime: {
        title: "Rest Time",
        subtitle: "Rest between Workouts",
      },
      restTimeSets: {
        title: "Rest Time - Sets",
        subtitle: "Rest between Sets",
      },
      sets: {
        title: "Cycles",
        subtitle: "Cycle Amount",
      },
      workouts: {
        title: "Workouts",
        subtitle: "Workouts per Set",
      },
      resetAlertTitle: "Reset Settings",
      resetAlertMsg: "Do you want to reset the settings?",
      resetAlertOk: "OK",
      resetAlertCancel: "Cancel",
    },
    workoutListScreen: {
      resetAlertTitle: "Delete All Images",
      resetAlertMsg: "Do you want to delete all images?",
      resetAlertOk: "OK",
      resetAlertCancel: "Cancel",
    },
    workoutListDetailScreen: {
      alertPhotosPermissionTitle: "Photos Access Required",
      alertPhotosPermissionMsg:
        "To use your own images for workouts, please allow TabaTimer to access Photos on your device.",
      alertPhotosPermissionOk: "Ok",
      alertPhotosPermissionCancel: "Cancel",
      alertPhotosPermissionMsgAndroid: `To use your own images for workouts, go to "Settings" → "Apps & notifications" → "TabaTimer" → "Permissions" → "Storage", and allow TabaTimer to access photos on your device.`,
      alertPhotosPermissionMsgIos: `To use your own images for workouts, go to "Settings" → "TabaTimer" → "Photos", and allow TabaTimer to access photos on your device.`,
    },
  },
  jpn: {
    timerScreen: {
      sectionTypeWorkout: "運　動",
      sectionTypeRest: "休　憩",
      sectionTypePrepare: "準　備",
      fractionDisplayTitleLeft: "サイクル",
      fractionDisplayTitleRight: "動　作",
      resetAlertTitle: "タイマーリセット",
      resetAlertMsg: "タイマーをリセットしますか？",
      resetAlertOk: "はい",
      resetAlertCancel: "いいえ",
    },
    editorScreen: {
      prepareTime: {
        title: "準備時間",
        subtitle: "開始前の準備時間",
      },
      workoutTime: {
        title: "運動時間",
        subtitle: "運動時間",
      },
      restTime: {
        title: "休憩時間",
        subtitle: "運動の間の休憩時間",
      },
      restTimeSets: {
        title: "休憩時間 - サイクル",
        subtitle: "サイクリの間の休憩時間",
      },
      sets: {
        title: "サイクル",
        subtitle: "サイクル数",
      },
      workouts: {
        title: "動　　作",
        subtitle: "動作数",
      },
      resetAlertTitle: "設定リセット",
      resetAlertMsg: "タイマー設定をリセットしますか？",
      resetAlertOk: "はい",
      resetAlertCancel: "いいえ",
    },
    workoutListScreen: {
      resetAlertTitle: "全画像削除",
      resetAlertMsg: "画像を全部削除しますか？",
      resetAlertOk: "はい",
      resetAlertCancel: "いいえ",
    },
    workoutListDetailScreen: {
      alertPhotosPermissionTitle: "写真へのアクセスが必要",
      alertPhotosPermissionMsg:
        "トレーニングにカスタムな写真を使用したい場合、TabaTimerにデバイス上の写真へのアクセスを許可してください。",
      alertPhotosPermissionOk: "はい",
      alertPhotosPermissionCancel: "いいえ",
      alertPhotosPermissionMsgAndroid: `トレーニングにカスタムな写真を使用したい場合、デバイス上の"設定" → "アプリと通知" → "TabaTimer" → "権限" → "ストレージ"で、TabaTimerにデバイス上の写真へのアクセスを許可してください。`,
      alertPhotosPermissionMsgIos: `トレーニングにカスタムな写真を使用したい場合、デバイス上の"設定" → "TabaTimer" → "写真"で、TabaTimerにデバイス上の写真へのアクセスを許可してください。`,
    },
  },
  cht: {
    timerScreen: {
      sectionTypeWorkout: "運　動",
      sectionTypeRest: "休　息",
      sectionTypePrepare: "準　備",
      fractionDisplayTitleLeft: "循　環",
      fractionDisplayTitleRight: "動　作",
      resetAlertTitle: "重置計時器",
      resetAlertMsg: "確定要重置計時器嗎？",
      resetAlertOk: "好",
      resetAlertCancel: "取消",
    },
    editorScreen: {
      prepareTime: {
        title: "準備時間",
        subtitle: "開始前的準備時間",
      },
      workoutTime: {
        title: "運動時間",
        subtitle: "運動時間",
      },
      restTime: {
        title: "休息時間",
        subtitle: "運動間的休息時間",
      },
      restTimeSets: {
        title: "休息時間 - 循環",
        subtitle: "循環間的休息時間",
      },
      sets: {
        title: "循　　環",
        subtitle: "循環次數",
      },
      workouts: {
        title: "動　　作",
        subtitle: "動作數量",
      },
      resetAlertTitle: "重置設定",
      resetAlertMsg: "確定要重置計時器設定嗎？",
      resetAlertOk: "好",
      resetAlertCancel: "取消",
    },
    workoutListScreen: {
      resetAlertTitle: "刪除所有圖片",
      resetAlertMsg: "確定要刪除所有圖片嗎？",
      resetAlertOk: "好",
      resetAlertCancel: "取消",
    },
    workoutListDetailScreen: {
      alertPhotosPermissionTitle: "需要照片取用權限",
      alertPhotosPermissionMsg:
        "若想使用的自定義的照片進行健身，請允許TabaTimer取用裝置上的照片。",
      alertPhotosPermissionOk: "好",
      alertPhotosPermissionCancel: "取消",
      alertPhotosPermissionMsgAndroid: `若想使用的自定義的照片進行健身，請至裝置上的"設定" → "應用程式和通知" → "TabaTimer" → "權限" → "儲存空間"，並允許TabaTimer取用裝置上的照片。`,
      alertPhotosPermissionMsgIos: `若想使用的自定義的照片進行健身，請至裝置上的"設定" → "TabaTimer" → "照片"，並允許TabaTimer取用裝置上的照片。`,
    },
  },
};
export default uiTextDefaultData;
