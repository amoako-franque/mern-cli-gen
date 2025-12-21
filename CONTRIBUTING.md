# Contributing to MERN-CLI-Gen

First off, thank you for considering contributing to MERN-CLI-Gen! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🚀 Getting Started

To contribute to this project, follow these steps to set up your local development environment:

### 1. Fork and Clone

```bash
git clone https://github.com/amoako-franque/mern-cli-gen.git
cd mern-cli-gen
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the CLI

```bash
npm run build
```

### 4. Link Locally

This allows you to run `mern-cli-gen` commands from anywhere on your machine using your local development version.

```bash
npm link
```

## 🧪 Testing

We take quality seriously. Please ensure all tests pass before submitting a pull request.

### Unit Tests

```bash
npm test
```

### Integration Tests

Integration tests verify the actual generation of projects across different configurations.

```bash
npm run test:integration
```

## 📜 Coding Standards

- **TypeScript**: Use TypeScript for all new features.
- **Linting**: Run `npm run lint` and fix any issues.
- **Templates**: When modifying EJS templates in the `templates/` directory, ensure you handle conditional logic for all variants (JS/TS, ES6/Vanilla).
- **Documentation**: If you add a new CLI flag or feature, update the `README.md` and appropriate help menus.

## 📬 Pull Request Process

1. Create a new branch: `git checkout -b feature/my-new-feature`.
2. Commit your changes: `git commit -m 'Add some feature'`.
3. Push to the branch: `git push origin feature/my-new-feature`.
4. Open a Pull Request on GitHub.
5. Ensure the CI pipeline passes.

## 🐞 Reporting Bugs

If you find a bug, please open an issue and include:

- Your OS and Node.js version.
- The exact command you ran.
- The error message or a description of the unexpected behavior.

---

Thank you for your help! 🎉
