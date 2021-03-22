import React from "react";
import { View, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";

const svgOriginalText = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 283.46 283.46"><defs><clipPath id="clip-path" transform="translate(0)"><rect width="283.46" height="283.46" rx="58.11" style="fill:#00a14b"/></clipPath><linearGradient id="linear-gradient" x1="143.52" y1="-12.45" x2="138.84" y2="391.29" gradientUnits="userSpaceOnUse"><stop offset="0.05" stop-color="#75c594"/><stop offset="0.28" stop-color="#72c492"/><stop offset="0.46" stop-color="#68c28c"/><stop offset="0.61" stop-color="#58be82"/><stop offset="0.75" stop-color="#42b873"/><stop offset="0.77" stop-color="#3eb771"/></linearGradient></defs><rect width="283.46" height="283.46" rx="58.11" style="fill:#00a14b"/><g style="clip-path:url(#clip-path)"><rect width="283.46" height="283.46" style="fill:url(#linear-gradient)"/><path d="M128.38,146.18a12.68,12.68,0,0,0,2.06,2.21h0a13.39,13.39,0,0,0,9.6,3.11,13,13,0,0,0,12.28-13.68,12.69,12.69,0,0,0-7-10.42h0l-45.84-23a4.91,4.91,0,0,0-2.7-.87,3.66,3.66,0,0,0-3.46,3.86c.08,1.16.84,1.84,1.68,2.74Z" transform="translate(0)" style="fill:#f58e8d"/><path d="M147.17,42.2s-5.46-.34-7.65-.34c-6.86,0-12.42,4.41-12.42,9.85a8.17,8.17,0,0,0,.16,1.48l-.16.08v33h0a12.08,12.08,0,0,0,24.1,0h0v-20A73.32,73.32,0,0,1,212,138.75c0,40.6-32.61,73.51-72.83,73.51s-72.82-32.91-72.82-73.51A73.71,73.71,0,0,1,78,98.92a11.24,11.24,0,0,0,3.37-8A11.67,11.67,0,0,0,69.49,79.44a12,12,0,0,0-9.25,4.3l-.05,0c-.15.22-.29.44-.43.66a6.64,6.64,0,0,0-.43.65A97.06,97.06,0,0,0,43.2,138.75c0,53.51,43,96.89,96,96.89s96-43.38,96-96.89C235.17,88,196.44,46.3,147.17,42.2Z" transform="translate(0)" style="fill:#fff"/></g></svg>`;

function AppIconSvg(props) {
  return <SvgXml xml={svgOriginalText} width="100%" height="100%" />;
}

const styles = StyleSheet.create({
  container: {},
});
export default AppIconSvg;
