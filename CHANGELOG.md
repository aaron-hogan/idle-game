# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2025-02-27

### Added
- Added Process Failure Analysis document with critical learnings from dependency injection implementation
- Added enhanced Pre-PR Validation Checklist to safe workflow process
- Created GitHub Pull Request template with validation requirements
- Added runtime validation requirements to CLAUDE.md and documentation
- Added DOCS_MANAGEMENT.md explaining documentation git exclusion policy
- Created add-doc-exception.sh script for managing documentation git exceptions
- Added .gitattributes file to properly handle documentation file exclusions
- Created git_exceptions.md to track documentation files explicitly added to git
- Added setup-git-hooks.sh script for automating validation via git hooks
- Added prepare-for-main.sh script to automate branch preparation for PRs
- Added sync-feature-todos.sh script to automate todo synchronization
- Added comprehensive documentation for automation scripts
- Added resolving-merge-conflicts.md with guidelines and case studies

### Changed
- Enhanced .gitignore with better comments and organization
- Updated documentation README.md with git exclusion information
- Expanded scripts/README.md with new automation tools

## [0.5.0-1] - 2025-02-27

### Added
- Added support for patch-level versioning in CHANGELOG.md (X.Y.Z-N format)
- Updated bump-version.sh to support patch-level version format
- Enhanced prepare-for-main.sh with patch-level versioning option

### Changed
- Improved version calculation logic to handle patch-level increments
- Updated script documentation to explain patch-level versioning


## [0.4.0] - 2025-02-27

### Added
- Implemented dependency injection for all manager classes to reduce tight coupling
- Added store injection to EventManager, SaveManager, and WorkerManager
- Enhanced ResourceManager and BuildingManager with robust backward compatibility
- Created comprehensive implementation pattern for future manager refactoring
- Added detailed implementation documentation for manager dependency injection
- Created documentation for dependency injection approach and debugging lessons

### Changed
- Updated App initialization to support both direct store and dependency injection
- Improved type safety of manager classes with proper interfaces and type imports

### Fixed
- Fixed initialization order issues in EventManager and SaveManager
- Added null safety checks in manager methods
- Resolved variable naming inconsistencies (structureActions vs structuresActions)
- Fixed state initialization order in EventManager
- Added safety checks for accessing state properties

## [0.3.0] - 2025-02-26

### Added
- Enhanced GitHub automation scripts:
  - Draft PR support with `create-pr.sh --draft`
  - Custom base branch support with `create-pr.sh --base <branch>`
  - Improved CI integration with detailed status and ability to re-run checks
  - Conflict detection and resolution in merge process
- GitHub automation scripts specifically designed for AI pair programming
- Win and lose conditions for a complete gameplay loop
- New "Corporate Oppression" resource that increases over time
- Visual indicator showing power vs. oppression balance
- End game modal for both victory and defeat scenarios
- Game state tracking for win/lose conditions
- Centralized game balance configuration system
- Helper functions for calculating resource generation, upgrade costs and click power
- GitHub Actions CI workflows for automated testing, building, and validation
- PR validation workflow to enforce project standards and conventions
- Dependency management workflow for security and update monitoring
- Comprehensive documentation for CI/CD workflows

### Changed
- Redesigned movement balance display - now integrated into the top resource bar
- Updated styling for the Power and Oppression counters with appropriate progress bars
- Improved header layout for better visibility of critical resources
- Refactored resource manager to use centralized game balance configuration
- Modified game end conditions to use configurable thresholds
- Extracted hardcoded game balance values to configuration file

### Fixed
- Day counter not advancing and progress bar not showing progress
- Choppy progress bar animation in day counter
- Day counter and debug panel showing different day values
- Day 1 incorrectly starting at 50% progress
- Oppression resource displaying incorrect generation rate
- Several failing tests across the test suite
  - Fixed ResourceDisplay tests to work with Counter component
  - Added TextEncoder/TextDecoder polyfill for React Router tests
  - Updated test files to account for animation timing
  - Corrected structure tests to match actual project structure

## [0.2.5] - 2025-02-26

### Added
- Added scripts directory with validate-docs.js utility
- Added logs directory for organizing CI and test logs
- Created comprehensive project structure reorganization plan
- Added README files for all documentation directories
- Enhanced documentation for preventing direct work on main branch
- New AI assistant guide for safe repository workflows

### Changed
- Consolidated root folder structure for better organization
- Moved documentation files to appropriate directories
- Added comprehensive README files for new directories
- Improved PR workflow documentation with explicit communication requirements
- Enhanced .gitignore to exclude logs, environment files, editor artifacts, and secrets

### Fixed
- Fixed TypeError in GameLoop by adding support for flat resource structure
- Optimized Redux selectors to prevent unnecessary rerenders
- Resolved "Selector unknown returned a different result" warning
- Added memoization to Object.values calls in selectors
- Fixed progression selectors to use proper memoization with createSelector
- Optimized milestone, achievement, and stage selectors
- Added missing import for selectStageByCurrentStage in ProgressionManager
- Implemented enhanced memoization for component selectors
- Created reusable selector utilities in redux/utils.ts
- Fixed infinite update loop in MilestoneProgressStrip component
- Fixed EventPanel selector warning
- Removed misleading initialization warnings
- Simplified console logs to minimum necessary messages
- Fixed browser errors by removing problematic process.env references
- Fixed entire test suite to bring all tests to passing status

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
