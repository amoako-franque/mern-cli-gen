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
npx mern-cli-gen create my-app

# Global installation
npm install -g mern-cli-gen
mern-cli-gen create my-app
```

---

## Quick Start

1. **Scaffold your project:**

   ```bash
   npx mern-cli-gen create my-awesome-app
   ```

2. **Setup Environment:**

   ```bash
   cd my-awesome-app
   cp .env.example .env
   ```

3. **Launch Development Environment:**

   ```bash
   npm run dev
   ```

Your application will be live at:

- **Frontend:** <http://localhost:5173>
- **Backend:** <http://localhost:5000>
- **API Documentation:** <http://localhost:5000/api-docs>

---

## CLI Reference

```bash
mern-cli-gen create <project-name> [options]
```

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
