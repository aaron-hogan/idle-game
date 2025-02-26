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

### Fixed
- Day counter not advancing and progress bar not showing progress
- Choppy progress bar animation in day counter
- Day counter and debug panel showing different day values
- Day 1 incorrectly starting at 50% progress

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