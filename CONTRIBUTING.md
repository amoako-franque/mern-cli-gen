# Contributing to MERN-CLI-Gen

Thank you for your interest in contributing to MERN-CLI-Gen! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Adding Templates](#adding-templates)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)

## Code of Conduct

Please be respectful and considerate of others. We welcome contributions from everyone.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/mern-cli-gen.git
   cd mern-cli-gen
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/amoako-franque/mern-cli-gen.git
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Link the CLI locally** (for testing):
   ```bash
   npm link
   ```

4. **Test your changes**:
   ```bash
   # Run tests
   npm test

   # Run integration tests
   npm run test:integration

   # Lint code
   npm run lint
   ```

## Project Structure

```
mern-cli-gen/
├── src/                    # Source TypeScript files
│   ├── cli/               # CLI command handlers
│   ├── generators/        # Project generation logic
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── templates/             # EJS template files
│   ├── client/           # Frontend templates
│   ├── server/           # Backend templates
│   ├── root/             # Root-level files
│   ├── docker/           # Docker configurations
│   └── cicd/             # CI/CD configurations
├── dist/                 # Compiled JavaScript (generated)
└── tests/                # Test files
```

## Making Changes

### Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes**:
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes** (see [Commit Guidelines](#commit-guidelines))

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add support for Next.js 14"
git commit -m "fix: resolve template path issue"
git commit -m "docs: update README with new examples"
```

## Adding Templates

### Template Structure

Templates use EJS (Embedded JavaScript) syntax and are located in the `templates/` directory.

### Frontend Templates

Frontend templates are organized by framework and variant:
```
templates/client/
├── vite/
│   ├── ts-es6/          # TypeScript + ES6 modules
│   ├── js-es6/          # JavaScript + ES6 modules
│   └── js-vanilla/      # JavaScript + CommonJS
└── nextjs/
    └── ts-es6/
```

### Backend Templates

Backend templates are organized by framework and variant:
```
templates/server/
├── express/
│   ├── ts-es6/
│   ├── js-es6/
│   └── js-vanilla/
└── common/              # Shared templates (e.g., Prisma schema)
```

### Template Variables

Templates have access to a `TemplateContext` object with the following properties:

- `projectName` - Project name
- `projectNameCapitalized` - Capitalized project name
- `language` - 'typescript' or 'javascript'
- `moduleSystem` - 'es6' or 'vanilla'
- `frontend` - 'vite' or 'nextjs'
- `database` - 'mongodb' or 'postgresql'
- `auth` - Authentication type
- `state` - State management solution
- `isTypeScript` - Boolean
- `isES6` - Boolean
- `scriptExt` - File extension ('ts' or 'js')
- `reactExt` - React file extension ('tsx' or 'jsx')

### Example Template

```ejs
// templates/client/vite/ts-es6/src/App.tsx.ejs
import React from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to <%= projectNameCapitalized %></h1>
    </div>
  );
}

export default App;
```

### Adding a New Template Variant

1. Create the template directory structure
2. Add template files with `.ejs` extension
3. Update `getFrontendTemplatePath()` or `getBackendTemplatePath()` if needed
4. Test the template generation
5. Update documentation

## Testing

### Unit Tests

Unit tests are located in `tests/utils/` and test individual utility functions.

```bash
npm test
```

### Integration Tests

Integration tests verify the full generation process:

```bash
npm run test:integration
```

### Manual Testing

1. Build the project: `npm run build`
2. Link locally: `npm link`
3. Generate a test project: `mern-cli-gen create test-project`
4. Verify the generated project structure and files

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all tests pass**:
   ```bash
   npm test
   npm run lint
   ```

3. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues (if any)
   - Screenshots or examples (if applicable)

4. **Respond to feedback** and make requested changes

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated (if needed)
- [ ] No linting errors
- [ ] Commit messages follow conventional commits
- [ ] Changes are backward compatible (or migration guide provided)

## Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use ES modules (`import`/`export`)
- Follow existing code patterns

### Formatting

- Use Prettier for formatting: `npm run format`
- Use ESLint for linting: `npm run lint`

### Naming Conventions

- **Files**: `camelCase.ts` for utilities, `PascalCase.ts` for classes
- **Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Code Organization

- Keep functions small and focused
- Add JSDoc comments for public APIs
- Group related functionality together
- Use meaningful variable names

## Questions?

If you have questions or need help:

1. Check existing [GitHub Issues](https://github.com/amoako-franque/mern-cli-gen/issues)
2. Create a new issue with the `question` label
3. Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MERN-CLI-Gen! 🎉

