import type { CLIOptions, ProjectConfig } from '../../types/index.js';
import { validateProjectName, validateOptions } from '../../utils/validation.js';
import { directoryExists, getCwd, joinPath } from '../../utils/fileUtils.js';
import { logger, withSpinner } from '../../utils/logger.js';
import { runProjectPrompts, displayConfigSummary, confirmGeneration } from '../prompts/index.js';
import { ProjectGenerator } from '../../generators/index.js';
import { execa } from 'execa';

/**
 * Execute the create command
 */
export async function createCommand(
    projectName: string,
    options: CLIOptions
): Promise<void> {
    logger.banner();

    // Validate project name
    const nameValidation = validateProjectName(projectName);
    if (!nameValidation.valid) {
        logger.error(`Invalid project name: ${projectName}`);
        nameValidation.errors.forEach((err) => logger.error(`  - ${err}`));
        process.exit(1);
    }

    if (nameValidation.warnings.length > 0) {
        nameValidation.warnings.forEach((warn) => logger.warn(`  - ${warn}`));
    }

    // Check if directory exists
    const projectPath = joinPath(getCwd(), projectName);
    if (await directoryExists(projectPath)) {
        logger.error(`Directory "${projectName}" already exists`);
        process.exit(1);
    }

    // Validate CLI options
    const optionsValidation = validateOptions(options);
    if (!optionsValidation.valid) {
        optionsValidation.errors.forEach((err) => logger.error(err));
        process.exit(1);
    }

    optionsValidation.warnings.forEach((warn) => logger.warn(warn));

    // Run interactive prompts (if needed)
    let config: ProjectConfig;

    if (options.dryRun) {
        logger.info('Dry run mode - no files will be created');
    }

    try {
        config = await runProjectPrompts(projectName, options);
    } catch (error) {
        // User cancelled (Ctrl+C)
        logger.newLine();
        logger.info('Operation cancelled');
        process.exit(0);
    }

    // Display summary
    displayConfigSummary(config);

    // Confirm generation
    if (!options.dryRun) {
        const confirmed = await confirmGeneration();
        if (!confirmed) {
            logger.info('Operation cancelled');
            process.exit(0);
        }
    }

    // Dry run - just show what would be created
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

    // Generate project
    logger.newLine();
    logger.title('Generating Project');

    const generator = new ProjectGenerator(config);
    const result = await generator.generate();

    if (!result.success) {
        logger.error('Failed to generate project');
        result.errors.forEach((err: string) => logger.error(`  - ${err}`));
        process.exit(1);
    }

    // Initialize git
    if (config.git) {
        await withSpinner('Initializing git repository', async () => {
            await execa('git', ['init'], { cwd: result.projectPath });
            await execa('git', ['add', '.'], { cwd: result.projectPath });
            await execa('git', ['commit', '-m', 'Initial commit from mern-cli-gen'], {
                cwd: result.projectPath,
            });
        });
    }

    // Install dependencies
    if (config.install) {
        await installDependencies(result.projectPath, config);
    }

    // Show completion message
    logger.complete(config.projectName, result.projectPath);
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
        // Install root dependencies
        await withSpinner('Installing root dependencies', async () => {
            await execa('npm', ['install'], { cwd: projectPath });
        });

        // Install client dependencies
        await withSpinner('Installing client dependencies', async () => {
            await execa('npm', ['install'], { cwd: joinPath(projectPath, 'client') });
        });

        // Install server dependencies
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
