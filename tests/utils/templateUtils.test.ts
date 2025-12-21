import {
    createTemplateContext,
    getVariantPath,
    getFrontendTemplatePath,
    getBackendTemplatePath
} from '../../src/utils/templateUtils';
import { ProjectConfig } from '../../src/types/index';

describe('Template Utils', () => {
    const baseConfig: ProjectConfig = {
        projectName: 'test-project',
        mode: 'full',
        language: 'typescript',
        moduleSystem: 'es6',
        frontend: 'vite',
        database: 'mongodb',
        auth: 'none',
        state: 'none',
        tailwind: false,
        docker: false,
        git: false,
        install: false
    };

    describe('createTemplateContext', () => {
        it('should create context with derived properties for TypeScript', () => {
            const context = createTemplateContext(baseConfig);
            expect(context.projectName).toBe('test-project');
            expect(context.projectNameCapitalized).toBe('Test Project');
            expect(context.isTypeScript).toBe(true);
            expect(context.scriptExt).toBe('ts');
            expect(context.reactExt).toBe('tsx');
        });

        it('should create context for JavaScript', () => {
            const config = { ...baseConfig, language: 'javascript' as const };
            const context = createTemplateContext(config);
            expect(context.isTypeScript).toBe(false);
            expect(context.scriptExt).toBe('js');
            expect(context.reactExt).toBe('jsx');
        });
    });

    describe('getVariantPath', () => {
        it('should return ts-es6 for TypeScript', () => {
            expect(getVariantPath(baseConfig)).toBe('ts-es6');
        });

        it('should return js-es6 for JavaScript + ES6', () => {
            const config = { ...baseConfig, language: 'javascript' as const, moduleSystem: 'es6' as const };
            expect(getVariantPath(config)).toBe('js-es6');
        });

        it('should return js-vanilla for JavaScript + Vanilla', () => {
            const config = { ...baseConfig, language: 'javascript' as const, moduleSystem: 'vanilla' as const };
            expect(getVariantPath(config)).toBe('js-vanilla');
        });
    });

    describe('getTemplatePaths', () => {
        it('should join paths correctly for frontend', () => {
            // Mock path.join or just verify the suffix
            // Since we can't easily mock path.join without deeper mocks, we'll verify the end of the string
            // assuming templatesDir is absolute or relative
            const path = getFrontendTemplatePath(baseConfig);
            expect(path).toMatch(/client\/vite\/ts-es6$/);
        });

        it('should join paths correctly for backend', () => {
            const path = getBackendTemplatePath(baseConfig);
            expect(path).toMatch(/server\/express\/ts-es6$/);
        });
    });
});
