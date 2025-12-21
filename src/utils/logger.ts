import chalk from 'chalk';
import ora, { type Ora } from 'ora';

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
    complete: (projectName: string, projectPath: string): void => {
        console.log();
        console.log(chalk.green.bold('  🎉 Project created successfully!'));
        console.log();
        console.log(chalk.white('  Next steps to get started:'));
        console.log();
        console.log(chalk.cyan(`    1. cd ${projectName}`));
        console.log(chalk.cyan('    2. cp .env.example .env'));
        console.log(chalk.cyan('    3. npm run dev'));
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
