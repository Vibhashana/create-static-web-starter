#!/usr/bin/env node

const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(`${command}, {stdio: 'inherit'}`);
  } catch (error) {
    console.error(`Failed to execute ${command}`, error);
    return false;
  }

  return true;
};

const repo = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/Vibhashana/static-web-starter ${repo}`;
const installDepsCommand = `cd ${repo} && npm install`;

console.log(`Cloning the repository with the name ${repo}`);

const checkedOut = runCommand(gitCheckoutCommand);

if (!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repo}`);

const installedDeps = runCommand(installDepsCommand);

if (!installedDeps) process.exit(-1);

console.log(
  "Congratulations! The project has been set up successfully. Run following command to start"
);
console.log("npm start");
