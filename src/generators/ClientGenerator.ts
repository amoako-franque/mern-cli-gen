import type { ProjectConfig, TemplateContext } from '../types/index.js';
import { joinPath, directoryExists, createDirectory } from '../utils/fileUtils.js';
import {
  getFrontendTemplatePath,
  getCommonFrontendTemplatePath,
  getDockerTemplatePath,
  processTemplateDirectory,
} from '../utils/templateUtils.js';
import { withSpinner } from '../utils/logger.js';

interface GenerateResult {
  createdFiles: string[];
}

/**
 * Generator for frontend (client) code
 */
export class ClientGenerator {
  private config: ProjectConfig;
  private context: TemplateContext;
  private outputPath: string;

  constructor(config: ProjectConfig, context: TemplateContext, projectPath: string) {
    this.config = config;
    this.context = context;

    // For full stack, output to client/; for frontend-only, output to root
    this.outputPath = config.mode === 'full'
      ? joinPath(projectPath, 'client')
      : projectPath;
  }

  /**
   * Generate the frontend code
   */
  async generate(): Promise<GenerateResult> {
    const createdFiles: string[] = [];

    await withSpinner(
      `Generating ${this.config.frontend} frontend`,
      async () => {
        // Create output directory
        await createDirectory(this.outputPath);

        // Check if variant-specific templates exist
        const variantPath = getFrontendTemplatePath(this.config);

        if (await directoryExists(variantPath)) {
          // Define filter for files based on state management
          const clientFilter = (relativePath: string): boolean => {
            // Exclude context directory if state management is not 'context'
            if (this.config.state !== 'context' && relativePath.startsWith('context/')) {
              return false;
            }
            // Exclude store directory if state management is 'context' or 'none'
            if ((this.config.state === 'context' || this.config.state === 'none') && relativePath.startsWith('store/')) {
              return false;
            }
            return true;
          };

          const files = await processTemplateDirectory(
            variantPath,
            this.outputPath,
            this.context,
            clientFilter
          );
          createdFiles.push(...files);
        } else {
          // Provide helpful error message with available options
          const availableTemplates = [
            'vite/ts-es6',
            'vite/js-es6',
            'vite/js-vanilla',
            'nextjs/ts-es6',
          ].join(', ');

          throw new Error(
            `Template not found for frontend configuration:\n` +
            `  Frontend: ${this.config.frontend}\n` +
            `  Language: ${this.config.language}\n` +
            `  Module System: ${this.config.moduleSystem}\n` +
            `  Expected path: ${variantPath}\n\n` +
            `Available template combinations: ${availableTemplates}\n` +
            `Please check your configuration or ensure the template exists.`
          );
        }

        // Process common templates
        const commonPath = getCommonFrontendTemplatePath();
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
          const dockerPath = getDockerTemplatePath('client');
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

