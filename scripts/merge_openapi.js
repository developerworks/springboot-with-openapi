let fs = require("fs");
let YAML = require("yaml");

let rootYmlPath = "openapi.yaml";
let inputDir = "openapi_modules"
let outputFile = "openapi-merged.yaml"

console.log(`...opening root file ${rootYmlPath}`);
if (!fs.existsSync(rootYmlPath)) {
  return console.error("input directory should contain a openapi.yml file");
}

const rootFileContent = fs.readFileSync(rootYmlPath, 'utf8')
const json = YAML.parse(rootFileContent);

const schemasFolder = `${inputDir}/components/schemas`;
if (! json.components) json.components = {};
if (! json.components.schemas) json.components.schemas = {};
const schemas = processFolder(json.components.schemas, schemasFolder);

// const pathsFolder = `${inputDir}/paths`;
// if (! json.paths) json.paths = {};
// const paths = processFolder(json.paths, pathsFolder);

let data = "";
if (!outputFile.toLowerCase().endsWith(".json")) {
  data = YAML.stringify(json);
} else {
  data = JSON.stringify(json);
}

fs.writeFileSync(outputFile, data, { encoding: 'utf8'});


function printHelp() {
  console.log("parameters:   <inputdir> <outputfile> [--help]")
  console.log("  --help         generates this message.");
  console.log("  <inputdir>     a directory containing individual yml files in a swagger structure.");
  console.log("  <outputfile>   a directory containing the merged swagger yml files.");
}

function processFolder(target, folder) {
  console.log(`processing folder ${folder}`);
  const parts = folder.split("/");
  const folderName = parts[parts.length - 1];

  const files = fs.readdirSync(folder);
  for (const file of files) {
    const fullPath = `${folder}/${file}`;
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      processFolder(target, fullPath);
    } else {
      processFile(target, fullPath);
    }
  }
}

function processFile(target, file) {
  const content = fs.readFileSync(file, 'utf8')
  const json = YAML.parse(content);

  for (const key in json) {
    if (!json.hasOwnProperty(key)) continue;
    target[key] = json[key];
  }
}