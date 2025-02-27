# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Enhanced GitHub automation scripts:
  - Draft PR support with `create-pr.sh --draft`
  - Custom base branch support with `create-pr.sh --base <branch>`
  - Improved CI integration in `check-pr.sh` with detailed status and ability to re-run checks
  - Conflict detection and resolution in `merge-pr.sh --resolve-conflicts`
  - Protection against uncommitted changes
  - Warnings and confirmations for working directory modifications
  - Option to stay on current branch after merging
- GitHub automation scripts specifically designed for AI pair programming:
  - `create-branch.sh` - Safely creates properly named feature branches
  - `create-pr.sh` - Creates standardized pull requests from feature branches
  - `check-pr.sh` - Checks PR status in JSON format for easy parsing
  - `merge-pr.sh` - Safely handles PR merging with validation
- Win and lose conditions for a complete gameplay loop
- New "Corporate Oppression" resource that increases over time
- Visual indicator showing power vs. oppression balance
- End game modal for both victory and defeat scenarios
- Game state tracking for win/lose conditions
- Enhanced documentation for preventing direct work on main branch
- New AI assistant guide for safe repository workflows
- Centralized game balance configuration system with `/src/config/gameBalance.ts`
- Documentation for game balance configuration in `/docs/features/game-balance/`
- Helper functions for calculating resource generation, upgrade costs and click power
- GitHub Actions CI workflows for automated testing, building, and validation
- PR validation workflow to enforce project standards and conventions
- Dependency management workflow for security and update monitoring
- Comprehensive documentation for CI/CD workflows and contribution guidelines
- Temporary CI workarounds for existing codebase issues with migration plan
- Updated CLAUDE.md with CI/CD workflow information and links to documentation

### Changed
- Redesigned movement balance display - now integrated directly into the top resource bar
- Updated styling for the Power and Oppression counters with appropriate green/red progress bars
- Improved header layout for better visibility of critical resources
- Refactored resource manager to use centralized game balance configuration
- Modified game end conditions to use configurable thresholds
- Extracted hardcoded game balance values to configuration file

### Fixed
- Day counter not advancing and progress bar not showing progress
- Choppy progress bar animation in day counter
- Day counter and debug panel showing different day values
- Day 1 incorrectly starting at 50% progress
- Oppression resource displaying incorrect generation rate (+0.1/s vs actual +0.05/s)
- Several failing tests across the test suite:
  - Fixed ResourceDisplay tests to work with Counter component
  - Added TextEncoder/TextDecoder polyfill for React Router tests
  - Updated OfflineProgressModal tests to account for animation timing
  - Corrected structure.test.ts to match actual project structure
  - Fixed type errors and string matching in GameTimer tests

## [0.2.0] - 2025-02-26

### Added
- CHANGELOG.md to track all project changes

### Changed
- Enhanced git workflow documentation with improved commit guidelines
- Updated safe workflow checklist to include CHANGELOG maintenance
- Improved release process to incorporate CHANGELOG updates

## [0.1.0] - 2025-02-26

### Added
- Initial game implementation
- Core resource management system
- Building system with worker assignment
- Four-stage progression system
- Debug tools for development

### Changed
- Enhanced documentation standards
- Improved UI responsiveness

### Fixed
- Console spam and offline progress errors
- Resource upgrade calculation issues