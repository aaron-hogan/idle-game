# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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