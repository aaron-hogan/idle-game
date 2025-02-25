# Anti-Capitalist Idle Game - Developer Guidelines

## Build Commands
- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run all tests
- `npm test -- -t "testName"` - Run specific test
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Code Style
- **TypeScript**: Use strict typing and interfaces for all data structures
- **Components**: Functional React components with hooks
- **State Management**: Redux with Redux Toolkit for actions/reducers
- **Imports**: Group imports (React, libraries, local)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Error Handling**: Use error boundaries for React components, try/catch for async operations

## Architecture
- Follow component-based architecture with clear separation of concerns
- Use data-driven design for game entities and events
- Maintain modular codebase to allow easy addition of new content
- Implement observer pattern for event handling and UI updates

## Documentation

### Documentation Structure

The documentation is organized into the following directories:

- **Features** (`/docs/features/`): Feature-specific documentation
- **Guides** (`/docs/guides/`): Developer guides and onboarding
- **Processes** (`/docs/processes/`): Development processes and standards
- **Project** (`/docs/project/`): Project-level information
- **Specifications** (`/docs/specifications/`): Game specifications
- **Archive** (`/docs/archive/`): Archived documentation

### Documentation Style
- **Location**: All documentation files for a feature should be in kebab-case and placed in `/docs/features/[feature-name]/`
- **Format**: Markdown files with proper heading hierarchy (# for title, ## for sections)
- **Feature Documentation Set**:
  - `feature-name.md`: Main documentation of the feature
  - `plan.md`: Initial implementation plan
  - `summary.md`: Summary of implementation results
  - `todo.md`: Ongoing todo list for the feature
- **Content Structure**:
  - Overview section with brief feature description
  - Core Components section explaining key parts
  - Usage Guide with code examples
  - Integration section explaining connections to other systems
  - Best Practices section with recommendations
- **Code Examples**: Include well-commented TypeScript examples for implementation reference

### Documentation Management
- **ALWAYS** place new documentation in the appropriate feature folder
- For **EVERY** new feature implementation, create a folder and the complete documentation set:
  
  **Folder naming:**
  - Create folder at: `/docs/features/feature-name/` (use kebab-case)
  - Example: `/docs/features/event-system/`, `/docs/features/resources/`, `/docs/features/game-loop/`
  
  **Required documents and naming:**
  1. `/docs/features/feature-name/plan.md` - Create **BEFORE** starting development
     - Purpose: Details implementation approach, architecture, and tasks
     - Content: Goals, approach, timeline, and the **implementation prompt**
     - Must include a specific implementation prompt that will be used to create the feature
     - Use the template in `/docs/processes/documentation/templates/docs-template.md` to generate this
  
  2. `/docs/features/feature-name/feature-name.md` - Create during/after implementation
     - Purpose: Main documentation explaining how the feature works
     - Content: Overview, architecture, usage guide, API reference, integration details
     - Example: `/docs/features/event-system/event-system.md`
     - Follow the structure in `/docs/processes/documentation/templates/docs-template.md`
  
  3. `/docs/features/feature-name/summary.md` - Create when feature is complete
     - Purpose: Summarizes what was actually implemented vs. what was planned
     - Content: What was implemented, benefits added, challenges overcome, next steps
     - Follow the template in `/docs/processes/documentation/templates/docs-template.md`
  
  4. `/docs/features/feature-name/todo.md` - Create and maintain throughout development
     - Purpose: Tracks ongoing and future work for the feature
     - Content: Checklist of completed and remaining tasks, organized by category
     - Use the format from `/docs/processes/documentation/templates/docs-template.md`

### Documentation Validation
- **ALWAYS validate documentation** using the script:
  ```bash
  cd docs
  ./processes/documentation/validation/validate-docs.sh
  ```
- After creating or updating any documentation, run the validation script
- Fix any issues identified by the validation script before committing changes
- Refer to `/docs/processes/documentation/standards.md` for comprehensive documentation standards
- Refer to `/docs/processes/documentation/validation/README.md` for validation process details

### Documentation Maintenance
- **ALWAYS** use the templates provided in `/docs/processes/documentation/templates/docs-template.md`
- **ALWAYS** include the specific implementation prompt in the plan document
- If any documents already exist in a non-standard location, move them to the proper feature folder
- Update `/docs/README.md` when adding new documentation sections
- Update `/docs/project/status.md` when making significant documentation changes
- Maintain documentation alongside code changes to ensure it stays current
- Review existing documentation when making changes to ensure consistency