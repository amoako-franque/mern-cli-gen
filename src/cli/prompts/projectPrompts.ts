import inquirer from 'inquirer';
import type {
    AuthType,
    CicdProvider,
    CLIOptions,
    Database,
    Frontend,
    GenerationMode,
    Language,
    ModuleSystem,
    PaymentProvider,
    ProjectConfig,
    StateManagement,
} from '../../types/index.js';
import { logger } from '../../utils/index.js';

/**
 * Run interactive prompts to gather project configuration
 */
export async function runProjectPrompts(
    projectName: string,
    options: CLIOptions
): Promise<ProjectConfig> {
    const answers: Partial<ProjectConfig> = {
        projectName,
    };


    // Mode selection prompt - should be first
    if (!options.yes && options.mode === undefined) {
        logger.newLine();
        const { mode } = await inquirer.prompt<{ mode: GenerationMode }>([
            {
                type: 'list',
                name: 'mode',
                message: 'What would you like to generate?',
                choices: [
                    { name: 'Full Stack (client + server)', value: 'full' },
                    { name: 'Frontend Only (React)', value: 'frontend' },
                    { name: 'Backend Only (Express API)', value: 'backend' },
                ],
                default: 'full',
            },
        ]);
        answers.mode = mode;
    } else {
        answers.mode = options.mode || 'full';
    }


    // Language selection prompt
    if (!options.yes && options.typescript === undefined && options.javascript === undefined) {
        logger.newLine();
        const { language } = await inquirer.prompt<{ language: Language }>([
            {
                type: 'list',
                name: 'language',
                message: 'Which programming language would you like to use?',
                choices: [
                    { name: 'TypeScript (recommended)', value: 'typescript' },
                    { name: 'JavaScript', value: 'javascript' },
                ],
                default: 'typescript',
            },
        ]);
        answers.language = language;
    } else {
        answers.language = options.javascript ? 'javascript' : 'typescript';
    }

    // Module system selection (only for JavaScript)
    if (answers.language === 'javascript' && options.es6 === undefined && options.vanilla === undefined) {
        logger.newLine();
        const { moduleSystem } = await inquirer.prompt<{ moduleSystem: ModuleSystem }>([
            {
                type: 'list',
                name: 'moduleSystem',
                message: 'Which JavaScript module system would you like to use?',
                choices: [
                    { name: 'ES6 Modules (import/export) - recommended', value: 'es6' },
                    { name: 'CommonJS (require/module.exports)', value: 'vanilla' },
                ],
                default: 'es6',
            },
        ]);
        answers.moduleSystem = moduleSystem;
    } else if (answers.language === 'typescript') {
        answers.moduleSystem = 'es6'; // TypeScript always uses ES6
    } else {
        answers.moduleSystem = options.vanilla ? 'vanilla' : 'es6';
    }


    if (!options.yes && (answers.mode === 'full' || answers.mode === 'frontend')) {
        const { frontend } = await inquirer.prompt<{ frontend: Frontend }>([
            {
                type: 'list',
                name: 'frontend',
                message: 'Which frontend framework would you like to use?',
                choices: [
                    { name: 'Vite + React (recommended)', value: 'vite' },
                    { name: 'Next.js', value: 'nextjs' },
                ],
                default: options.frontend || 'vite',
            },
        ]);
        answers.frontend = frontend;
    } else {
        answers.frontend = options.frontend || 'vite';
    }


    if (!options.yes && (answers.mode === 'full' || answers.mode === 'frontend')) {
        const { state } = await inquirer.prompt<{ state: StateManagement }>([
            {
                type: 'list',
                name: 'state',
                message: 'Which state management solution would you like?',
                choices: [
                    { name: 'Zustand (recommended)', value: 'zustand' },
                    { name: 'Redux Toolkit', value: 'redux' },
                    { name: 'React Context', value: 'context' },
                    { name: 'None', value: 'none' },
                ],
                default: options.state || 'zustand',
            },
        ]);
        answers.state = state;
    } else {
        answers.state = options.state || 'zustand';
    }


    if (!options.yes && (answers.mode === 'full' || answers.mode === 'backend')) {
        const { database } = await inquirer.prompt<{ database: Database }>([
            {
                type: 'list',
                name: 'database',
                message: 'Which database would you like to use?',
                choices: [
                    { name: 'MongoDB (with Mongoose)', value: 'mongodb' },
                    { name: 'PostgreSQL (with Prisma/PG)', value: 'postgresql' },
                ],
                default: options.database || 'mongodb',
            },
        ]);
        answers.database = database;
    } else {
        answers.database = options.database || 'mongodb';
    }


    if (answers.database === 'mongodb') {
        answers.orm = 'mongoose';
    } else if (answers.database === 'postgresql') {
        if (!options.yes) {
            const { orm } = await inquirer.prompt<{ orm: 'prisma' | 'pg' }>([
                {
                    type: 'list',
                    name: 'orm',
                    message: 'Select ORM/Driver for PostgreSQL:',
                    choices: [
                        { name: 'Prisma (ORM)', value: 'prisma' },
                        { name: 'node-postgres (pg)', value: 'pg' },
                    ],
                    default: options.orm || 'prisma',
                },
            ]);
            answers.orm = orm;
        } else {
            answers.orm = options.orm as 'prisma' | 'pg' || 'prisma';
        }
    } else {
        answers.orm = 'none';
    }


    if (!options.yes && (answers.mode === 'full' || answers.mode === 'backend')) {
        const { auth } = await inquirer.prompt<{ auth: AuthType }>([
            {
                type: 'list',
                name: 'auth',
                message: 'Which authentication type would you like?',
                choices: [
                    { name: 'JWT (stateless tokens)', value: 'jwt' },
                    { name: 'Session (server-side)', value: 'session' },
                    { name: 'Passport (Local + Google + GitHub)', value: 'passport' },
                    { name: 'None', value: 'none' },
                ],
                default: options.auth || 'jwt',
            },
        ]);
        answers.auth = auth;
    } else {
        answers.auth = options.auth || 'jwt';
    }


    if (!options.yes) {
        const { docker } = await inquirer.prompt<{ docker: boolean }>([
            {
                type: 'confirm',
                name: 'docker',
                message: 'Include Docker configuration?',
                default: options.docker !== undefined ? options.docker : true,
            },
        ]);
        answers.docker = docker;
    } else {
        answers.docker = options.docker ?? true;
    }


    if (!options.yes && (answers.mode === 'full' || answers.mode === 'backend')) {
        const { payment } = await inquirer.prompt<{ payment: PaymentProvider }>([
            {
                type: 'list',
                name: 'payment',
                message: 'Include payment provider integration?',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'Stripe', value: 'stripe' },
                    { name: 'Paystack', value: 'paystack' },
                    { name: 'Mock Adapter (for development)', value: 'mock' },
                ],
                default: options.payment || 'none',
            },
        ]);
        answers.payment = payment;
    } else {
        answers.payment = options.payment || 'none';
    }


    if (!options.yes && (answers.mode === 'full' || answers.mode === 'frontend')) {
        const { tailwind } = await inquirer.prompt<{ tailwind: boolean }>([
            {
                type: 'confirm',
                name: 'tailwind',
                message: 'Include Tailwind CSS v4?',
                default: options.tailwind !== undefined ? options.tailwind : true,
            },
        ]);
        answers.tailwind = tailwind;
    } else {
        answers.tailwind = options.tailwind ?? true;
    }


    if (!options.yes) {
        const { git } = await inquirer.prompt<{ git: boolean }>([
            {
                type: 'confirm',
                name: 'git',
                message: 'Initialize a git repository?',
                default: options.git !== undefined ? options.git : true,
            },
        ]);
        answers.git = git;
    } else {
        answers.git = options.git ?? true;
    }


    if (!options.yes) {
        const { cicd } = await inquirer.prompt<{ cicd: CicdProvider }>([
            {
                type: 'list',
                name: 'cicd',
                message: 'Which CI/CD provider would you like to use?',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'GitHub Actions', value: 'github' },
                ],
                default: options.cicd || 'none',
            },
        ]);
        answers.cicd = cicd;
    } else {
        answers.cicd = options.cicd ?? 'none';
    }


    if (!options.yes) {
        const { install } = await inquirer.prompt<{ install: boolean }>([
            {
                type: 'confirm',
                name: 'install',
                message: 'Install dependencies after generation?',
                default: options.install !== undefined ? options.install : true,
            },
        ]);
        answers.install = install;
    } else {
        answers.install = options.install ?? true;
    }

    return answers as ProjectConfig;
}

/**
 * Display the configuration summary to the user
 */
export function displayConfigSummary(config: ProjectConfig): void {
    logger.title('Project Configuration');
    logger.highlight('Project Name', config.projectName);
    logger.highlight('Mode', config.mode);
    logger.highlight('Language', config.language);
    logger.highlight('Module System', config.moduleSystem);

    if (config.mode === 'full' || config.mode === 'frontend') {
        logger.highlight('Frontend', config.frontend);
        logger.highlight('State Management', config.state);
        logger.highlight('Tailwind CSS', config.tailwind ? 'Yes (v4)' : 'No');
    }

    if (config.mode === 'full' || config.mode === 'backend') {
        logger.highlight('Database', config.database);
        if (config.database === 'mongodb') {
            logger.highlight('ORM', 'Mongoose');
        } else if (config.database === 'postgresql') {
            logger.highlight('ORM/Driver', config.orm || 'prisma');
        }
        logger.highlight('Authentication', config.auth);
        logger.highlight('Payment', config.payment);
    }

    logger.highlight('Docker', config.docker ? 'Yes' : 'No');
    logger.highlight('Git', config.git ? 'Yes' : 'No');
    logger.highlight('CI/CD', config.cicd);
    logger.highlight('Install Dependencies', config.install ? 'Yes' : 'No');
    logger.newLine();
}

/**
 * Confirm with user before proceeding
 */
export async function confirmGeneration(): Promise<boolean> {
    const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
        {
            type: 'confirm',
            name: 'confirmed',
            message: 'Proceed with project generation?',
            default: true,
        },
    ]);

    return confirmed;
}
