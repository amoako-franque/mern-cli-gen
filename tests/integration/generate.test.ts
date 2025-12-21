import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { ProjectGenerator } from '../../src/generators/ProjectGenerator.js';
import { ProjectConfig } from '../../src/types/index.js';

describe('Integration: Project Generation', () => {
    let tempDir: string;
    let originalCwd: string;

    beforeEach(async () => {
        originalCwd = process.cwd();
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'mern-cli-test-'));
        process.chdir(tempDir);
    });

    afterEach(async () => {
        process.chdir(originalCwd);
        await fs.remove(tempDir);
    });

    it('should generate a full stack project with default options', async () => {
        const config: ProjectConfig = {
            projectName: 'my-app',
            mode: 'full',
            language: 'typescript',
            moduleSystem: 'es6',
            frontend: 'vite',
            database: 'mongodb',
            auth: 'none',
            state: 'none',
            payment: 'none',
            cicd: 'none',
            tailwind: false,
            docker: true,
            git: false,
            install: false
        };

        const generator = new ProjectGenerator(config);
        const result = await generator.generate();

        if (!result.success) {
            throw new Error('Generation failed: ' + JSON.stringify(result.errors));
        }

        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);

        // Verify root files
        expect(await fs.pathExists(path.join(tempDir, 'my-app', 'package.json'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'my-app', 'docker-compose.yml'))).toBe(true);

        // Verify structure
        expect(await fs.pathExists(path.join(tempDir, 'my-app', 'client'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'my-app', 'server'))).toBe(true);

        // Verify client files
        expect(await fs.pathExists(path.join(tempDir, 'my-app', 'client', 'vite.config.ts'))).toBe(true);

        // Verify server files
        expect(await fs.pathExists(path.join(tempDir, 'my-app', 'server', 'src', 'app.ts'))).toBe(true);
    }, 60000); // 60s timeout

    it('should generate backend-only project', async () => {
        const config: ProjectConfig = {
            projectName: 'backend-app',
            mode: 'backend',
            language: 'javascript',
            moduleSystem: 'es6',
            frontend: 'vite', // Ignored
            database: 'postgresql',
            orm: 'pg',
            auth: 'jwt',
            state: 'none',
            payment: 'none',
            cicd: 'none',
            tailwind: false,
            docker: false,
            git: false,
            install: false
        };

        const generator = new ProjectGenerator(config);
        const result = await generator.generate();

        if (!result.success) {
            throw new Error('Backend Gen failed: ' + JSON.stringify(result.errors));
        }

        expect(result.success).toBe(true);

        // Should NOT have client folder
        expect(await fs.pathExists(path.join(tempDir, 'backend-app', 'client'))).toBe(false);
        // Verify server files
        expect(await fs.pathExists(path.join(tempDir, 'backend-app', 'src', 'app.js'))).toBe(true);
    }, 60000);

    it('should generate a project with passport and payments', async () => {
        const config: ProjectConfig = {
            projectName: 'advanced-app',
            mode: 'full',
            language: 'typescript',
            moduleSystem: 'es6',
            frontend: 'vite',
            database: 'postgresql',
            orm: 'prisma',
            auth: 'passport',
            state: 'zustand',
            payment: 'stripe',
            cicd: 'none',
            tailwind: true,
            docker: true,
            git: false,
            install: false
        };

        const generator = new ProjectGenerator(config);
        const result = await generator.generate();

        if (!result.success) {
            throw new Error('Advanced Gen failed: ' + JSON.stringify(result.errors));
        }

        expect(result.success).toBe(true);

        // Verify Passport config
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'src', 'config', 'passport.ts'))).toBe(true);

        // Verify Payment services
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'src', 'services', 'payment', 'PaymentProvider.ts'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'src', 'services', 'payment', 'StripeAdapter.ts'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'src', 'services', 'payment', 'PaymentService.ts'))).toBe(true);

        // Verify Payment controller and routes
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'src', 'controllers', 'paymentController.ts'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'src', 'routes', 'payment.ts'))).toBe(true);

        // Verify Prisma schema
        expect(await fs.pathExists(path.join(tempDir, 'advanced-app', 'server', 'prisma', 'schema.prisma'))).toBe(true);
    }, 60000);

    it('should generate a frontend-only project', async () => {
        const config: ProjectConfig = {
            projectName: 'frontend-app',
            mode: 'frontend',
            language: 'typescript',
            moduleSystem: 'es6',
            frontend: 'vite',
            database: 'mongodb', // Ignored
            auth: 'none',
            state: 'zustand',
            payment: 'none',
            cicd: 'none',
            tailwind: true,
            docker: true,
            git: false,
            install: false
        };

        const generator = new ProjectGenerator(config);
        const result = await generator.generate();

        if (!result.success) {
            throw new Error('Frontend Gen failed: ' + JSON.stringify(result.errors));
        }

        expect(result.success).toBe(true);

        // Should NOT have server or client subfolders
        expect(await fs.pathExists(path.join(tempDir, 'frontend-app', 'server'))).toBe(false);
        expect(await fs.pathExists(path.join(tempDir, 'frontend-app', 'client'))).toBe(false);

        // Should have Vite files in the root
        expect(await fs.pathExists(path.join(tempDir, 'frontend-app', 'vite.config.ts'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'frontend-app', 'src', 'App.tsx'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'frontend-app', 'package.json'))).toBe(true);

        // Should have Dockerfile (Nginx based)
        expect(await fs.pathExists(path.join(tempDir, 'frontend-app', 'Dockerfile'))).toBe(true);
    }, 60000);

    it('should generate a project with GitHub Actions', async () => {
        const config: ProjectConfig = {
            projectName: 'cicd-app',
            mode: 'backend',
            language: 'typescript',
            moduleSystem: 'es6',
            frontend: 'vite',
            database: 'mongodb',
            auth: 'jwt',
            state: 'zustand',
            payment: 'none',
            tailwind: false,
            docker: true,
            cicd: 'github',
            git: true,
            install: false
        };

        const generator = new ProjectGenerator(config);
        const result = await generator.generate();

        expect(result.success).toBe(true);

        // Verify GitHub Actions workflows
        expect(await fs.pathExists(path.join(tempDir, 'cicd-app', '.github', 'workflows', 'test.yml'))).toBe(true);
        expect(await fs.pathExists(path.join(tempDir, 'cicd-app', '.github', 'workflows', 'docker.yml'))).toBe(true);

        const testWorkflow = await fs.readFile(path.join(tempDir, 'cicd-app', '.github', 'workflows', 'test.yml'), 'utf-8');
        expect(testWorkflow).toContain('Lint and Test');
        expect(testWorkflow).toContain('npm test');
    }, 60000);
});
