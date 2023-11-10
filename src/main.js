import Analytics from "analytics";
import googleTagManager from "@analytics/google-tag-manager";

import { HighlightJS } from "highlight.js";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, far, fas);

dom.i2svg();

const analytics = Analytics({
  app: "GHPages",
  plugins: [
    googleTagManager({
      containerId: "G-Q96JJVSGRQ",
    }),
  ],
});

var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", () => {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

analytics.page();
