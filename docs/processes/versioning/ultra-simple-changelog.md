# Ultra-Simple Changelog Process

This document explains our ultra-simple changelog process that makes it impossible to miss changelog entries.

## How It Works

1. **First Line Rule**:
   - The first line after the PR title in the description becomes the changelog entry
   - No special formatting required
   - No sections needed
   - Visually indicated by a warning label in the PR template

2. **Automatic Categorization**:
   - Based on PR title prefix:
     - `feat:` → Added
     - `fix:` → Fixed
     - `docs:` → Documentation
     - `remove:` → Removed
     - All others → Changed

3. **Fallback to PR Title**:
   - If no content is found in the PR description
   - Extracts the content after the prefix (`feat: Add login` → `Add login`)

## Pull Request Process

1. **Create PR with Conventional Title**:
   ```
   feat: Add new login system
   fix: Resolve auth tokens not refreshing
   ```

2. **First Line is Your Changelog Entry**:
   ```
   # Pull Request

   ## ⚠️ FIRST LINE BELOW IS YOUR CHANGELOG ENTRY ⚠️
   Added login system with OAuth support and remember me functionality
   
   (rest of PR description)
   ```

3. **On Merge**:
   - First line will be automatically added to CHANGELOG.md
   - Categorized based on PR title prefix

## Example

### PR Title
```
feat: Add user authentication
```

### PR Description
```
# Pull Request

## ⚠️ FIRST LINE BELOW IS YOUR CHANGELOG ENTRY ⚠️
Added user authentication with Google OAuth and GitHub integration

## Description
This PR implements the user authentication system...
```

### Resulting Changelog Entry
```
### Added
- Added user authentication with Google OAuth and GitHub integration
```

## Benefits

1. **Impossible to Miss**: Extraction point clearly marked with warnings
2. **No Special Formatting**: No need to remember section formats
3. **Automatic Fallback**: Uses PR title if needed
4. **Clear Visual Placement**: PR template clearly shows where to put entry
5. **Foolproof Design**: Cannot fail due to formatting errors

## Best Practices

1. Make the first line descriptive and standalone
2. Write from a user's perspective, not a developer's
3. Use complete sentences
4. Include all relevant information in that single line
5. Keep it concise but comprehensive

## Technical Implementation

The extraction script in our workflow:

1. Skips heading lines, empty lines, and warning text
2. Takes the first remaining line as the changelog entry
3. Categorizes based on PR title prefix
4. Falls back to PR title if no entry found
5. Formats the entry for the changelog

This approach is extremely robust and requires minimal cognitive load from contributors.