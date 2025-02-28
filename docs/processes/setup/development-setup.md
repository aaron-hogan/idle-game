# Development Setup

This guide provides instructions for setting up your development environment and common commands for working with the project.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aaron-hogan/idle-game.git
   cd idle-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Build Commands

- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run all tests
- `npm test -- -t "testName"` - Run specific test by name
- `npm run lint` - Run ESLint for code style validation
- `npm run typecheck` - Run TypeScript type checking

## Development Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, following our [code style guidelines](/docs/processes/code-quality/code-style-guide.md)

3. Run tests to ensure your changes don't break existing functionality:
   ```bash
   npm test
   ```

4. Check for linting and type issues:
   ```bash
   npm run lint
   npm run typecheck
   ```

5. Create a pull request following our [PR workflow](/docs/processes/pr-workflow.md)

## Project Structure

- `src/` - Application source code
  - `components/` - React components
  - `state/` - Redux store, slices, and related logic
  - `models/` - TypeScript interfaces and type definitions
  - `utils/` - Utility functions
  - `hooks/` - Custom React hooks
  - `services/` - Service modules for external interactions
  - `assets/` - Static assets like images and styles
  - `debug/` - Debugging tools and panels
- `public/` - Static files served by the web server
- `tests/` - Additional test helpers and fixtures
- `docs/` - Project documentation

## Related Documentation

- [Code Style Guide](/docs/processes/code-quality/code-style-guide.md)
- [Architecture Guidelines](/docs/processes/code-quality/architecture-guidelines.md)
- [Testing Standards](/docs/processes/code-quality/testing-standards.md)
- [Git Workflow](/docs/processes/git/git-workflow.md)
- [PR Workflow](/docs/processes/git/pr-workflow.md)

## Troubleshooting

If you encounter issues during development:

1. Ensure your Node.js and npm versions meet the requirements
2. Try clearing the node_modules folder and reinstalling dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Clear the build cache:
   ```bash
   npm run clean
   ```
4. If test issues persist, try clearing Jest's cache:
   ```bash
   npm test -- --clearCache
   ```