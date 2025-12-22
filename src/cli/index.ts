#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Command } from 'commander';
import type { CLIOptions } from '../types/index.js';
import { createCommand } from './commands/index.js';

// Read version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const program = new Command();

program
    .name('mern-cli-gen')
    .description('CLI tool to scaffold production-ready MERN stack projects')
    .version(packageJson.version);

program
    .command('create <project-name>')
    .description('Create a new MERN project')
    .option('-m, --mode <mode>', 'Generation mode: full, frontend, backend', 'full')
    .option('-t, --typescript', 'Use TypeScript (default)', true)
    .option('-j, --javascript', 'Use JavaScript')
    .option('-e, --es6', 'Use ES6 modules (default)', true)
    .option('-v, --vanilla', 'Use CommonJS modules')
    .option('-f, --frontend <framework>', 'Frontend: vite, nextjs', 'vite')
    .option('-d, --database <db>', 'Database: mongodb, postgresql', 'mongodb')
    .option('--orm <orm>', 'ORM for SQL: prisma, pg', 'prisma')
    .option('-a, --auth <type>', 'Auth: jwt, session, passport, none', 'jwt')
    .option('-s, --state <manager>', 'State: zustand, redux, context, none', 'zustand')
    .option('--tailwind', 'Include Tailwind CSS v4', true)
    .option('--no-tailwind', 'Skip Tailwind CSS')
    .option('--docker', 'Include Docker configuration', true)
    .option('--no-docker', 'Skip Docker configuration')
    .option('-g, --git', 'Initialize git repository', true)
    .option('--no-git', 'Skip git initialization')
    .option('-i, --install', 'Install dependencies after generation', true)
    .option('--no-install', 'Skip dependency installation')
    .option('--dry-run', 'Preview without creating files')
    .option('-y, --yes', 'Skip all prompts and use defaults')
    .action(async (projectName: string, options: CLIOptions) => {
        try {
            await createCommand(projectName, options);
        } catch (error) {
            console.error('Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

program.parse();
