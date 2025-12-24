import { execa } from 'execa';
import inquirer from 'inquirer';
import { ProjectGenerator } from '../../generators/index.js';
import type { CLIOptions, ProjectConfig } from '../../types/index.js';
import { copyFile, directoryExists, fileExists, getCwd, joinPath } from '../../utils/fileUtils.js';
import { logger, withSpinner } from '../../utils/logger.js';
import { validateOptions, validateProjectName } from '../../utils/validation.js';
import { confirmGeneration, displayConfigSummary, runProjectPrompts } from '../prompts/index.js';

/**
 * Check Node.js version compatibility
 */
function checkNodeVersion(): void {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
    if (majorVersion < 18) {
        logger.error(`Node.js 18.0.0 or higher is required. Current version: ${nodeVersion}`);
        logger.error('Please upgrade Node.js: https://nodejs.org/');
        process.exit(1);
    }
}

/**
 * Prompt for project name if not provided
 */
async function promptProjectName(): Promise<string> {
    const { projectName } = await inquirer.prompt<{ projectName: string }>([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your project name?',
            validate: (input: string) => {
                const validation = validateProjectName(input);
                if (!validation.valid) {
                    return validation.errors.join('\n');
                }
                return true;
            },
        },
    ]);
    return projectName;
}

/**
 * Get helpful error suggestions based on error message
 */
function getErrorSuggestions(errorMessage: string): string[] {
    const suggestions: string[] = [];
    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes('template') || lowerError.includes('not found')) {
        suggestions.push('Missing template files - check package installation');
        suggestions.push('Try reinstalling: npm install -g mern-cli-gen@latest');
    }

    if (lowerError.includes('permission') || lowerError.includes('eacces') || lowerError.includes('eperm')) {
        suggestions.push('Permission error - check directory permissions');
        suggestions.push('Try running with appropriate permissions or choose a different location');
    }

    if (lowerError.includes('space') || lowerError.includes('enospc') || lowerError.includes('disk')) {
        suggestions.push('Insufficient disk space');
        suggestions.push('Free up disk space and try again');
    }

    if (lowerError.includes('exists') || lowerError.includes('already')) {
        suggestions.push('Directory already exists');
        suggestions.push('Choose a different project name or remove the existing directory');
    }

    if (lowerError.includes('npm') || lowerError.includes('install') || lowerError.includes('dependency')) {
        suggestions.push('Dependency installation failed');
        suggestions.push('Check your internet connection and npm configuration');
        suggestions.push('You can skip auto-install with --no-install and install manually later');
    }

    if (suggestions.length === 0) {
        suggestions.push('Check the error message above for details');
        suggestions.push('Verify your configuration and try again');
    }

    return suggestions;
}

/**
 * Execute the create command
 */
export async function createCommand(
    projectName: string | undefined,
    options: CLIOptions
): Promise<void> {
    logger.banner();

    // Check Node.js version
    checkNodeVersion();

    // Prompt for project name if not provided
    let finalProjectName = projectName;
    if (!finalProjectName) {
        try {
            finalProjectName = await promptProjectName();
        } catch (error) {
            // User cancelled (Ctrl+C)
            logger.newLine();
            logger.info('Operation cancelled');
            process.exit(0);
        }
    }

    const nameValidation = validateProjectName(finalProjectName);
    if (!nameValidation.valid) {
        logger.error(`Invalid project name: ${finalProjectName}`);
        nameValidation.errors.forEach((err) => logger.error(`  - ${err}`));
        process.exit(1);
    }

    if (nameValidation.warnings.length > 0) {
        nameValidation.warnings.forEach((warn) => logger.warn(`  - ${warn}`));
    }

    const projectPath = joinPath(getCwd(), finalProjectName);
    if (await directoryExists(projectPath)) {
        logger.error(`Directory "${finalProjectName}" already exists`);
        process.exit(1);
    }


    const optionsValidation = validateOptions(options);
    if (!optionsValidation.valid) {
        optionsValidation.errors.forEach((err) => logger.error(err));
        process.exit(1);
    }

    optionsValidation.warnings.forEach((warn) => logger.warn(warn));

    let config: ProjectConfig;
    let generator: ProjectGenerator | null = null;

    if (options.dryRun) {
        logger.info('Dry run mode - no files will be created');
    }

    try {
        config = await runProjectPrompts(finalProjectName, options);
    } catch (error) {
        // User cancelled (Ctrl+C)
        logger.newLine();
        logger.info('Operation cancelled');
        process.exit(0);
    }


    displayConfigSummary(config);


    if (!options.dryRun) {
        const confirmed = await confirmGeneration();
        if (!confirmed) {
            logger.info('Operation cancelled');
            process.exit(0);
        }
    }


    if (options.dryRun) {
        logger.title('Dry Run Summary');
        logger.info('The following would be created:');
        logger.newLine();

        if (config.mode === 'full' || config.mode === 'frontend') {
            logger.highlight('Frontend', `${config.frontend} with ${config.language}`);
        }
        if (config.mode === 'full' || config.mode === 'backend') {
            logger.highlight('Backend', `Express with ${config.database}`);
            logger.highlight('Authentication', config.auth);
        }
        if (config.docker) {
            logger.highlight('Docker', 'Dockerfile + docker-compose.yml');
        }
        if (config.tailwind && (config.mode === 'full' || config.mode === 'frontend')) {
            logger.highlight('CSS', 'Tailwind CSS v4');
        }

        logger.newLine();
        logger.info('No files were created (dry run)');
        return;
    }


    logger.newLine();
    logger.title('Generating Project');

    generator = new ProjectGenerator(config);
    let result;

    try {
        result = await generator.generate();
    } catch (error) {
        // Handle unexpected errors during generation
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Unexpected error during generation');
        logger.error(errorMessage);

        // Attempt cleanup
        if (generator) {
            await generator.cleanup();
        }

        logger.newLine();
        logger.warn('⚠️  Cleaning up partially created project...');
        const suggestions = getErrorSuggestions(errorMessage);
        logger.newLine();
        logger.info('💡 Common issues:');
        suggestions.forEach((suggestion) => logger.info(`   - ${suggestion}`));
        process.exit(1);
    }

    if (!result.success) {
        logger.error('❌ Failed to generate project');
        logger.error(`Project: ${config.projectName}`);
        logger.error(`Mode: ${config.mode}`);
        logger.error(`Path: ${result.projectPath}`);
        logger.newLine();
        logger.error('Errors:');
        result.errors.forEach((err: string) => logger.error(`  - ${err}`));
        logger.newLine();

        // Perform cleanup
        logger.warn('⚠️  Cleaning up partially created project...');
        try {
            await generator.cleanup();
            logger.success(`✓ Removed ${result.createdFiles.length} files`);
            logger.success(`✓ Removed ${result.createdDirectories.length} directories`);
        } catch (cleanupError) {
            logger.error('Failed to clean up all files. Please manually remove:');
            logger.error(`  ${result.projectPath}`);
        }

        logger.newLine();
        logger.info('💡 Tip: Check the error messages above and verify your configuration.');
        const suggestions = getErrorSuggestions(result.errors.join(' '));
        logger.newLine();
        logger.info('Common issues:');
        suggestions.forEach((suggestion) => logger.info(`   - ${suggestion}`));
        process.exit(1);
    }


    if (config.git) {
        await withSpinner('Initializing git repository', async () => {
            await execa('git', ['init'], { cwd: result.projectPath });
            await execa('git', ['add', '.'], { cwd: result.projectPath });
            await execa('git', ['commit', '-m', 'Initial commit from mern-cli-gen'], {
                cwd: result.projectPath,
            });
        });
    }


    if (config.install) {
        try {
            await installDependencies(result.projectPath, config);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Failed to install dependencies');
            logger.error(errorMessage);
            logger.newLine();
            logger.warn('⚠️  Project structure was created successfully, but dependency installation failed.');
            logger.info('You can install dependencies manually:');
            if (config.mode === 'full') {
                logger.info('  cd ' + config.projectName);
                logger.info('  npm install');
                logger.info('  cd client && npm install');
                logger.info('  cd ../server && npm install');
            } else {
                logger.info('  cd ' + config.projectName);
                logger.info('  npm install');
            }
            logger.newLine();
            logger.info('Or skip auto-install next time with --no-install flag');
            // Don't cleanup on install failure - project was created successfully
        }
    }

    // Auto-create .env file from .env.example
    const envCreated = await createEnvFile(result.projectPath, config);

    logger.complete(config, result.projectPath, envCreated);
}

/**
 * Create .env file from .env.example if it doesn't exist
 */
async function createEnvFile(projectPath: string, config: ProjectConfig): Promise<boolean> {
    // Only create .env for backend or full stack projects
    if (config.mode === 'frontend') {
        return false;
    }

    const serverPath = config.mode === 'full'
        ? joinPath(projectPath, 'server')
        : projectPath;

    const envExamplePath = joinPath(serverPath, '.env.example');
    const envPath = joinPath(serverPath, '.env');

    // Check if .env.example exists
    if (!(await fileExists(envExamplePath))) {
        return false;
    }

    // Check if .env already exists
    if (await fileExists(envPath)) {
        return false;
    }

    // Copy .env.example to .env
    try {
        await copyFile(envExamplePath, envPath);
        return true;
    } catch (error) {
        logger.warn('Failed to create .env file automatically');
        return false;
    }
}

/**
 * Install dependencies for the generated project
 */
async function installDependencies(
    projectPath: string,
    config: ProjectConfig
): Promise<void> {
    const mode = config.mode;

    if (mode === 'full') {
        await withSpinner('Installing root dependencies', async () => {
            await execa('npm', ['install'], { cwd: projectPath });
        });

        await withSpinner('Installing client dependencies', async () => {
            await execa('npm', ['install'], { cwd: joinPath(projectPath, 'client') });
        });

        await withSpinner('Installing server dependencies', async () => {
            await execa('npm', ['install'], { cwd: joinPath(projectPath, 'server') });
        });
    } else {
        // Single package install
        await withSpinner('Installing dependencies', async () => {
            await execa('npm', ['install'], { cwd: projectPath });
        });
    }
}
