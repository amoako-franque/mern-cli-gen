# MERN-CLI-Gen Implementation Plan

## Installation 📦

### Quick Start (Recommended - No Installation Required)

```bash
# With project name provided
npx mern-cli-gen@latest create <project-name>

# Without project name (will prompt for it)
npx mern-cli-gen@latest create
```

### Global Installation (Optional)

For frequent use, install globally:

```bash
npm install -g mern-cli-gen
```

Then use:

```bash
mern-cli-gen create <project-name>
# or
mern-cli-gen create  # will prompt for project name
```

**Note:** The `@latest` tag is optional when using npx - it will use the latest version by default.

---

## Usage 🛠️

Run the CLI and follow the interactive prompts:

```bash
npx mern-cli-gen@latest create [project-name]
```

### Project Name Handling

- **If project name is provided:** The CLI will use it directly (e.g., `npx mern-cli-gen@latest create my-app`)
- **If project name is omitted:** The CLI will prompt: "What is your project name?" and validate the input

### Configuration Options

During the interactive setup, you'll be asked to configure:

1. **Project Name** (required if not provided via command line)
2. **Generation Mode**
   - Full Stack (client + server)
   - Frontend Only (React)
   - Backend Only (Express API)
3. **Language**
   - TypeScript (recommended)
   - JavaScript
4. **Module System** (JavaScript only)
   - ES6 modules
   - CommonJS (vanilla)
5. **Frontend Framework** (for full/frontend modes)
   - Vite
   - Next.js
6. **Database** (for full/backend modes)
   - MongoDB
   - PostgreSQL
7. **ORM/Driver** (auto-detected based on database)
   - Mongoose (for MongoDB)
   - Prisma (for PostgreSQL)
   - node-postgres (for PostgreSQL)
8. **Authentication** (for full/backend modes)
   - JWT
   - Session-based
   - Passport (Local + Google + GitHub)
   - None
9. **State Management** (for full/frontend modes)
   - Zustand
   - Redux
   - Context API
   - None
10. **Payment Integration** (for full/backend modes)
    - Stripe
    - Paystack
    - Mock Adapter (for development)
    - None
11. **Docker Configuration**
    - Include Dockerfile and docker-compose.yml
12. **Tailwind CSS** (for full/frontend modes)
    - Include Tailwind CSS v4
13. **Git Repository**
    - Initialize git repository with initial commit
14. **CI/CD Provider**
    - GitHub Actions
    - None
15. **Dependency Installation**
    - Automatically install dependencies after generation

---

## Project Structure

Your new project will include:

```
project-name/
├── client/              # React frontend (Vite/Next.js)
│   ├── public/         # Static assets
│   ├── src/            # Application code
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── ...         # Additional source files
│   ├── package.json    # Frontend dependencies
│   └── [config files]  # Vite/Next.js configuration
│
├── server/             # Node.js/Express server
│   ├── src/
│   │   ├── controllers/# Business logic
│   │   ├── routes/     # API endpoints
│   │   ├── models/     # Database models
│   │   ├── middleware/ # Express middleware
│   │   ├── config/     # Configuration files
│   │   └── utils/      # Utility functions
│   ├── .env            # Environment variables (auto-created from .env.example)
│   ├── .env.example    # Environment template
│   ├── index.js/ts     # Server entry point
│   └── package.json    # Backend dependencies
│
├── shared/             # Shared types/utils (TypeScript only, optional)
│   ├── types/          # Shared TypeScript types
│   └── utils/          # Shared utility functions
│
├── docker-compose.yml  # Docker orchestration (if Docker enabled)
├── .github/            # CI/CD workflows (if CI/CD enabled)
│   └── workflows/
├── package.json        # Root workspace configuration
└── README.md           # Project documentation
```

**Note:** The structure varies based on your selected options (mode, language, framework, etc.).

---

## Error Recovery System ⚠️

### Automatic Cleanup

If project generation fails at any stage, the CLI will automatically clean up all created files and directories to prevent partial or corrupted projects.

#### When Cleanup is Triggered

Cleanup is automatically triggered when:

1. **Project generation fails** - Any error during the generation process
2. **Template rendering errors** - Issues processing template files
3. **File system errors** - Permission issues, disk space problems, etc.
4. **User interruption** - User presses Ctrl+C during generation
5. **Validation failures** - Invalid configuration detected after starting generation
6. **Dependency installation failures** - If auto-install is enabled and fails

#### What Gets Cleaned

- **Entire project directory** - If creation fails, the entire `project-name/` directory is removed
- **Partial files** - Any files created before the error occurred
- **Partial directories** - Any directories created before the error occurred
- **Temporary files** - Any temporary files created during the process

#### User Feedback

When cleanup occurs, users will see:

- **Clear error messages** explaining what went wrong
- **Detailed context** about what was being created when the error occurred
- **Helpful suggestions** for resolving common issues (e.g., "Check disk space", "Verify permissions")
- **Summary of what was cleaned** (number of files/directories removed)

#### Error Recovery Flow

1. Error detected during generation
2. Generation process stops immediately
3. All created files and directories are identified
4. Cleanup process removes all created artifacts
5. User receives clear error message with next steps
6. Exit with appropriate error code

#### Example Error Output

```
❌ Failed to generate project
Project: my-app
Mode: full
Path: /path/to/my-app

Errors:
  - Template file not found: templates/client/vite/ts-es6/src/App.tsx.ejs
  - Failed to create directory: my-app/client/src

⚠️  Cleaning up partially created project...
✓ Removed 5 files
✓ Removed 3 directories

💡 Tip: Check the error messages above and verify your configuration.
   Common issues:
   - Missing template files (check installation)
   - Insufficient disk space
   - Permission errors (check directory permissions)
```

---

## Optimized Dependencies

### Faster Installation Strategy

The CLI uses an optimized dependency installation approach:

#### What "Optimized" Means

1. **Essential packages only** - Only core dependencies are included in initial templates
2. **Peer dependency handling** - Peer dependencies are automatically resolved during installation
3. **Minimal initial install** - Faster template generation with minimal package.json files
4. **Post-generation install** - Full dependency installation happens after project structure is created

#### Benefits

- **Faster project generation** - Less time waiting for package resolution during template creation
- **Cleaner templates** - Template files focus on structure, not dependency management
- **Flexible installation** - Users can choose to skip auto-install and install manually
- **Better error handling** - Dependency issues are caught after structure is created, making cleanup easier

#### Trade-offs

- **Two-step process** - Structure creation + dependency installation (if auto-install enabled)
- **Requires npm/node** - Dependency installation requires npm/node to be available

#### Installation Flow

1. Generate project structure with minimal package.json files
2. Create all template files
3. If `--install` flag is set (default: true):
   - Install root dependencies (for monorepo)
   - Install client dependencies
   - Install server dependencies
4. If installation fails:
   - Report error
   - Optionally clean up (based on error recovery system)
   - Provide manual installation instructions

---

## What Happens Next? 🚀

After successful project generation:

1. **Navigate to your project:**
   ```bash
   cd project-name
   ```

2. **Set up environment variables** (if backend/full stack):
   ```bash
   # .env file is auto-created from .env.example
   # Edit .env with your actual values:
   # - Database connection strings
   # - JWT secrets
   # - API keys
   # - Payment provider keys
   ```

3. **Start development servers:**
   ```bash
   # For full stack projects
   npm run dev

   # Or run separately:
   cd client && npm run dev    # Frontend (usually http://localhost:5173)
   cd server && npm run dev    # Backend (usually http://localhost:51210)
   ```

4. **Access your application:**
   - Frontend: http://localhost:5173 (Vite) or http://localhost:3000 (Next.js)
   - Backend API: http://localhost:51210
   - API Documentation: http://localhost:51210/api-docs (if Swagger enabled)

5. **Start building:**
   - Your project is ready with authentication, database models, API routes, and more
   - Check the generated README.md for project-specific instructions

---

## Additional Notes

### Command Line Options

You can skip prompts by providing options directly:

```bash
npx mern-cli-gen@latest create my-app \
  --mode full \
  --typescript \
  --frontend vite \
  --database mongodb \
  --auth jwt \
  --state zustand \
  --docker \
  --tailwind \
  --git \
  --install
```

Use `--yes` or `-y` to accept all defaults without prompts.

### Dry Run Mode

Preview what would be generated without creating files:

```bash
npx mern-cli-gen@latest create my-app --dry-run
```

### Version Consistency

- Using `npx mern-cli-gen@latest` ensures you always get the latest version
- Using `npx mern-cli-gen` (without @latest) also defaults to the latest version
- For global installs, update with: `npm install -g mern-cli-gen@latest`

---

## Implementation Checklist

- [ ] Update CLI to accept optional project name (prompt if missing)
- [ ] Implement automatic cleanup system for failed generations
- [ ] Add error recovery with detailed user feedback
- [ ] Optimize dependency installation strategy
- [ ] Update documentation with new installation commands
- [ ] Test error scenarios and cleanup behavior
- [ ] Add user-friendly error messages and suggestions
- [ ] Ensure cleanup works for all failure points
- [ ] Test with various project configurations
- [ ] Update README.md with new usage patterns
