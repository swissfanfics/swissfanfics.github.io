import {
  writeFileSync,
  readdirSync,
  readFileSync,
  lstatSync,
  appendFileSync,
} from "fs";
import MarkdownIt from "markdown-it";
import { execSync } from "child_process";
import path from "path";
import format from "html-format";

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

function scanDir(dir) {
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
      output+=`<fluent-accordion><fluent-accordion-item><span slot="heading">${element.replaceAll("_", " ")}</span><div class="panel">${scanout}</div></fluent-accordion-item></fluent-accordion>`;
    } else {
      output+=`<hr><a href="${dir}/${element.replace(/\.md$/, ".html")}">${element.replaceAll("_", " ").replace(/\.md$/, "")}</a>`;
      console.log(`${element} is a file`);
      var cont = "" + readFileSync(`${__dirname}/pages/${dir}/${element}`);
      var tmpl = "" + readFileSync(`${__dirname}/page_tmpl.html`);
      var source = md.render(cont);
      var v =`<h1 class="center">${(`${dir.replace(/^\//, "")}/${element.replace(/\.md$/,"")}`).replaceAll("/", " - ").replaceAll("_", " ")}</h1>`;
      console.log(v);
      tmpl=tmpl.replaceAll(
        "${{cnt}}",
        v+source
      );
      console.log(`rendering md file ${element}`);
      writeFileSync(`dist/${dir}/${element.replace(/\.md$/i, ".html")}`, format(tmpl));
    }
  }
  return output;
}

console.log("running Scan");
var fo = scanDir("");

var index = ""+readFileSync("page_tmpl.html");

writeFileSync("dist/index.html", format(index.replaceAll("${{cnt}}", fo)));
