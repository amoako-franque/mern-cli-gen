import type { ProjectConfig, TemplateContext } from '../types/index.js';
import { joinPath, directoryExists, createDirectory } from '../utils/fileUtils.js';
import {
    getBackendTemplatePath,
    getCommonBackendTemplatePath,
    getDockerTemplatePath,
    processTemplateDirectory,
} from '../utils/templateUtils.js';
import { withSpinner } from '../utils/logger.js';

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

                // Check if variant-specific templates exist
                const variantPath = getBackendTemplatePath(this.config);
                if (await directoryExists(variantPath)) {
                    const files = await processTemplateDirectory(
                        variantPath,
                        this.outputPath,
                        this.context
                    );
                    createdFiles.push(...files);
                } else {
                    // Fallback or Error
                    // Since we've only implemented TS-ES6 templates in this refactor, fail for others if not found.
                    throw new Error(`Template not found for backend/${this.config.language}-${this.config.moduleSystem}`);
                }

                // Process common templates
                const commonPath = getCommonBackendTemplatePath();
                if (await directoryExists(commonPath)) {
                    const files = await processTemplateDirectory(
                        commonPath,
                        this.outputPath,
                        this.context
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
