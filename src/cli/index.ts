#!/usr/bin/env node

import { Command } from 'commander';
import { createCommand } from './commands/index.js';
import type { CLIOptions } from '../types/index.js';

const program = new Command();

program
    .name('mern-cli-gen')
    .description('CLI tool to scaffold production-ready MERN stack projects')
    .version('1.0.0');

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
    .option('-a, --auth <type>', 'Auth: jwt, session, oauth, none', 'jwt')
    .option('-s, --state <manager>', 'State: redux, zustand, context, none', 'redux')
    .option('--tailwind', 'Include Tailwind CSS v4', true)
    .option('--no-tailwind', 'Skip Tailwind CSS')
    .option('--docker', 'Include Docker configuration', true)
    .option('--no-docker', 'Skip Docker configuration')
    .option('-g, --git', 'Initialize git repository', true)
    .option('--no-git', 'Skip git initialization')
    .option('-i, --install', 'Install dependencies after generation', true)
    .option('--no-install', 'Skip dependency installation')
    .option('--dry-run', 'Preview without creating files')
    .action(async (projectName: string, options: CLIOptions) => {
        try {
            await createCommand(projectName, options);
        } catch (error) {
            console.error('Error:', error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

program.parse();
