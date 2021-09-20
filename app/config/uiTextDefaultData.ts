interface TimerScreen {
  sectionTypeWorkout: string;
  sectionTypeRest: string;
  sectionTypePrepare: string;
  fractionDisplayTitleLeft: string;
  fractionDisplayTitleRight: string;
  resetAlertTitle: string;
  resetAlertMsg: string;
  resetAlertOk: string;
  resetAlertCancel: string;
}

interface ItemEditorScreen {
  title: string;
  subtitle: string;
}

interface EditorScreen {
  prepareTime: ItemEditorScreen;
  workoutTime: ItemEditorScreen;
  restTime: ItemEditorScreen;
  restTimeSets: ItemEditorScreen;
  sets: ItemEditorScreen;
  workouts: ItemEditorScreen;
  resetAlertTitle: string;
  resetAlertMsg: string;
  resetAlertOk: string;
  resetAlertCancel: string;
}

interface WorkoutListScreen {
  resetAlertTitle: string;
  resetAlertMsg: string;
  resetAlertOk: string;
  resetAlertCancel: string;
}

interface WorkoutListDetailScreen {
  alertPhotosPermissionTitle: string;
  alertPhotosPermissionMsg: string;
  alertPhotosPermissionOk: string;
  alertPhotosPermissionCancel: string;
  alertPhotosPermissionMsgAndroid: string;
  alertPhotosPermissionMsgIos: string;
}

interface SubtitleAccountScreen {
  noUser: string;
  withUserNameNotAvailable: string;
  withUserBeforeProvidor: string;
  withUserAfterProvidor: string;
}

interface TrackingPermissionAccountScreen {
  btnText: string;
  alertMainTitle: string;
  alertMainMsg: string;
  alertMainOkBtnText: string;
  dataUsageExplainText: string;
}

interface UploadBtnAccountScreen {
  alertMainTitle: string;
  alertMainMsg: string;
  alertMainOkBtnText: string;
  alertMainCancelBtnText: string;
  alertSucceedTitle: string;
  alertSucceedMsg: string;
  alertErrorTitle: string;
  textBelow: string;
}

interface DownloadBtnAccountScreen {
  alertMainTitle: string;
  alertMainMsg: string;
  alertMainOkBtnText: string;
  alertMainCancelBtnText: string;
  alertSucceedTitle: string;
  alertSucceedMsg: string;
  alertErrorTitle: string;
  alertNoDataTitle: string;
  alertNoDataMsg: string;
  textBelow: string;
}

interface AccountScreen {
  title: string;
  subtitle: SubtitleAccountScreen;
  trackingPermission: TrackingPermissionAccountScreen;
  signOutBtnText: string;
  uploadBtn: UploadBtnAccountScreen;
  downloadBtn: DownloadBtnAccountScreen;
}

export interface ItemLang {
  timerScreen: TimerScreen;
  editorScreen: EditorScreen;
  workoutListScreen: WorkoutListScreen;
  workoutListDetailScreen: WorkoutListDetailScreen;
  accountScreen: AccountScreen;
}

interface RootObject {
  en: ItemLang;
  ja: ItemLang;
  zh_Hant_TW: ItemLang;
}

const uiTextDefaultData: RootObject = {
  en: {
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
    accountScreen: {
      title: "User Account",
      subtitle: {
        noUser: "Sign in for upload / download settings",
        withUserNameNotAvailable: "You",
        withUserBeforeProvidor: " signed in with ",
        withUserAfterProvidor: "",
      },
      trackingPermission: {
        btnText: "Sign in",
        alertMainTitle: "Need Tracking Permission",
        alertMainMsg: `TabaTimer needs tracking permission to sign in. If you would like to continue, go to "Settings" → "TabaTimer" on your device, and turn on "Allow Tracking".`,
        alertMainOkBtnText: "Ok",
        dataUsageExplainText:
          "Tabatimer uses your name, email and your accounts id to create your personal account in our database. The data is only used for authentication.",
      },
      signOutBtnText: "Sign out",
      uploadBtn: {
        alertMainTitle: "Upload Settings",
        alertMainMsg:
          "This will overwrite the settings on your account. Continue?",
        alertMainOkBtnText: "Ok",
        alertMainCancelBtnText: "Cancel",
        alertSucceedTitle: "Succeed",
        alertSucceedMsg: "Setting uploaded.",
        alertErrorTitle: "Error",
        textBelow: "Upload",
      },
      downloadBtn: {
        alertMainTitle: "Download Settings",
        alertMainMsg:
          "This will overwrite the settings on your device. Continue?",
        alertMainOkBtnText: "Ok",
        alertMainCancelBtnText: "Cancel",
        alertSucceedTitle: "Succeed",
        alertSucceedMsg: "Setting downloaded.",
        alertErrorTitle: "Error",
        alertNoDataTitle: "No Data",
        alertNoDataMsg: "No data in your account.",
        textBelow: "Download",
      },
    },
  },
  ja: {
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
    accountScreen: {
      title: "アカウント",
      subtitle: {
        noUser: `設定を同期するため、サインインしてください`,
        withUserNameNotAvailable: "あなた",
        withUserBeforeProvidor: " は ",
        withUserAfterProvidor: " でログインした",
      },
      trackingPermission: {
        btnText: "サインイン",
        alertMainTitle: "トラッキングの許可が必要",
        alertMainMsg: `TabaTimerにサインインするには、トラッキングの許可が必要です。サインインしたい場合、デバイス上の"設定" → "TabaTimer"で,"トラッキングを許可"をオンにしてください。`,
        alertMainOkBtnText: "はい",
        dataUsageExplainText:
          "TabaTimerは、使用者の名前、メールアドレスとアカウントIDを使用して、データベースに使用者のアカウントを作成します。データは認証にのみ使用されます。",
      },
      signOutBtnText: "ログアウト",
      uploadBtn: {
        alertMainTitle: "設定アップロード",
        alertMainMsg:
          "アカウントに保存した設定が上書きされます。よろしいですか？",
        alertMainOkBtnText: "はい",
        alertMainCancelBtnText: "いいえ",
        alertSucceedTitle: "成功",
        alertSucceedMsg: "設定をアップロードしました。",
        alertErrorTitle: "エラー",
        textBelow: "アップロード",
      },
      downloadBtn: {
        alertMainTitle: "設定ダウンロード",
        alertMainMsg: "デバイスの設定が上書きされます。よろしいですか？",
        alertMainOkBtnText: "はい",
        alertMainCancelBtnText: "いいえ",
        alertSucceedTitle: "成功",
        alertSucceedMsg: "設定をダウンロードしました。",
        alertErrorTitle: "エラー",
        alertNoDataTitle: "データなし",
        alertNoDataMsg: "アカウントにデータがありません。",
        textBelow: "ダウンロード",
      },
    },
  },
  zh_Hant_TW: {
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
    accountScreen: {
      title: "使用者帳號",
      subtitle: {
        noUser: "請登錄帳號以 上傳 / 下載 使用者設定",
        withUserNameNotAvailable: "你",
        withUserBeforeProvidor: " 以 ",
        withUserAfterProvidor: " 帳號登入",
      },
      trackingPermission: {
        btnText: "登　入",
        alertMainTitle: "需要追蹤權限",
        alertMainMsg: `TabaTimer需要跟踪權限才能登錄。若要進行登入，請至裝置上的"設定" → "TabaTimer"，並打開"允許追蹤".`,
        alertMainOkBtnText: "好",
        dataUsageExplainText:
          "TabaTimer使用您的姓名、電子郵件和帳號ID在我們的數據庫中創建您的帳號。此數據僅用於身份驗證。",
      },
      signOutBtnText: "登　出",
      uploadBtn: {
        alertMainTitle: "上傳使用者設定",
        alertMainMsg: "這將覆寫您帳戶上儲存的設定。確定繼續嗎？",
        alertMainOkBtnText: "好",
        alertMainCancelBtnText: "取消",
        alertSucceedTitle: "成功",
        alertSucceedMsg: "成功上傳使用者設定.",
        alertErrorTitle: "錯誤",
        textBelow: "上傳設定",
      },
      downloadBtn: {
        alertMainTitle: "下載使用者設定",
        alertMainMsg: "這將覆寫此裝置上的設定。確定繼續嗎？",
        alertMainOkBtnText: "好",
        alertMainCancelBtnText: "取消",
        alertSucceedTitle: "成功",
        alertSucceedMsg: "成功下載使用者設定.",
        alertErrorTitle: "錯誤",
        alertNoDataTitle: "沒有數據",
        alertNoDataMsg: "您的帳戶中沒有數據。",
        textBelow: "下載設定",
      },
    },
  },
};
export default uiTextDefaultData;
