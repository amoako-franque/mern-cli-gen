import validateNpmPackageName from 'validate-npm-package-name';
import type { CLIOptions, GenerationMode } from '../types/index.js';

/**
 * Validation result
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Validate a project name according to npm naming rules
 */
export function validateProjectName(name: string): ValidationResult {
    const result = validateNpmPackageName(name);

    return {
        valid: result.validForNewPackages,
        errors: [...(result.errors || [])],
        warnings: [...(result.warnings || [])],
    };
}

/**
 * Validate CLI options for consistency
 */
export function validateOptions(options: CLIOptions): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for conflicting language options
    if (options.typescript && options.javascript) {
        errors.push('Cannot use both --typescript and --javascript');
    }

    // Check for conflicting module system options
    if (options.es6 && options.vanilla) {
        errors.push('Cannot use both --es6 and --vanilla');
    }

    // Vanilla JS only works with JavaScript
    if (options.vanilla && options.typescript) {
        warnings.push('--vanilla is ignored when using TypeScript (ES6 is auto-selected)');
    }

    // Mode-specific option warnings
    const mode: GenerationMode = options.mode || 'full';

    if (mode === 'frontend') {
        if (options.database) {
            warnings.push('--database is ignored in frontend mode');
        }
        if (options.auth) {
            warnings.push('--auth is ignored in frontend mode');
        }
    }

    if (mode === 'backend') {
        if (options.frontend) {
            warnings.push('--frontend is ignored in backend mode');
        }
        if (options.state) {
            warnings.push('--state is ignored in backend mode');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Check if a directory name is safe to use
 */
export function isValidDirectoryName(name: string): boolean {
    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (invalidChars.test(name)) {
        return false;
    }

    // Check for reserved names on Windows
    const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    if (reserved.test(name)) {
        return false;
    }

    // Check for empty or whitespace-only
    if (!name || name.trim().length === 0) {
        return false;
    }

    return true;
}
