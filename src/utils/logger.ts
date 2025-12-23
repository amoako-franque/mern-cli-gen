import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import type { ProjectConfig } from '../types/index.js';

/**
 * Logger utility for styled console output
 */
export const logger = {
    /**
     * Log an info message
     */
    info: (message: string): void => {
        console.log(chalk.blue('ℹ'), message);
    },

    /**
     * Log a success message
     */
    success: (message: string): void => {
        console.log(chalk.green('✔'), message);
    },

    /**
     * Log a warning message
     */
    warn: (message: string): void => {
        console.log(chalk.yellow('⚠'), message);
    },

    /**
     * Log an error message
     */
    error: (message: string): void => {
        console.log(chalk.red('✖'), message);
    },

    /**
     * Log a blank line
     */
    newLine: (): void => {
        console.log();
    },

    /**
     * Log a title/header
     */
    title: (message: string): void => {
        console.log();
        console.log(chalk.bold.cyan(message));
        console.log(chalk.cyan('─'.repeat(message.length)));
    },

    /**
     * Log a step in a process
     */
    step: (step: number, total: number, message: string): void => {
        console.log(chalk.gray(`[${step}/${total}]`), message);
    },

    /**
     * Log a dimmed/secondary message
     */
    dim: (message: string): void => {
        console.log(chalk.dim(message));
    },

    /**
     * Log a highlighted value
     */
    highlight: (label: string, value: string): void => {
        console.log(`  ${chalk.gray(label)}: ${chalk.white(value)}`);
    },

    /**
     * Print the CLI banner
     */
    banner: (): void => {
        const title = 'MERN CLI Generator';
        const width = 39; // Width of the internal part (number of ═)
        const leftPadding = Math.floor((width - title.length) / 2);
        const rightPadding = width - title.length - leftPadding;

        const line = ' '.repeat(leftPadding) + title + ' '.repeat(rightPadding);

        console.log();
        console.log(chalk.bold.magenta(`  ╔${'═'.repeat(width)}╗`));
        console.log(chalk.bold.magenta('  ║') + chalk.bold.white(line) + chalk.bold.magenta('║'));
        console.log(chalk.bold.magenta(`  ╚${'═'.repeat(width)}╝`));
        console.log();
    },

    /**
     * Print success message after project creation
     */
    complete: (config: ProjectConfig, projectPath: string, envCreated: boolean): void => {
        console.log();
        console.log(chalk.green.bold('  🎉 Project created successfully!'));
        console.log();

        // Show project structure
        console.log(chalk.white('  📁 Project Structure:'));
        if (config.mode === 'full') {
            console.log(chalk.dim('    - client/     # React frontend'));
            console.log(chalk.dim('    - server/     # Express backend'));
            console.log(chalk.dim('    - shared/      # Shared types/utils'));
        } else if (config.mode === 'frontend') {
            console.log(chalk.dim('    - src/         # React frontend source'));
        } else {
            console.log(chalk.dim('    - src/         # Express backend source'));
        }
        console.log();

        // Environment setup message
        if (envCreated && (config.mode === 'full' || config.mode === 'backend')) {
            console.log(chalk.green('  ✅ Environment file created at server/.env'));
            console.log(chalk.yellow('  ⚠️  Please update server/.env with your configuration'));
            console.log();
        }

        // Quick Start instructions
        if (config.mode === 'full') {
            console.log(chalk.white('  🚀 Quick Start (Full Stack):'));
            console.log();
            console.log(chalk.cyan(`    1. cd ${config.projectName}`));
            if (!envCreated) {
                console.log(chalk.cyan('    2. cd server && cp .env.example .env'));
                console.log(chalk.cyan('    3. # Edit server/.env with your configuration'));
                console.log(chalk.cyan('    4. cd .. && npm run dev'));
            } else {
                console.log(chalk.cyan('    2. # Edit server/.env with your configuration'));
                console.log(chalk.cyan('    3. npm run dev'));
            }
            console.log();
            console.log(chalk.white('  🔧 Individual Services:'));
            console.log();
            console.log(chalk.dim('  Frontend Only:'));
            console.log(chalk.cyan('    cd client'));
            console.log(chalk.cyan('    npm run dev              # Starts on http://localhost:5173'));
            console.log();
            console.log(chalk.dim('  Backend Only:'));
            console.log(chalk.cyan('    cd server'));
            if (!envCreated) {
                console.log(chalk.cyan('    cp .env.example .env'));
            }
            console.log(chalk.cyan('    # Edit .env with your configuration'));
            console.log(chalk.cyan('    npm run dev              # Starts on http://localhost:51210'));
        } else if (config.mode === 'frontend') {
            console.log(chalk.white('  🚀 Quick Start:'));
            console.log();
            console.log(chalk.cyan(`    1. cd ${config.projectName}`));
            console.log(chalk.cyan('    2. npm run dev              # Starts on http://localhost:5173'));
        } else {
            console.log(chalk.white('  🚀 Quick Start:'));
            console.log();
            console.log(chalk.cyan(`    1. cd ${config.projectName}`));
            if (!envCreated) {
                console.log(chalk.cyan('    2. cp .env.example .env'));
                console.log(chalk.cyan('    3. # Edit .env with your configuration'));
                console.log(chalk.cyan('    4. npm run dev              # Starts on http://localhost:51210'));
            } else {
                console.log(chalk.cyan('    2. # Edit .env with your configuration'));
                console.log(chalk.cyan('    3. npm run dev              # Starts on http://localhost:51210'));
            }
        }

        console.log();
        console.log(chalk.white('  📝 Environment Setup:'));
        if (config.mode === 'full' || config.mode === 'backend') {
            const envPath = config.mode === 'full' ? 'server/.env' : '.env';
            console.log(chalk.dim(`    - Environment file: ${envPath}`));
            if (config.database === 'mongodb') {
                console.log(chalk.dim('    - Update MONGODB_URI with your connection string'));
            } else if (config.database === 'postgresql') {
                console.log(chalk.dim('    - Update DATABASE_URL with your connection string'));
            }
            if (config.auth !== 'none') {
                console.log(chalk.dim('    - Add JWT_SECRET or SESSION_SECRET'));
            }
            if (config.payment !== 'none') {
                console.log(chalk.dim(`    - Add ${config.payment.toUpperCase()}_SECRET_KEY`));
            }
        }
        console.log();
        console.log(chalk.white('  Happy coding! 🚀'));
        console.log();
        console.log(chalk.dim(`  Location: ${projectPath}`));
        console.log();
    },
};

/**
 * Create a spinner for async operations
 */
export function createSpinner(text: string): Ora {
    return ora({
        text,
        color: 'cyan',
        spinner: 'dots',
    });
}

/**
 * Run an async operation with a spinner
 */
export async function withSpinner<T>(
    text: string,
    operation: () => Promise<T>,
    successText?: string
): Promise<T> {
    const spinner = createSpinner(text);
    spinner.start();

    try {
        const result = await operation();
        spinner.succeed(successText || text);
        return result;
    } catch (error) {
        spinner.fail();
        throw error;
    }
}
