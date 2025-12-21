import ejs from 'ejs';
import path from 'path';
import { readFile, getTemplatesDir, getAllFiles, writeFile } from './fileUtils.js';
import type { ProjectConfig, TemplateContext } from '../types/index.js';

/**
 * Create a template context from project config
 */
export function createTemplateContext(config: ProjectConfig): TemplateContext {
    const isTypeScript = config.language === 'typescript';
    const isES6 = config.moduleSystem === 'es6';

    return {
        ...config,
        orm: config.orm || (config.database === 'mongodb' ? 'mongoose' : 'none'),
        projectNameCapitalized: capitalizeWords(config.projectName),
        isTypeScript,
        isES6,
        scriptExt: isTypeScript ? 'ts' : 'js',
        reactExt: isTypeScript ? 'tsx' : 'jsx',
    };
}

/**
 * Capitalize words in a string (for display names)
 */
function capitalizeWords(str: string): string {
    return str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Render an EJS template file with the given context
 */
export async function renderTemplate(templatePath: string, context: TemplateContext): Promise<string> {
    const templateContent = await readFile(templatePath);
    return ejs.render(templateContent, context, {
        filename: templatePath, // Enable includes
    });
}

/**
 * Get the template variant directory path based on config
 */
export function getVariantPath(config: ProjectConfig): string {
    const { language, moduleSystem } = config;

    if (language === 'typescript') {
        return 'ts-es6';
    }

    return moduleSystem === 'es6' ? 'js-es6' : 'js-vanilla';
}

/**
 * Get the frontend template base path
 */
export function getFrontendTemplatePath(config: ProjectConfig): string {
    const templatesDir = getTemplatesDir();
    const variant = getVariantPath(config);
    return path.join(templatesDir, 'client', config.frontend, variant);
}

/**
 * Get the backend template base path
 */
export function getBackendTemplatePath(config: ProjectConfig): string {
    const templatesDir = getTemplatesDir();
    const variant = getVariantPath(config);
    return path.join(templatesDir, 'server', 'express', variant);
}

/**
 * Get common frontend template path
 */
export function getCommonFrontendTemplatePath(): string {
    return path.join(getTemplatesDir(), 'client', 'common');
}

/**
 * Get common backend template path
 */
export function getCommonBackendTemplatePath(): string {
    return path.join(getTemplatesDir(), 'server', 'common');
}

/**
 * Get root template path
 */
export function getRootTemplatePath(): string {
    return path.join(getTemplatesDir(), 'root');
}

/**
 * Get Docker template path
 */
export function getDockerTemplatePath(type: 'root' | 'client' | 'server'): string {
    return path.join(getTemplatesDir(), 'docker', type);
}

/**
 * Get CI/CD template path
 */
export function getCicdTemplatePath(provider: string): string {
    return path.join(getTemplatesDir(), 'cicd', provider);
}

/**
 * Process a template directory and write to output
 */
export async function processTemplateDirectory(
    templateDir: string,
    outputDir: string,
    context: TemplateContext
): Promise<string[]> {
    const createdFiles: string[] = [];
    const templateFiles = await getAllFiles(templateDir);

    for (const templateFile of templateFiles) {
        // Get relative path from template dir
        const relativePath = path.relative(templateDir, templateFile);

        // Remove .ejs extension from output filename
        const outputFileName = relativePath.replace(/\.ejs$/, '');

        // Build output path
        const outputPath = path.join(outputDir, outputFileName);

        // Check if it's an EJS template or a static file
        if (templateFile.endsWith('.ejs')) {
            const content = await renderTemplate(templateFile, context);
            await writeFile(outputPath, content);
        } else {
            // Copy static files as-is
            const content = await readFile(templateFile);
            await writeFile(outputPath, content);
        }

        createdFiles.push(outputFileName);
    }

    return createdFiles;
}
