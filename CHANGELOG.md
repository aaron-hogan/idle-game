# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New test guidelines documentation to standardize testing practices
  - Guidelines for testing managers with proper singleton patterns
  - Examples for mocking Redux state in tests
  - Best practices for test cleanup and isolation

### Fixed
- Fixed linting errors in multiple files:
  - Replaced @ts-ignore comments with proper @ts-expect-error in resourceUtils.ts
  - Removed unused imports and variables in App.tsx and App.test.tsx
  - Replaced require-style imports with ES module imports
  - Removed unused screen imports in test files
  - Updated @ts-ignore comments to @ts-expect-error with explanations in test files (gameSystemCoherenceTest.test.ts, testUtils.ts)

## [0.6.1] - 2025-02-28

### Fixed
- Remove wiki directory completely from git tracking
- Updated test suite to use proper dependency injection pattern
  - ResourceManager tests now use resetSingleton utility and complete mock state
  - OppressionSystem tests fixed to use the correct resource state structure
  - SaveManager tests updated with proper action creator references
  - BuildingManager, EventManager, and WorkerManager tests now follow consistent pattern
- Added consistent testing pattern across all manager tests
  - Reset singletons properly between tests
  - Created helper functions to initialize managers with dependencies
  - Improved action creator mocking to avoid circular references
  - Added complete mock state for reliable test execution
- Fixed integration tests by updating test structure for proper dependency injection
  - Updated `gameCore.integration.test.tsx` to use proper BuildingManager initialization
  - Updated `workers.integration.test.tsx` to use proper WorkerManager initialization 
  - Rewrote `tasks.integration.test.ts` to use simpler mocking approach
  - Fixed outdated import paths in integration tests
- Cleaned up test suite by removing outdated tests and fixing App component tests
  - Removed skipped tests in GameLoop test files that were testing outdated functionality
  - Fixed App component tests by properly mocking the events state
  - Improved test maintainability by removing obsolete test cases
  - Ensured manager singletons are properly reset between tests
### Added
- New script to detect and fix empty versions in CHANGELOG
- Improved workflow documentation for changelog maintenance
- Additional changelog validation in CI/CD pipeline
## [0.5.6] - 2025-02-27

### Added
- Retrospective incident report for process violation with improper direct merge
- Documentation of process failure and preventative measures

## [0.5.5] - 2025-02-27

### Changed
- Automated version bump by GitHub Actions workflow
- Test of version tag creation with GitHub Actions

## [0.5.4] - 2025-02-27

### Added
- Enhanced versioning scripts to properly move changes from Unreleased to new version
- Added automatic "No unreleased changes" placeholder after versioning

## [0.5.3] - 2025-02-27

### Added
- Branch and PR cleanup scripts:
  - cleanup-branches.sh: Tool for safely deleting merged branches
  - cleanup-stale-prs.sh: Tool for managing and closing stale PRs
- Added branch-management.md documentation for branch and PR management

### Fixed
- Updated test files to handle tutorial state in Redux store
- Fixed type issues in TutorialManager to use RootState instead of AppState
- Resolved Redux store initialization in various test files


## [0.5.2] - 2025-02-27

### Changed
- Test release for validating GitHub Actions workflow
- Automated version created during workflow testing

## [0.5.1] - 2025-02-27

### Added
- Enhanced README.md with additional development commands for linting and type checking
- Added detailed documentation for PR validation workflow improvements and case-sensitivity fix
- Non-interactive mode for release and hotfix scripts
- Command-line parameters for fully automated versioning 
- AI-friendly automation options to avoid prompt interruptions
- Enhanced documentation for non-interactive script usage
- Package.json convenience scripts for common automation tasks
- New AI-optimized Git scripts with token-efficient JSON output:
  - `.github/scripts/ai/branch.sh` - Token-efficient branch creation
  - `.github/scripts/ai/pr.sh` - Token-efficient PR creation 
  - `.github/scripts/ai/check.sh` - Token-efficient PR status checking
  - `.github/scripts/ai/merge.sh` - Token-efficient PR merging
- Documentation for token-efficient Git workflow in CLAUDE.md
- Updated GitHub process documentation to match current automated workflows
- Improved instructions for AI assistants when working with PRs and versioning

### Changed
- Updated release process documentation with automation guidelines
- Added specific automation instructions for AI assistants
- Optimized scripts to better integrate with GitHub Actions workflows
- Refactored release and hotfix scripts to defer versioning to GitHub Actions
- Improved PR labeling for version type detection
- Simplified workflow with clearer division between local and remote responsibilities
- Simplified versioning-and-releases.md to focus on the current automated process
- Updated PR workflow to include version labels and changelog instructions
- Modernized CLAUDE.md instructions for GitHub workflows
- Removed validation tests from auto-versioning workflow to improve reliability

### Fixed
- Fixed YAML syntax issue in PR validation workflow by completely redesigning the workflow structure
- Removed redundant changelog check workflow to prevent duplication
- Fixed regex patterns in PR validation workflow to use more compatible syntax
- Made PR title validation case-insensitive to accept both "fix:" and "Fix:" format
- Fixed GitHub Actions workflow permission issue for auto-versioning
- Fixed auto-version workflow to handle non-fast-forward push errors
- Enhanced auto-versioning to properly manage tags on latest commits
- Fixed ProgressionManager tests to properly initialize with store

### Removed
- Legacy example semantic-release configuration
- Outdated references to non-existent GitHub scripts


## [0.5.0-4] - 2025-02-27

### Added
- Comprehensive documentation for professional release process
- Detailed examples of complete release workflow
- Enhanced script documentation with usage examples

### Fixed
- Updated hello-world.ts message to reference professional release workflow

### Changed
- Cleaned up GitHub Actions workflows by removing unused example workflows
- Removed redundant semantic-release workflow in favor of auto-version.yml
- Updated CI workflow to properly run tests, linting, and type checking
- Removed empty examples directory from GitHub Actions

## [0.5.0-3] - 2025-02-27

### Added
- Professional release process with GitFlow-inspired branching strategy
- Semantic release automation with conventional commits
- Helper scripts for release and hotfix management 
- GitHub Actions workflows for automated versioning and releases
- Enhanced AI-optimized workflow scripts for safe branch and PR management
- Added support for patch-level versioning (X.Y.Z-N format)
- Created GitHub Action for automated versioning at merge time
- Updated versioning documentation with new automated workflow
- Enhanced PR workflow with version label support
- Added hello-world.ts with test for verifying the automated versioning process
- Implemented basic tutorial and help system:
  - Tutorial modals with step-by-step guidance for new players
  - Contextual help tooltips for game elements
  - Tutorial manager singleton for handling tutorial state
  - Tutorial settings in the Settings page
  - Redux state management for tutorial progress
  - First-time user detection and welcome tutorial

### Changed 
- Updated script documentation to clarify proper versioning practices
- Improved safe workflow checklist with version selection guidance
- Modified changelog check to enforce format rather than versioning
- Revised versioning process to keep changes in Unreleased until merge

## [0.5.0-2] - 2025-02-27

### Fixed
- Fixed test issue

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
- New script to detect and fix empty versions in CHANGELOG
- Improved workflow documentation for changelog maintenance
- Additional changelog validation in CI/CD pipeline
## [0.5.6] - 2025-02-27

### Added
- Retrospective incident report for process violation with improper direct merge
- Documentation of process failure and preventative measures

## [0.5.5] - 2025-02-27

### Changed
- Automated version bump by GitHub Actions workflow
- Test of version tag creation with GitHub Actions

## [0.5.4] - 2025-02-27

### Added
- Enhanced versioning scripts to properly move changes from Unreleased to new version
- Added automatic "No unreleased changes" placeholder after versioning

## [0.5.3] - 2025-02-27

### Added
- Branch and PR cleanup scripts:
  - cleanup-branches.sh: Tool for safely deleting merged branches
  - cleanup-stale-prs.sh: Tool for managing and closing stale PRs
- Added branch-management.md documentation for branch and PR management

### Fixed
- Updated test files to handle tutorial state in Redux store
- Fixed type issues in TutorialManager to use RootState instead of AppState
- Resolved Redux store initialization in various test files


## [0.5.2] - 2025-02-27

### Changed
- Test release for validating GitHub Actions workflow
- Automated version created during workflow testing

## [0.5.1] - 2025-02-27

### Added
- Enhanced README.md with additional development commands for linting and type checking
- Added detailed documentation for PR validation workflow improvements and case-sensitivity fix
- Non-interactive mode for release and hotfix scripts
- Command-line parameters for fully automated versioning 
- AI-friendly automation options to avoid prompt interruptions
- Enhanced documentation for non-interactive script usage
- Package.json convenience scripts for common automation tasks
- New AI-optimized Git scripts with token-efficient JSON output:
  - `.github/scripts/ai/branch.sh` - Token-efficient branch creation
  - `.github/scripts/ai/pr.sh` - Token-efficient PR creation 
  - `.github/scripts/ai/check.sh` - Token-efficient PR status checking
  - `.github/scripts/ai/merge.sh` - Token-efficient PR merging
- Documentation for token-efficient Git workflow in CLAUDE.md
- Updated GitHub process documentation to match current automated workflows
- Improved instructions for AI assistants when working with PRs and versioning

### Changed
- Updated release process documentation with automation guidelines
- Added specific automation instructions for AI assistants
- Optimized scripts to better integrate with GitHub Actions workflows
- Refactored release and hotfix scripts to defer versioning to GitHub Actions
- Improved PR labeling for version type detection
- Simplified workflow with clearer division between local and remote responsibilities
- Simplified versioning-and-releases.md to focus on the current automated process
- Updated PR workflow to include version labels and changelog instructions
- Modernized CLAUDE.md instructions for GitHub workflows
- Removed validation tests from auto-versioning workflow to improve reliability

### Fixed
- Fixed YAML syntax issue in PR validation workflow by completely redesigning the workflow structure
- Removed redundant changelog check workflow to prevent duplication
- Fixed regex patterns in PR validation workflow to use more compatible syntax
- Made PR title validation case-insensitive to accept both "fix:" and "Fix:" format
- Fixed GitHub Actions workflow permission issue for auto-versioning
- Fixed auto-version workflow to handle non-fast-forward push errors
- Enhanced auto-versioning to properly manage tags on latest commits
- Fixed ProgressionManager tests to properly initialize with store

### Removed
- Legacy example semantic-release configuration
- Outdated references to non-existent GitHub scripts


## [0.5.0-4] - 2025-02-27

### Added
- Comprehensive documentation for professional release process
- Detailed examples of complete release workflow
- Enhanced script documentation with usage examples

### Fixed
- Updated hello-world.ts message to reference professional release workflow

### Changed
- Cleaned up GitHub Actions workflows by removing unused example workflows
- Removed redundant semantic-release workflow in favor of auto-version.yml
- Updated CI workflow to properly run tests, linting, and type checking
- Removed empty examples directory from GitHub Actions

## [0.5.0-3] - 2025-02-27

### Added
- Professional release process with GitFlow-inspired branching strategy
- Semantic release automation with conventional commits
- Helper scripts for release and hotfix management 
- GitHub Actions workflows for automated versioning and releases
- Enhanced AI-optimized workflow scripts for safe branch and PR management
- Added support for patch-level versioning (X.Y.Z-N format)
- Created GitHub Action for automated versioning at merge time
- Updated versioning documentation with new automated workflow
- Enhanced PR workflow with version label support
- Added hello-world.ts with test for verifying the automated versioning process
- Implemented basic tutorial and help system:
  - Tutorial modals with step-by-step guidance for new players
  - Contextual help tooltips for game elements
  - Tutorial manager singleton for handling tutorial state
  - Tutorial settings in the Settings page
  - Redux state management for tutorial progress
  - First-time user detection and welcome tutorial

### Changed 
- Updated script documentation to clarify proper versioning practices
- Improved safe workflow checklist with version selection guidance
- Modified changelog check to enforce format rather than versioning
- Revised versioning process to keep changes in Unreleased until merge

## [0.5.0-2] - 2025-02-27

### Fixed
- Fixed test issue

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
