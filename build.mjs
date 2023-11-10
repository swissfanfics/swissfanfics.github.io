import {
  writeFileSync,
  readdirSync,
  readFileSync,
  lstatSync,
  realpath,
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
  for (let i = 0; i < ls.length; i++) {
    var element = ls[i];
    console.log(`checking ${dir}/${element}`);
    var stats = lstatSync(`${__dirname}/pages/${dir}/${element}`);
    if (stats.isDirectory()) {
      console.log(`${element} is a dir`);
      execSync(`mkdir dist/${dir}/${element}`);
      scanDir(`${dir}/${element}`);
    } else {
      console.log(`${element} is a file`);
      var cont = "" + readFileSync(`${__dirname}/pages/${dir}/${element}`);
      var tmpl = "" + readFileSync(`${__dirname}/page_tmpl.html`);
      var source = md.render(cont);
      console.log("source");
      tmpl.replace(
        "<div class=\"content\" id=\"content\">",
        `<div class="content" id="content">${source}`
      );
      console.log(`rendering md file ${element}`);
      writeFileSync(`dist/${dir}/${element.replace(/\.md$/i, ".html")}`, tmpl);
    }
  }
}

// writeFileSync("dist/index.html", mainPage.serialize());

console.log("running Scan");
scanDir("", mainPage);
