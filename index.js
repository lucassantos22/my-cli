#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import { exec, execSync } from 'child_process';
import path from 'path';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

let projectName = null
let currentPath = process.cwd()

const runCommand = (command, obj) => {
    try {
        const config = {stdio: 'inherit', ...obj}
        execSync(command, config)
    } catch (err) {
        console.log(`Failed to run command ${command}`, err)
        return false
    }
    return true;
}

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
    exec(`mkdir -p ${currentPath}/${projectName}`, async (error, stderr) => {
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
    const success = runCommand(`cd "${currentPath}/${projectName}" && npm init -y`)
    if (!success) return;
}

await welcome()
await askProjectName()
createProject()