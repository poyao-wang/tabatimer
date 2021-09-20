import { NavigationContainerRef } from "@react-navigation/core";
import React from "react";

export const navigationRef = React.createRef<NavigationContainerRef>();

const navigate = (name, params?) =>
  navigationRef.current?.navigate(name, params);

export default { navigate };
