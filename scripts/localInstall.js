//const os = require('os');
const child_process = require('child_process');
//const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

function getCmd() {
    let npm = fs.existsSync(path.resolve(process.cwd(), './package-lock.json')) || fs.existsSync(path.resolve(process.cwd(), '../package-lock.json'));
    let yarn = fs.existsSync(path.resolve(process.cwd(), './yarn.lock')) || fs.existsSync(path.resolve(process.cwd(), '../yarn.lock'));

    if (npm && yarn) {
        console.error('Found both package-lock.json and yarn.lock, use one or the other');
        process.exit(1);
    }
    else if (!npm && !yarn) {
        console.warn('No package-lock.json or yarn.lock');
        const response = prompt(`Which engine would you like to install the repository with? 'yarn' or 'npm'`, 'npm');
        npm = response.match('npm');
    }

    return npm ? 'npm i --save' : 'yarn add';
}

function getInstallCmd() {
    const repoName = require(path.resolve(process.cwd(), '../package.json')).name;
    return `${repoName}@file:..`;
}

function install(module) {
    return child_process.execSync(`${getCmd()} ${module}`, {
        cwd: process.cwd(),
        stdio: [process.stdin, process.stdout, process.stderr]
    });
}

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(function (file, index) {
            var curPath = path.resolve(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
};

function removeLoopedFolder() {
    const exampleAppName = require(path.resolve(process.cwd(), './package.json')).name;
    const repoName = require(path.resolve(process.cwd(), '../package.json')).name;

    const pathToLoop = path.resolve(process.cwd(), 'node_modules', repoName, exampleAppName);
    deleteFolderRecursive(pathToLoop);
}

function localInstall() {
    try {
        install(getInstallCmd());
        removeLoopedFolder();
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = { localInstall, removeLoopedFolder };