#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import { exec, execSync } from 'child_process';
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

function createProject() {
    projectPath = `${currentPath}/${projectName}`
    exec(`mkdir -p ${projectPath}`, async (error, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) return;
        await sleep();
        initProject()
    });
}


function initProject() {
    execSync(`cd "${projectPath}" && npm init -y`, {stdio: 'inherit'})
    execSync(`cd "${projectPath}" && npm install react react-dom`, {stdio: 'inherit'})
    execSync(`cd "${projectPath}" && npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader`, {stdio: 'inherit'})
    const babelConfig = {
        "presets": ["@babel/preset-env", "@babel/preset-react"]
    }
    fs.writeFile(`${projectPath}/.babelrc`, JSON.stringify(babelConfig), (err) => {
        if (err) throw err;
    });
    execSync(`cd "${projectPath}" && npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader`, {stdio: 'inherit'})
}

await welcome()
await askProjectName()
createProject()