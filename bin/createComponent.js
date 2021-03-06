const path = require('path');
const fs = require('fs');
const os = require('os');
// const { buildStory, buildTest, buildSource, buildSourceIndex } = require('./builders');
const { buildTest, buildSource, buildSourceIndex } = require('./builders');

const replacementString = 'Component';
const componentPath = 'src/components/';

const componentStruct = {
  root: {
    src: {
      components: {
        Component: [
          // {
          //   __stories__: [
          //     {
          //       'Component.stories.ts': buildStory,
          //     },
          //   ],
          // },
          {
            __tests__: [
              {
                'Component.test.tsx': buildTest,
              },
            ],
          },
          {
            'Component.tsx': buildSource,
          },
          {
            'index.ts': buildSourceIndex,
          },
        ],
      },
    },
  },
};

/*
 *   Finds the project main directory with the `package.json` file
 *   1. Start at the directory you run the script
 *   2. Continually `cd ..` to see if `package.json` is there
 *
 *   Question: do we need to check for skipping the folder?
 *   --> package.json has to be found for a yarn script to run
 *   --> if no package.json then we'll get some other error prior to running script
 */
const findRoot = () => {
  let thisPath = path.resolve(__dirname);
  while (!fs.existsSync(path.join(thisPath, 'package.json'))) {
    thisPath = path.join(thisPath, '..');
  }

  return thisPath;
};

const doesPathExist = (directoryName) => fs.existsSync(directoryName);

const doesComponentExist = (componentName, root) => {
  const newPath = path.join(root, componentPath, componentName);

  const wasComponentFound = doesPathExist(newPath);

  if (wasComponentFound) {
    console.error(`Component "${componentName}" Already Exists`); // eslint-disable-line no-console
  }

  return wasComponentFound;
};

/*
 *  Split path into segments, and incrementally mkdir until we have built the full path
 *     -> this could be done with `mkdir -p` if we had some other cross platform node package.
 */
const mkdirSyncRecursive = (directory) => {
  // adjust windows path delim to match bash.
  const newPath = directory.replace(/\\{1,2}/g, '/').split('/');

  newPath.reduce((accumPath, nextPath) => {
    const incrementalPath = `${accumPath}/${nextPath}`;

    if (incrementalPath.length > 0 && !fs.existsSync(incrementalPath)) {
      fs.mkdirSync(incrementalPath);
    }

    return incrementalPath;
  });
};

const writeFileData = (fileData, fileName) => {
  console.log(`Creating file: ${fileName}`); // eslint-disable-line no-console

  const directoryName = path.dirname(fileName);

  // Only call recursive create if the folder doesn't yet exist
  if (!doesPathExist(directoryName)) {
    mkdirSyncRecursive(directoryName);
  }

  fs.writeFileSync(fileName, fileData);
};

// Changes path when the configuration tree needs to be modified to respect user input.
const conditionallyAdjustPath = (key, currentPath, componentName) => {
  let pathBase;

  if (key.indexOf(replacementString) === 0) {
    pathBase = key.replace(replacementString, componentName);
  } else {
    pathBase = key;
  }

  const adjustedPath = path.join(currentPath, pathBase);

  return adjustedPath;
};

// Interacts with the configuration tree based on what it finds in each object.
const recurseStructure = (subObject, currentPath, componentName) => {
  let newPath;

  for (const key in subObject) {
    if (subObject[key]) {
      newPath = conditionallyAdjustPath(key, currentPath, componentName);

      // Recursive base case - write file data when a function is found
      if (typeof subObject[key] === 'function') {
        const fileData = subObject[key](componentName);
        writeFileData(fileData, newPath, key);

        return;
      }

      // Recurse over arrays or objects within file/folder structure
      if (Array.isArray(subObject[key])) {
        // eslint-disable-next-line no-loop-func
        subObject[key].forEach((arrayItem) => {
          recurseStructure(arrayItem, newPath, componentName);
        });

        return;
      }

      recurseStructure(subObject[key], newPath, componentName);
    }
  }
};

const addComponentToMapper = (componentName, root) => {
  fs.open(`${root}/src/index.ts`, 'a', 666, (error, fileID) => {
    if (error) {
      console.error(error);
      return;
    }

    const newLineOfCode = `export { ${componentName} } from './components/${componentName}';${os.EOL}`;

    fs.write(fileID, newLineOfCode, (error, written, string) => {
      if (error) {
        console.error(
          `Error when attempting to write new line to component mapper for ${componentName}\n`,
          error,
        );
      }
    });
  });
};

// Function runner
(() => {
  if (process.argv.length < 3) {
    console.error(
      'Error: You must provide at least one component name to script.',
      'Example: "yarn create-component componentName"',
    );

    return;
  }

  const mainTree = componentStruct.root;
  const root = findRoot();

  // array -> set -> array casting to make sure component names cant be duped
  const componentNames = Array.from(new Set(process.argv.slice(2)));

  componentNames
    .filter((componentName) => {
      return doesComponentExist(componentName, root) === false;
    })
    .forEach((componentName) => {
      addComponentToMapper(componentName, root);
      recurseStructure(mainTree, root, componentName);
    });
})();
