import {
  writeFileSync,
  readdirSync,
  readFileSync,
  lstatSync,
  appendFileSync,
} from "fs";
import { JSDOM } from "jsdom";
import MarkdownIt from "markdown-it";
import { execSync } from "child_process";
import path from "path";

import { fileURLToPath } from "url";

const md = MarkdownIt({
  html: true,
});

var exe;
try {
  execSync("which bun");
  exe = "bun";
} catch (error) {
  exe = "npx bun";
}


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
import { config } from "dotenv";
config();

execSync("rm -rf dist/");


if (process.env.PRODUCTION) {
  execSync(
    `${exe} build --minify --target=browser --sourcemap=external --outdir=dist src/main.js`
  );
  appendFileSync("dist/main.js", "\n//# sourceMappingURL=main.js.map");
} else {
  execSync(
    `${exe} build --minify --target=browser --sourcemap=none --outdir=dist src/main.js`
  );
}

execSync("cp -r static/* dist/");

const mainPage = new JSDOM(readFileSync(__dirname + "/page_tmpl.html"), {
  runScripts: "outside-only",
});

// eslint-disable-next-line no-unused-vars
function scanDir(dir, mainDom) {
  console.log(`listing ${dir}`);
  var ls = readdirSync("pages/" + dir);
  var output="";
  for (let i = 0; i < ls.length; i++) {
    var element = ls[i];
    console.log(`checking ${dir}/${element}`);
    var stats = lstatSync(`${__dirname}/pages/${dir}/${element}`);
    if (stats.isDirectory()) {

      console.log(`${element} is a dir`);
      execSync(`mkdir dist/${dir}/${element}`);
      var scanout = scanDir(`${dir}/${element}`);
      output+=`<button class="accordian">${element.replaceAll("_", " ")}</button><div class="panel">${scanout}</div>`;
    } else {
      output+=`<p>${element.replaceAll("_", " ").replace(/\.md$/, "")}</p>`;
      console.log(`${element} is a file`);
      var cont = "" + readFileSync(`${__dirname}/pages/${dir}/${element}`);
      var tmpl = "" + readFileSync(`${__dirname}/page_tmpl.html`);
      var source = md.render(cont);
      tmpl=tmpl.replaceAll(
        "${{cnt}}",
        source
      );
      console.log(`rendering md file ${element}`);
      writeFileSync(`dist/${dir}/${element.replace(/\.md$/i, ".html")}`, tmpl);
    }
  }
  return output;
}

// writeFileSync("dist/index.html", mainPage.serialize());

console.log("running Scan");
var fo = scanDir("", mainPage);

var index = ""+readFileSync("page_tmpl.html");

writeFileSync("dist/index.html", index.replaceAll("${{cnt}}", fo));
