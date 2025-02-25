# Getting Started

This guide will help you set up your development environment and get started with the Anti-Capitalist Idle Game project.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/idle-game.git
cd idle-game
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm start
```

The game will be available at http://localhost:8080.

## Project Structure

- `/src/` - Source code
  - `/components/` - React components
  - `/managers/` - Game managers (singletons)
  - `/models/` - TypeScript interfaces and types
  - `/store/` - Redux store and slices
  - `/utils/` - Utility functions

- `/docs/` - Documentation
  - `/features/` - Feature documentation
  - `/guides/` - Development guides
  - `/processes/` - Development processes
  - `/project/` - Project information
  - `/specifications/` - Game specifications

- `/tests/` - Test files

## Development Workflow

1. **Create a new branch for your changes**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

3. **Run tests to ensure everything works**

```bash
npm test
```

4. **Validate documentation if you've made documentation changes**

```bash
cd docs
./processes/documentation/validation/validate-docs.sh
```

5. **Commit your changes**

```bash
git add .
git commit -m "Add your feature"
```

6. **Push your changes**

```bash
git push origin feature/your-feature-name
```

7. **Open a pull request**

## Getting Help

- Check the documentation in the `/docs/` directory
- Look at existing code for examples
- Ask for help in the project communication channels