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
        let variantPath = getFrontendTemplatePath(this.config);

        // Fallback to ts-es6 if specific variant doesn't exist (since that's our default implementation now)
        if (!(await directoryExists(variantPath))) {
          // Construct path for defaults: templates/client/vite/ts-es6
          // This assumes we are only implementing TS-ES6 for now as the 'master' template
          // In a real scenario we might error out or log a warning, but for Phase 1 refactor this is safe
          // as we just created exactly these templates.
          // However, better logic is: if language is JS, usage might fail or need JS templates.
          // For now, let's rely on the method finding the path, and if not found, we error or ensure templates exist.
          // Given we only made ts-es6 templates, if user asks for JS, we should probably warn or fallback? 
          // For now, let's assume valid paths or error. 
        }

        if (await directoryExists(variantPath)) {
          const files = await processTemplateDirectory(
            variantPath,
            this.outputPath,
            this.context
          );
          createdFiles.push(...files);
        } else {
          // Start of Refactor: If specific template not found (e.g. js-vanilla), 
          // we currently don't have a programmatic fallback anymore. 
          // We should throw an error or handle it.
          // For the purpose of this task (Architectural Improvement), we assume templates exist.
          // If not, we can't generate.
          throw new Error(`Template not found for ${this.config.frontend}/${this.config.language}-${this.config.moduleSystem}`);
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

