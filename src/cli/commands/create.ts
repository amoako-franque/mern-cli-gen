import { execa } from 'execa';
import { ProjectGenerator } from '../../generators/index.js';
import type { CLIOptions, ProjectConfig } from '../../types/index.js';
import { directoryExists, getCwd, joinPath } from '../../utils/fileUtils.js';
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
 * Execute the create command
 */
export async function createCommand(
    projectName: string,
    options: CLIOptions
): Promise<void> {
    logger.banner();

    // Check Node.js version
    checkNodeVersion();


    const nameValidation = validateProjectName(projectName);
    if (!nameValidation.valid) {
        logger.error(`Invalid project name: ${projectName}`);
        nameValidation.errors.forEach((err) => logger.error(`  - ${err}`));
        process.exit(1);
    }

    if (nameValidation.warnings.length > 0) {
        nameValidation.warnings.forEach((warn) => logger.warn(`  - ${warn}`));
    }


    const projectPath = joinPath(getCwd(), projectName);
    if (await directoryExists(projectPath)) {
        logger.error(`Directory "${projectName}" already exists`);
        process.exit(1);
    }


    const optionsValidation = validateOptions(options);
    if (!optionsValidation.valid) {
        optionsValidation.errors.forEach((err) => logger.error(err));
        process.exit(1);
    }

    optionsValidation.warnings.forEach((warn) => logger.warn(warn));


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

    const generator = new ProjectGenerator(config);
    const result = await generator.generate();

    if (!result.success) {
        logger.error('Failed to generate project');
        logger.error(`Project: ${config.projectName}`);
        logger.error(`Mode: ${config.mode}`);
        logger.error(`Path: ${result.projectPath}`);
        logger.newLine();
        logger.error('Errors:');
        result.errors.forEach((err: string) => logger.error(`  - ${err}`));
        logger.newLine();
        logger.error(`Partially created ${result.createdFiles.length} files`);
        logger.error(`Partially created ${result.createdDirectories.length} directories`);
        logger.newLine();
        logger.info('Tip: Check the error messages above and verify your configuration.');
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
        await installDependencies(result.projectPath, config);
    }


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
