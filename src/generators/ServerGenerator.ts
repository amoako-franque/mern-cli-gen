import type { ProjectConfig, TemplateContext } from '../types/index.js';
import { createDirectory, directoryExists, joinPath } from '../utils/fileUtils.js';
import { withSpinner } from '../utils/logger.js';
import {
    getBackendTemplatePath,
    getCommonBackendTemplatePath,
    getDockerTemplatePath,
    processTemplateDirectory,
} from '../utils/templateUtils.js';

interface GenerateResult {
    createdFiles: string[];
}

/**
 * Generator for backend (server) code
 */
export class ServerGenerator {
    private config: ProjectConfig;
    private context: TemplateContext;
    private outputPath: string;

    constructor(config: ProjectConfig, context: TemplateContext, projectPath: string) {
        this.config = config;
        this.context = context;

        // For full stack, output to server/; for backend-only, output to root
        this.outputPath = config.mode === 'full'
            ? joinPath(projectPath, 'server')
            : projectPath;
    }

    /**
     * Generate the backend code
     */
    async generate(): Promise<GenerateResult> {
        const createdFiles: string[] = [];

        await withSpinner(
            'Generating Express backend',
            async () => {
                // Create output directory
                await createDirectory(this.outputPath);

                // Define filter for files
                const serverFilter = (relativePath: string): boolean => {
                    // Payment files
                    if (this.config.payment === 'none') {
                        if (relativePath.includes('controllers/paymentController')) return false;
                        if (relativePath.includes('routes/payment')) return false;
                        if (relativePath.includes('services/payment')) return false;
                    }

                    // Auth files
                    if (this.config.auth === 'none') {
                        if (relativePath.includes('controllers/authController')) return false;
                        if (relativePath.includes('routes/auth')) return false;
                        if (relativePath.includes('middleware/auth')) return false;
                        if (relativePath.includes('config/passport')) return false;
                        if (relativePath.includes('models/User')) return false;
                        if (relativePath.includes('utils/authUtils')) return false;
                    }

                    return true;
                };

                // Check if variant-specific templates exist
                const variantPath = getBackendTemplatePath(this.config);
                if (await directoryExists(variantPath)) {
                    const files = await processTemplateDirectory(
                        variantPath,
                        this.outputPath,
                        this.context,
                        serverFilter
                    );
                    createdFiles.push(...files);
                } else {
                    const availableTemplates = [
                        'express/ts-es6',
                        'express/js-es6',
                        'express/js-vanilla',
                    ].join(', ');

                    throw new Error(
                        `Template not found for backend configuration:\n` +
                        `  Language: ${this.config.language}\n` +
                        `  Module System: ${this.config.moduleSystem}\n` +
                        `  Expected path: ${variantPath}\n\n` +
                        `Available template combinations: ${availableTemplates}\n` +
                        `Please check your configuration or ensure the template exists.`
                    );
                }

                // Process common templates with specific sub-logic
                const commonPath = getCommonBackendTemplatePath();
                if (await directoryExists(commonPath)) {
                    const commonFilter = (relativePath: string): boolean => {
                        // Only include prisma if database is postgresql
                        if (relativePath.startsWith('prisma') && this.config.database !== 'postgresql') {
                            return false;
                        }
                        return true;
                    };

                    const files = await processTemplateDirectory(
                        commonPath,
                        this.outputPath,
                        this.context,
                        commonFilter
                    );
                    createdFiles.push(...files);
                }

                // Process Docker templates
                if (this.config.docker) {
                    const dockerPath = getDockerTemplatePath('server');
                    if (await directoryExists(dockerPath)) {
                        const files = await processTemplateDirectory(
                            dockerPath,
                            this.outputPath,
                            this.context
                        );
                        createdFiles.push(...files);
                    }
                }
            }
        );

        return { createdFiles };
    }
}
