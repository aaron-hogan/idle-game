# Pull Request

## Description
<!-- Provide a clear description of the changes in this PR -->

## Type of Change
- [ ] Bug fix (fix: ...)
- [ ] New feature (feat: ...)
- [ ] Breaking change (feat!: ...)
- [ ] Documentation update (docs: ...)
- [ ] Refactoring (refactor: ...)
- [ ] Test improvement (test: ...)
- [ ] Build/CI process update (ci: ...)
- [ ] Chore (chore: ...)

## Related Issues
<!-- Reference any related issues (e.g., "Fixes #123") -->

## Implementation Details
<!-- Briefly explain your implementation approach -->

## Changelog Entry
<!-- ⚠️ CRITICAL: This section will be automatically included in the CHANGELOG.md file ⚠️ -->
<!-- Choose the most appropriate section(s) for your changes and delete the rest -->

### Added
<!-- List new features or functionality added -->
<!-- Example: - New login feature with support for OAuth -->

### Changed
<!-- List changes to existing functionality -->
<!-- Example: - Improved performance of dashboard rendering -->

### Fixed
<!-- List bug fixes -->
<!-- Example: - Fixed authentication token expiration issue -->

### Removed
<!-- List features or functionality that was removed -->
<!-- Example: - Removed deprecated API endpoint -->

## Testing
<!-- Describe the testing performed to validate changes -->

## ⚠️ Required Validation Checklist ⚠️

### Build-Time Validation
- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] Application builds successfully (`npm run build`)

### Runtime Validation (CRITICAL)
- [ ] Application launches without console errors
- [ ] Console remains clear during:
  - [ ] Initial application load
  - [ ] User interactions
  - [ ] Component mount/unmount cycles
  - [ ] State transitions
- [ ] All user flows function correctly
- [ ] No regressions in existing functionality

### Documentation and Quality
- [ ] Documentation is updated as needed
- [ ] PR title follows conventional commit format (e.g., "feat: add login feature")
- [ ] Changelog Entry section above is filled out appropriately
- [ ] No debug/console logs in production code
- [ ] Branch is updated with main

## Screenshots/Recordings
<!-- If applicable, add screenshots or recordings to help explain the changes -->

## Additional Notes
<!-- Any additional information reviewers should know -->

> ⚠️ **CRITICAL**: PR title MUST follow conventional commit format (feat:, fix:, etc.) for automatic versioning to work correctly.