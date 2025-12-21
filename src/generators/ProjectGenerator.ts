import type { GeneratorResult, ProjectConfig, TemplateContext } from '../types/index.js';
import {
    absolutePath,
    createDirectory,
    directoryExists,
    getCwd,
    joinPath,
} from '../utils/fileUtils.js';
import { logger, withSpinner } from '../utils/logger.js';
import {
    createTemplateContext,
    getCicdTemplatePath,
    getDockerTemplatePath,
    getRootTemplatePath,
    processTemplateDirectory,
} from '../utils/templateUtils.js';
import { ClientGenerator } from './ClientGenerator.js';
import { ServerGenerator } from './ServerGenerator.js';

/**
 * Main project generator that orchestrates the generation process
 */
export class ProjectGenerator {
    private config: ProjectConfig;
    private context: TemplateContext;
    private projectPath: string;
    private createdFiles: string[] = [];
    private createdDirectories: string[] = [];
    private errors: string[] = [];

    constructor(config: ProjectConfig) {
        this.config = config;
        this.context = createTemplateContext(config);
        this.projectPath = absolutePath(joinPath(getCwd(), config.projectName));
    }

    /**
     * Run the full generation process
     */
    async generate(): Promise<GeneratorResult> {
        try {

            if (await directoryExists(this.projectPath)) {
                this.errors.push(`Directory "${this.config.projectName}" already exists`);
                return this.getResult(false);
            }


            await withSpinner(
                'Creating project directory',
                async () => {
                    await createDirectory(this.projectPath);
                    this.createdDirectories.push(this.config.projectName);
                }
            );


            switch (this.config.mode) {
                case 'full':
                    await this.generateFullStack();
                    break;
                case 'frontend':
                    await this.generateFrontendOnly();
                    break;
                case 'backend':
                    await this.generateBackendOnly();
                    break;
            }


            await this.generateRootFiles();


            await this.generateCicdFiles();

            return this.getResult(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.errors.push(message);
            logger.error(`Generation failed: ${message}`);
            return this.getResult(false);
        }
    }

    /**
     * Generate full stack project (client + server)
     */
    private async generateFullStack(): Promise<void> {

        const clientGenerator = new ClientGenerator(this.config, this.context, this.projectPath);
        const clientResult = await clientGenerator.generate();
        this.createdFiles.push(...clientResult.createdFiles.map((f) => `client/${f}`));
        this.createdDirectories.push('client');


        const serverGenerator = new ServerGenerator(this.config, this.context, this.projectPath);
        const serverResult = await serverGenerator.generate();
        this.createdFiles.push(...serverResult.createdFiles.map((f) => `server/${f}`));
        this.createdDirectories.push('server');


        await this.generateSharedDirectory();
    }

    /**
     * Generate frontend only project
     */
    private async generateFrontendOnly(): Promise<void> {
        const clientGenerator = new ClientGenerator(this.config, this.context, this.projectPath);
        const result = await clientGenerator.generate();
        this.createdFiles.push(...result.createdFiles);
    }

    /**
     * Generate backend only project
     */
    private async generateBackendOnly(): Promise<void> {
        const serverGenerator = new ServerGenerator(this.config, this.context, this.projectPath);
        const result = await serverGenerator.generate();
        this.createdFiles.push(...result.createdFiles);
    }

    /**
     * Generate shared directory for full stack projects
     */
    private async generateSharedDirectory(): Promise<void> {
        await withSpinner(
            'Creating shared directory',
            async () => {
                const sharedPath = joinPath(this.projectPath, 'shared');
                await createDirectory(sharedPath);
                await createDirectory(joinPath(sharedPath, 'types'));
                await createDirectory(joinPath(sharedPath, 'utils'));


                const ext = this.context.scriptExt;
                const indexContent = this.context.isES6
                    ? `// Shared types and utilities\nexport {};\n`
                    : `// Shared types and utilities\nmodule.exports = {};\n`;

                const indexPath = joinPath(sharedPath, `index.${ext}`);
                const fs = await import('fs-extra');
                await fs.default.writeFile(indexPath, indexContent);

                this.createdFiles.push(`shared/index.${ext}`);
                this.createdDirectories.push('shared');
            }
        );
    }

    /**
     * Generate root-level files (package.json, README, etc.)
     */
    private async generateRootFiles(): Promise<void> {
        await withSpinner(
            'Generating root files',
            async () => {
                const rootTemplatePath = getRootTemplatePath();
                const files = await processTemplateDirectory(
                    rootTemplatePath,
                    this.projectPath,
                    this.context
                );
                this.createdFiles.push(...files);


                if (this.config.docker) {
                    const dockerTemplatePath = getDockerTemplatePath('root');
                    if (await directoryExists(dockerTemplatePath)) {
                        const dockerFiles = await processTemplateDirectory(
                            dockerTemplatePath,
                            this.projectPath,
                            this.context
                        );
                        this.createdFiles.push(...dockerFiles);
                    }
                }
            }
        );
    }

    /**
     * Generate CI/CD configuration files
     */
    private async generateCicdFiles(): Promise<void> {
        if (this.config.cicd === 'none') return;

        await withSpinner(
            `Generating ${this.config.cicd} CI/CD configuration`,
            async () => {
                const cicdTemplatePath = getCicdTemplatePath(this.config.cicd);
                if (await directoryExists(cicdTemplatePath)) {
                    const files = await processTemplateDirectory(
                        cicdTemplatePath,
                        this.projectPath,
                        this.context
                    );
                    this.createdFiles.push(...files);
                }
            }
        );
    }

    /**
     * Get the generation result
     */
    private getResult(success: boolean): GeneratorResult {
        return {
            success,
            projectPath: this.projectPath,
            createdFiles: this.createdFiles,
            createdDirectories: this.createdDirectories,
            errors: this.errors,
        };
    }
}
