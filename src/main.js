import Analytics from "analytics";
import googleTagManager from "@analytics/google-tag-manager";
import { fluentAccordionItem, fluentAccordion, provideFluentDesignSystem } from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentAccordionItem(),
  fluentAccordion()
);

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
