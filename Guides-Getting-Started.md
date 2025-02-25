# Getting Started Guide

This guide will help you set up your development environment and understand the basic structure of the Idle Game.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A code editor (VS Code recommended)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aaron-hogan/idle-game.git
   cd idle-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
idle-game/
├── docs/            # Documentation
├── public/          # Static assets
├── src/             # Source code
│   ├── components/  # React components
│   ├── data/        # Game data and configuration
│   ├── redux/       # Redux store, actions, and reducers
│   ├── systems/     # Game systems
│   ├── utils/       # Utility functions
│   ├── index.tsx    # Entry point
├── tests/           # Tests
├── package.json     # Project configuration
├── tsconfig.json    # TypeScript configuration
└── webpack.config.js # Webpack configuration
```

## Development Workflow

1. Make your changes in the appropriate directory
2. Run tests to ensure everything works:
   ```bash
   npm test
   ```
3. Run linting to ensure code quality:
   ```bash
   npm run lint
   ```
4. Run type checking:
   ```bash
   npm run typecheck
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Architecture Overview

The game uses a component-based architecture with the following key elements:

- **React** for UI components
- **Redux** for state management
- **TypeScript** for type safety
- **GameCore** as the central game loop
- **EventSystem** for communication between systems

See the [Architecture Documentation](Project/Architecture) for more details.