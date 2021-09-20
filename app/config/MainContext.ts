import { createContext, Dispatch } from "react";

import { WorkoutSetupProps } from "./timerSetupDefaultData";
import { ItemLang } from "./uiTextDefaultData";

interface MainContextProps {
  tabBar: { tabBarShow: boolean; setTabBarShow: Dispatch<boolean> };
  timer: {
    timerSetup: WorkoutSetupProps;
    setTimerSetup: Dispatch<WorkoutSetupProps>;
  };
  language: { uiText: ItemLang; setLanguage: Dispatch<string> };
}

export const MainContext = createContext({} as MainContextProps);
