import { validateProjectName, validateOptions, isValidDirectoryName } from '../../src/utils/validation';

describe('Validation Utilities', () => {
    describe('validateProjectName', () => {
        it('should return valid for a simple lowercase name', () => {
            const result = validateProjectName('my-project');
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should return invalid for spaces', () => {
            const result = validateProjectName('my project');
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('name can only contain URL-friendly characters');
        });

        it('should return invalid for uppercase letters', () => {
            const result = validateProjectName('MyProject');
            expect(result.valid).toBe(false);
            // npm package rules say uppercase is an error, but sometimes it depends on the validator version
            const allIssues = [...result.errors, ...result.warnings];
            expect(allIssues.some(issue => issue.includes('capital letters'))).toBe(true);
        });
    });

    describe('validateOptions', () => {
        it('should catch conflicting language options', () => {
            const result = validateOptions({ typescript: true, javascript: true } as any);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Cannot use both --typescript and --javascript');
        });

        it('should catch conflicting module systems', () => {
            const result = validateOptions({ es6: true, vanilla: true } as any);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Cannot use both --es6 and --vanilla');
        });

        it('should warn when ignoring flags in backend mode', () => {
            const result = validateOptions({ mode: 'backend', frontend: 'vite' } as any);
            expect(result.valid).toBe(true);
            expect(result.warnings).toContain('--frontend is ignored in backend mode');
        });
    });

    describe('isValidDirectoryName', () => {
        it('should accept valid directory names', () => {
            expect(isValidDirectoryName('test-project')).toBe(true);
            expect(isValidDirectoryName('project123')).toBe(true);
        });

        it('should reject invalid characters', () => {
            expect(isValidDirectoryName('test/project')).toBe(false);
            expect(isValidDirectoryName('test\\project')).toBe(false);
            expect(isValidDirectoryName('test:project')).toBe(false);
        });
    });
});
