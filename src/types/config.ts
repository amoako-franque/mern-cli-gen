/**
 * Project configuration types for MERN CLI Generator
 */

export type GenerationMode = 'full' | 'frontend' | 'backend';
export type Language = 'typescript' | 'javascript';
export type ModuleSystem = 'es6' | 'vanilla';
export type Frontend = 'vite' | 'nextjs';
export type Database = 'mongodb' | 'postgresql';
export type AuthType = 'jwt' | 'session' | 'oauth' | 'passport' | 'none';
export type StateManagement = 'zustand' | 'redux' | 'context' | 'none';
export type PaymentProvider = 'stripe' | 'paystack' | 'mock' | 'none';
export type CicdProvider = 'github' | 'none';

/**
 * Main project configuration interface
 */
export interface ProjectConfig {
    /** Name of the project (used for directory and package.json) */
    projectName: string;

    /** Generation mode: full stack, frontend only, or backend only */
    mode: GenerationMode;

    /** Programming language: TypeScript or JavaScript */
    language: Language;

    /** Module system: ES6 modules or CommonJS (vanilla) */
    moduleSystem: ModuleSystem;

    /** Frontend framework (only for full/frontend modes) */
    frontend: Frontend;

    /** Database choice (only for full/backend modes) */
    database: Database;

    /** ORM/Driver choice */
    orm?: 'mongoose' | 'prisma' | 'pg' | 'none';

    /** Authentication type (only for full/backend modes) */
    auth: AuthType;

    /** State management solution (only for full/frontend modes) */
    state: StateManagement;

    /** Include Docker configuration */
    docker: boolean;

    /** Payment provider (only for full/backend modes) */
    payment: PaymentProvider;

    /** Include Tailwind CSS */
    tailwind: boolean;

    /** Initialize git repository */
    git: boolean;

    /** CI/CD provider */
    cicd: CicdProvider;

    /** Auto-install dependencies after generation */
    install: boolean;
}

/**
 * CLI options passed from command line
 */
export interface CLIOptions {
    mode?: GenerationMode;
    typescript?: boolean;
    javascript?: boolean;
    es6?: boolean;
    vanilla?: boolean;
    frontend?: Frontend;
    database?: Database;
    orm?: 'mongoose' | 'prisma' | 'pg' | 'none';
    auth?: AuthType;
    state?: StateManagement;
    tailwind?: boolean;
    docker?: boolean;
    payment?: PaymentProvider;
    git?: boolean;
    cicd?: CicdProvider;
    install?: boolean;
    dryRun?: boolean;
    yes?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Omit<ProjectConfig, 'projectName'> = {
    mode: 'full',
    language: 'typescript',
    moduleSystem: 'es6',
    frontend: 'vite',
    database: 'mongodb',
    orm: 'mongoose',
    auth: 'jwt',
    state: 'zustand',
    tailwind: true,
    docker: true,
    payment: 'none',
    cicd: 'none',
    git: true,
    install: true,
};

/**
 * Template context passed to EJS templates
 */
export interface TemplateContext extends ProjectConfig {
    /** Capitalized project name for display */
    projectNameCapitalized: string;

    /** Whether to use TypeScript */
    isTypeScript: boolean;

    /** Whether to use ES6 modules */
    isES6: boolean;

    /** File extension for scripts (.ts or .js) */
    scriptExt: string;

    /** File extension for React components (.tsx or .jsx) */
    reactExt: string;
}

/**
 * Generator result with created files and directories
 */
export interface GeneratorResult {
    /** Whether generation was successful */
    success: boolean;

    /** Absolute path to the generated project */
    projectPath: string;

    /** List of created files (relative to project root) */
    createdFiles: string[];

    /** List of created directories (relative to project root) */
    createdDirectories: string[];

    /** Any errors that occurred */
    errors: string[];
}
