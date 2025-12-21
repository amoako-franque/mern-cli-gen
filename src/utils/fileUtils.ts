import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the root directory of the CLI package
 */
export function getPackageRoot(): string {
    return path.resolve(__dirname, '..', '..');
}

/**
 * Get the templates directory path
 */
export function getTemplatesDir(): string {
    return path.join(getPackageRoot(), 'templates');
}

/**
 * Check if a directory exists
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
    } catch {
        return false;
    }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
    try {
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch {
        return false;
    }
}

/**
 * Create a directory (and parents if needed)
 */
export async function createDirectory(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
}

/**
 * Write content to a file, creating parent directories if needed
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Copy a file from source to destination
 */
export async function copyFile(src: string, dest: string): Promise<void> {
    await fs.ensureDir(path.dirname(dest));
    await fs.copyFile(src, dest);
}

/**
 * Copy a directory recursively
 */
export async function copyDirectory(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
}

/**
 * Read a file as string
 */
export async function readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
}

/**
 * Delete a directory recursively
 */
export async function removeDirectory(dirPath: string): Promise<void> {
    await fs.remove(dirPath);
}

/**
 * Get all files in a directory recursively
 */
export async function getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];

    async function walk(currentPath: string): Promise<void> {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
            } else {
                files.push(fullPath);
            }
        }
    }

    await walk(dirPath);
    return files;
}

/**
 * Get relative path from base
 */
export function relativePath(from: string, to: string): string {
    return path.relative(from, to);
}

/**
 * Join path segments
 */
export function joinPath(...segments: string[]): string {
    return path.join(...segments);
}

/**
 * Get the absolute path
 */
export function absolutePath(relativePath: string): string {
    return path.resolve(relativePath);
}

/**
 * Get the current working directory
 */
export function getCwd(): string {
    return process.cwd();
}
