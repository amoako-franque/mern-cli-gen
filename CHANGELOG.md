# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-21

### Added
- **Project Generation**: CLI for scaffolding MERN stack applications.
- **Frontend Options**: React (Vite) with configurable state management (Redux, Zustand, Context).
- **Backend Options**: Express server with MongoDB (Mongoose) or PostgreSQL (Prisma/node-postgres).
- **Authentication**: Built-in support for JWT and Session-based authentication strategies.
- **Docker Integration**: Automated generation of `Dockerfile` and `docker-compose.yml`.
- **Language Support**: TypeScript, JavaScript (ES6 Modules), and JavaScript (CommonJS).
- **Styling**: Optional Tailwind CSS v4 integration.

### Features
- Interactive CLI prompts using `inquirer`.
- Dry-run mode for verifying configuration without writing files.
- Automated dependency installation (optional).
- Git repository initialization (optional).
