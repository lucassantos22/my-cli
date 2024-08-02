#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import shell from 'shelljs'
import fs from 'fs';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

let projectName = null
let currentPath = process.cwd()
let projectPath = null

async function welcome() {
    const title = chalkAnimation.karaoke("Welcome to the caslu's CLI!");

    await sleep();
    title.stop()
    console.log(chalk.italic("Let's get started!"))
}

async function askProjectName() {
    const answers = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: "What is the project's name?",
        default() {
            return 'my_project'
        }
    })

    projectName = answers.projectName.replaceAll(' ', '_')
}

async function createProject() {
    projectPath = `${currentPath}/${projectName}`
    shell.exec(`mkdir -p ${projectPath}`)
    await sleep();
    initProject()
}


function initProject() {
    shell.exec(`cd "${projectPath}" && npm init -y`)
    shell.exec(`cd "${projectPath}" && npm install react react-dom`)
    shell.exec(`cd "${projectPath}" && npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader`)
    const babelConfig = {
        "presets": ["@babel/preset-env", "@babel/preset-react"]
    }
    fs.writeFile(`${projectPath}/.babelrc`, JSON.stringify(babelConfig), (err) => {
        if (err) throw err;
    });
    shell.exec(`cd "${projectPath}" && npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader`)

    fs.copyFile('./configs/webpack.config.js', `${projectPath}/webpack.config.js`, (err) => {
        if (err) throw err;
    });
    shell.exec(`cd "${projectPath}" && mkdir public`)
    shell.exec(`cd "${projectPath}" && mkdir src`)
    fs.copyFile('./configs/index.html', `${projectPath}/public/index.html`, (err) => {
        if (err) throw err;
    });
    fs.copyFile('./configs/index.js', `${projectPath}/src/index.js`, (err) => {
        if (err) throw err;
    });
    fs.copyFile('./configs/App.js', `${projectPath}/src/App.js`, (err) => {
        if (err) throw err;
    });
}

await welcome()
await askProjectName()
createProject()