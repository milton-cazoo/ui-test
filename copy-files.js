/* eslint-disable no-console */
const { resolve, join, basename } = require("path");
const { readFile, writeFile, copy, mkdir, readdir } = require("fs-extra");

const packagePath = process.cwd();
const buildPath = join(packagePath, "./dist");

const getDirectories = async (source) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const writeJson = (targetPath, obj) =>
  writeFile(targetPath, JSON.stringify(obj, null, 2), "utf8");

// Create another another version of the package.json inside /dist
async function createCorePackage() {
  const packageData = await readFile(
    resolve(packagePath, "./package.json"),
    "utf8"
  );
  const { scripts, devDependencies, ...packageOthers } =
    JSON.parse(packageData);

  const newPackageData = {
    ...packageOthers,
    private: false,
    main: "./index.js",
    types: "./index.d.ts",
  };

  const targetPath = resolve(buildPath, "./package.json");

  await writeJson(targetPath, newPackageData);
  console.log(`Created core package`);
}

// Copy a file to /dist
async function includeFileInBuild(file) {
  const sourcePath = resolve(packagePath, file);
  const targetPath = resolve(buildPath, basename(file));
  await copy(sourcePath, targetPath);
  console.log(`Copied ${sourcePath} to ${targetPath}`);
}

async function createComponentPackages() {
  const componentsPath = buildPath + "/components";
  const components = await getDirectories(componentsPath);

  components.forEach(async (componentName) => {
    const componentPath = componentsPath + "/" + componentName;
    const packageData = await readFile(
      resolve(packagePath, `./src/components/${componentName}/package.json`),
      "utf8"
    );
    const { scripts, devDependencies, ...packageOthers } =
      JSON.parse(packageData);

    const newPackageData = {
      ...packageOthers,
      private: false,
      main: "./index.js",
      types: "./index.d.ts",
    };

    const targetPath = resolve(
      componentsPath,
      `./${componentName}/package.json`
    );

    await writeJson(targetPath, newPackageData);

    console.log(`Created ${componentName} package`);
  });
}

async function run() {
  try {
    await createCorePackage();
    await createComponentPackages();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
