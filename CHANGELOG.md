# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Automated Releases**: Integrated `semantic-release` for automated versioning and npm publication.
- **Commit Linting**: Added `commitlint` and `husky` to enforce Conventional Commits (strict `feat:` and `fix:` prefixes).
- **GitHub Actions**: Created a release workflow for automated CI/CD.

### Changed

- **Documentation Refinement**: Professionalized the `README.md` by removing emojis and simplifying the structure.
- **Git Config**: Updated `.gitignore` to protect internal development plans.

### Fixed

- **MD041 Lint Error**: Resolved "first-line-h1" linting error by ignoring the text-based `LICENSE` file.
- **Type Safety**: Fixed missing properties in `ProjectConfig` tests to ensure build stability.

## [1.0.0] - 2025-12-21

### Added

- **Project Generation**: Interactive CLI for scaffolding MERN stack applications using `inquirer`.
- **Frontend Templates**: React 18+ (Vite) with configurable state management (Redux, Zustand, Context).
- **Backend Templates**: Express server with MongoDB (Mongoose) or PostgreSQL (Prisma/node-postgres).
- **Authentication**: Pre-configured JWT and Session-based authentication strategies.
- **Payment Integration**: Ready-to-use Stripe and Paystack adapters with webhook support.
- **Docker Support**: Automated generation of production-ready `Dockerfile` and `docker-compose.yml`.
- **Language Options**: First-class support for TypeScript and JavaScript (ES6).
- **Styling**: Tailwind CSS v4 pre-configuration.
- **Dry-run Mode**: Preview project structure without writing files to disk.
