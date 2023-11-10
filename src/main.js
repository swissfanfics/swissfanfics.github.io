import Analytics from "analytics";
import googleTagManager from "@analytics/google-tag-manager";
import { fluentAccordionItem, fluentAccordion, provideFluentDesignSystem } from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentAccordionItem(),
  fluentAccordion()
);

// const myTheme = createTheme({
//   palette: {
//     themePrimary: "#a2d2fb",
//     themeLighterAlt: "#acd6fa",
//     themeLighter: "#b6dbfb",
//     themeLight: "#c1e0fc",
//     themeTertiary: "#cbe5fc",
//     themeSecondary: "#d5eafd",
//     themeDarkAlt: "#dfeffd",
//     themeDark: "#e9f4fe",
//     themeDarker: "#f4f9fe",
//     neutralLighterAlt: "#0d1116",
//     neutralLighter: "#0d1016",
//     neutralLight: "#0c1015",
//     neutralQuaternaryAlt: "#0b0f14",
//     neutralQuaternary: "#0b0e13",
//     neutralTertiaryAlt: "#0a0d12",
//     neutralTertiary: "#9da2a6",
//     neutralSecondary: "#84878b",
//     neutralPrimaryAlt: "#6a6d6f",
//     neutralPrimary: "#ecf2f8",
//     neutralDark: "#363739",
//     black: "#1c1d1e",
//     white: "#0d1117",
//   }});

// import { HighlightJS } from "highlight.js";

// import { library, dom } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import { far } from "@fortawesome/free-regular-svg-icons";
// import { fas } from "@fortawesome/free-solid-svg-icons";

// library.add(fab, far, fas);

// dom.i2svg();

const analytics = Analytics({
  app: "swiss",
  plugins: [
    googleTagManager({
      containerId: "G-Q96JJVSGRQ",
    }),
  ],
});



analytics.page();
