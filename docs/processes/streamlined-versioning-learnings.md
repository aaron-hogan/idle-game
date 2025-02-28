# Streamlined Versioning: Learnings & Improvements

This document captures the key learnings and improvements we've made to the streamlined versioning system.

## Problem Summary

Our initial implementation of the streamlined versioning system had several issues:

1. **YAML Syntax Errors**: The workflow file had recurring YAML syntax errors with multiline strings and shell variables.
2. **Changelog Extraction Failures**: The extraction of changelog entries from PR descriptions was unreliable.
3. **Formatting Issues**: The CHANGELOG.md file had inconsistent formatting and duplicate placeholders.

## Key Learnings

### YAML Workflow Files

1. **Multiline Strings**: YAML has specific requirements for multiline strings that can conflict with shell syntax.
   - **Bad**: Using inline awk/sed with newlines in string literals.
   - **Better**: Moving complex logic to separate script files created during workflow execution.

2. **String Escaping**: Shell variables and special characters can cause YAML parsing errors.
   - **Bad**: Complex inline command chains with variables containing special characters.
   - **Better**: Using heredocs with single quotes to prevent YAML interpretation problems.

3. **Safer Text Processing**:
   - **Bad**: In-place string manipulation with complex pipes and redirects.
   - **Better**: Using temporary files for text processing instead of relying on shell variables.

### Changelog Management

1. **PR Description Extraction**: When extracting content from PR descriptions:
   - Be robust against varying formats (e.g., changelog at the end of PR description).
   - Have reliable fallbacks when expected content is missing.
   - Use clear and simple pattern matching rather than complex regex.

2. **CHANGELOG.md Updates**:
   - Use careful section-based updates to avoid duplicate content.
   - Be precise about where new entries are inserted.
   - Consider the specific format of CHANGELOG.md when inserting new entries.

3. **Error Handling**:
   - Add explicit error messages when key elements (like the Unreleased section) are missing.
   - Provide clear feedback on what was changed and what went wrong.

## Improvements Made

### Workflow Structure Improvements

1. **Isolated Script Approach**:
   - Created separate bash scripts using heredocs for complex logic.
   - Avoided inline complex commands that break YAML syntax.
   - Used temporary files for safer text processing.

2. **Robust Changelog Extraction**:
   - Implemented multiple extraction methods with fallbacks.
   - Added better detection of PR description sections.
   - Improved handling of special characters and formatting.

3. **Simplified CHANGELOG.md Updates**:
   - Improved section-based updates to avoid duplication.
   - Made the insertion of new content more precise.
   - Added comments explaining the update process.

### Validation Improvements

1. **PR Validation**:
   - Made the validation more robust and informative.
   - Added better error messages to guide developers.
   - Improved the detection of PR description sections.

2. **Format Validation**:
   - Added checks to ensure PR titles follow the conventional format.
   - Improved detection of changelog entries in PR descriptions.
   - Added clear guidance on how to fix validation issues.

## Best Practices for Future Development

1. **Writing Workflows**:
   - Use separate script files for complex logic.
   - Avoid multiline string literals in YAML files.
   - Test workflow files with GitHub's workflow linter before committing.

2. **PR Descriptions**:
   - Follow the PR template carefully.
   - Include a clear "## Changelog Entry" section with appropriate subsections.
   - Ensure each subsection (### Added, ### Fixed, etc.) has actual content.

3. **Version Management**:
   - Use PR titles to determine version bumps:
     - `feat:` for new features (minor version bump)
     - `fix:` for bug fixes (patch version bump)
     - `feat!:` for breaking changes (major version bump)
   - Let the automation handle CHANGELOG.md updates and version bumping.

## Testing Workflow Changes

When making changes to GitHub workflow files:

1. **Syntax Validation**:
   - Use [GitHub Actions Linter](https://github.com/rhysd/actionlint) locally.
   - Check for YAML syntax errors before pushing.
   - Validate shell commands in isolation.

2. **Incremental Updates**:
   - Make small, focused changes.
   - Use descriptive commit messages to track what was changed.
   - Test each component individually if possible.

3. **Error Recovery**:
   - Have a plan for reverting failed workflow changes.
   - Keep notes on what worked and what didn't.
   - Document the reasons for specific changes.

## Monitoring & Maintenance

To ensure the versioning system continues to work:

1. **Regular Audits**:
   - Periodically check the CHANGELOG.md format.
   - Ensure version numbers are being bumped correctly.
   - Verify that tags are being created properly.

2. **User Education**:
   - Ensure all team members understand the PR workflow.
   - Document the importance of conventional PR titles.
   - Provide examples of well-formatted PR descriptions.

3. **System Improvements**:
   - Consider adding more automated tests for the workflow.
   - Add monitoring for failed workflow runs.
   - Collect feedback on the process from team members.

By following these learnings and best practices, we can ensure our streamlined versioning system continues to work reliably and efficiently.