# Anti-Capitalist Idle Game Documentation

This directory contains the documentation for the Anti-Capitalist Idle Game project. The documentation is organized by feature and system, making it easy to find relevant information.

## Directory Structure

- **Features** (`/docs/features/`)
  - **Debug Panel** (`/docs/features/debug-panel/`)
    - `debug-panel.md`: Main documentation of the debug panel
    - `plan.md`: Implementation plan
    - `summary.md`: Summary of implementation
    - `todo.md`: Ongoing tasks

  - **Event System** (`/docs/features/event-system/`)
    - `event-system.md`: Main documentation of the event system
    - `plan.md`: Implementation plan
    - `summary.md`: Summary of completed work
    - `todo.md`: Ongoing tasks

  - **Timer System** (`/docs/features/timer/`)
    - `timer.md`: Main timer system documentation
    - `plan.md`: Implementation plan
    - `summary.md`: Implementation results
    - `todo.md`: Todo list

- **Guides** (`/docs/guides/`)
  - `getting-started.md`: Guide for new developers
  - `contributing.md`: Guidelines for contributions
  - `style-guide.md`: Coding standards and best practices

- **Processes** (`/docs/processes/`)
  - **Documentation** (`/docs/processes/documentation/`)
    - `standards.md`: Documentation standards
    - **Templates** (`/docs/processes/documentation/templates/`)
      - `docs-template.md`: Templates for documentation
    - **Validation** (`/docs/processes/documentation/validation/`)
      - `validate-docs.sh`: Documentation validation script
      - `README.md`: Validation guide
      - `REPORT.md`: Validation report

  - **Testing** (`/docs/processes/testing/`)
    - `standards.md`: Testing standards
    - `strategies.md`: Testing strategies
    - **Templates** (`/docs/processes/testing/templates/`)
      - `test-plan-template.md`: Template for test plans

- **Project** (`/docs/project/`)
  - `overview.md`: Project overview and introduction
  - `status.md`: Overall project status and progress
  - `todo.md`: Global todo list for the project

- **Specifications** (`/docs/specifications/`)
  - `game-specification.md`: Complete game specification
  - `implementation-plan.md`: Implementation strategy

- **Archive** (`/docs/archive/`)
  - `full-game-specification.md`: Archived specifications

## Documentation Standards and Validation

For comprehensive documentation standards, refer to:
- `/docs/processes/documentation/standards.md` - Complete documentation guidelines
- The "Documentation" section in `CLAUDE.md` at the project root

## Documentation Validation

**IMPORTANT**: Always validate documentation after creating or updating it:

```bash
cd docs
./processes/documentation/validation/validate-docs.sh
```

This script verifies that all documentation follows our standards, including:
- Correct folder and file structure
- Required files for each feature
- Proper content sections
- Implementation prompts in plan documents
- Task list formatting in todo files

## Creating New Feature Documentation

For each new feature:

1. Create a new folder: `/docs/features/feature-name/`
2. Use the templates in `/docs/processes/documentation/templates/docs-template.md` to create:
   - `plan.md` (before development)
   - `feature-name.md` (main documentation)
   - `summary.md` (after implementation)
   - `todo.md` (ongoing task list)
3. Follow the structured format provided in the templates
4. Run the validation script to verify your documentation
5. Fix any issues identified by the validation
6. Update this README.md file with your new documentation section
7. Update `/docs/project/status.md` with the new feature

## Converting to Wiki

This documentation structure is designed to be easily convertible to a wiki system in the future. Each folder represents a wiki section, and each markdown file can become a wiki page.

Last Updated: February 25, 2025 - Major restructuring of documentation organization