# MERN-CLI-Gen

> A powerful, production-ready CLI tool to scaffold feature-rich MERN stack projects in seconds.

[![GitHub stars](https://img.shields.io/github/stars/amoako-franque/mern-cli-gen?style=social)](https://github.com/amoako-franque/mern-cli-gen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MERN-CLI-Gen takes the pain out of starting a new full-stack project. It generates a complete, secure, and scalable architecture with your choice of language, database, authentication, and payment integration.

---

## Features

- **Full MERN Stack** — Integrated MongoDB/PostgreSQL, Express, React, and Node.js.
- **TypeScript First** — Strict TypeScript configuration across the entire stack.
- **Advanced Authentication** — Multiple options: JWT, Sessions, or **Passport (Local + Google + GitHub)**.
- **Payment Integration** — Ready-to-use **Stripe** and **Paystack** providers with webhook handling.
- **Modern Frontend** — React 18+ powered by **Vite** or **Next.js**, with **Tailwind CSS v4** pre-configured.
- **CI/CD Built-in** — Automated **GitHub Actions** for testing, linting, and Docker image deployment.
- **Docker Powered** — Production-ready multi-stage Dockerfiles and docker-compose.
- **Monorepo Architecture** — Clean separation of concerns with `client`, `server`, and optional `shared` workspaces.
- **Security by Design** — Helmet, CORS, Rate Limiting, and Zod request validation included.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

## Installation

```bash
# Using npx (recommended - run without installing)
# With project name provided
npx mern-cli-gen@latest create my-app

# Without project name (will prompt for it)
npx mern-cli-gen@latest create

# Global installation
npm install -g mern-cli-gen
mern-cli-gen create my-app
# or
mern-cli-gen create  # will prompt for project name
```

**Note:** The `@latest` tag is optional when using npx - it will use the latest version by default.

---

## Quick Start

1. **Scaffold your project:**

   ```bash
   # With project name
   npx mern-cli-gen@latest create my-awesome-app

   # Or without project name (will prompt)
   npx mern-cli-gen@latest create
   ```

   Follow the interactive prompts to configure your project.

2. **Setup Environment:**

   ```bash
   cd my-awesome-app
   # .env file is auto-created from .env.example
   # Edit server/.env (or .env for backend-only) with your configuration
   ```

3. **Launch Development Environment:**

   ```bash
   npm run dev
   ```

Your application will be live at:

- **Frontend:** <http://localhost:5173> (Vite) or <http://localhost:3000> (Next.js)
- **Backend:** <http://localhost:51210>
- **API Documentation:** <http://localhost:51210/api-docs>

---

## CLI Reference

```bash
mern-cli-gen create [project-name] [options]
```

**Project Name:**
- If provided: The CLI will use it directly
- If omitted: The CLI will prompt "What is your project name?" and validate the input

### Core Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--mode` | `-m` | `full`, `frontend`, `backend` | `full` |
| `--language` | `-l` | `typescript`, `javascript` | `typescript` |
| `--frontend` | `-f` | `vite`, `nextjs` | `vite` |
| `--database` | `-d` | `mongodb`, `postgresql` | `mongodb` |
| `--orm` | | `mongoose`, `prisma`, `pg` | Auto-detected |
| `--auth` | `-a` | `jwt`, `session`, `passport`, `none` | `jwt` |
| `--payment` | `-p` | `stripe`, `paystack`, `mock`, `none` | `none` |
| `--state` | `-s` | `zustand`, `redux`, `context`, `none` | `zustand` |
| `--cicd` | | `github`, `none` | `none` |
| `--no-docker` | | Disable Docker configuration | `false` |
| `--no-tailwind`| | Disable Tailwind CSS v4 | `false` |
| `--dry-run` | | Preview generation without writing files | `false` |

### Configuration Examples

```bash
# Enterprise setup: Next.js + PostgreSQL + Prisma + Passport + Stripe + GitHub Actions
mern-cli-gen create enterprise-app --frontend nextjs --database postgresql --orm prisma --auth passport --payment stripe --cicd github

# Fast Prototyping: Vite + MongoDB + Zustand
mern-cli-gen create rapid-app --state zustand --auth jwt

# Backend Only: Express API + PostgreSQL + node-postgres
mern-cli-gen create api-service --mode backend --database postgresql --orm pg
```

---

## Architecture

The generated project uses a modern monorepo structure:

```text
my-app/
├── client/              # React frontend (Vite/Next.js)
├── server/              # Node.js/Express API
├── shared/              # Shared types/utils (TypeScript only)
├── .github/             # CI/CD workflows (optional)
├── docker-compose.yml   # Multi-service orchestration
└── package.json         # Workspace management
```

---

## Available Commands (Root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Spins up both frontend and backend concurrently |
| `npm run build` | Compiles both applications for production |
| `npm run test` | Executes Jest suites for both services |
| `npm run lint` | Runs ESLint across the entire workspace |
| `npm run docker:dev`| Starts the environment using Docker Compose |

---

## Error Recovery System ⚠️

If project generation fails at any stage, the CLI automatically cleans up all created files and directories to prevent partial or corrupted projects.

### Automatic Cleanup

Cleanup is triggered when:
- Project generation fails
- Template rendering errors occur
- File system errors (permissions, disk space, etc.)
- User interruption (Ctrl+C)
- Validation failures after generation starts
- Dependency installation failures (if auto-install enabled)

### What Gets Cleaned

- Entire project directory
- Partial files created before the error
- Partial directories created before the error

### User Feedback

When cleanup occurs, you'll see:
- Clear error messages explaining what went wrong
- Detailed context about what was being created
- Helpful suggestions for resolving common issues
- Summary of what was cleaned (number of files/directories removed)

**Note:** If dependency installation fails, the project structure is preserved (as it was created successfully), and you'll receive instructions for manual installation.

---

## Features

- **Automatic Cleanup** — Failed generations are automatically cleaned up
- **Optimized Dependencies** — Faster installation with only essential packages
- **Interactive Prompts** — User-friendly configuration flow
- **Error Recovery** — Comprehensive error handling with helpful suggestions

---

## Contributing

We love community contributions! To get started:

1. Check out our [Contributing Guide](CONTRIBUTING.md).
2. Report bugs or suggest features via [GitHub Issues](https://github.com/amoako-franque/mern-cli-gen/issues).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

If this tool made your life easier, please give it a star! It helps the project grow.

[![GitHub stars](https://img.shields.io/github/stars/amoako-franque/mern-cli-gen?style=social)](https://github.com/amoako-franque/mern-cli-gen)
