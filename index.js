#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import { exec } from 'child_process';
import path from 'path';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

let projectName = null

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
    exec(`mkdir -p ~/${projectName}`, async (error, stderr) => {
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
    exec(`npx init -y ~/${projectName}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log("==Tudo pronto para começar==")
    });
    return
    exec(`cd ~/${projectName} | sudo npm install ffi`).stderr.pipe(process.stderr);
}


await welcome()
await askProjectName()
createProject()