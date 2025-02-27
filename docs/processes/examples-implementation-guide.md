# Implementing Professional Releases in Your Project

This guide explains how to implement the professional release workflow in your existing project.

## Prerequisites

- GitHub repository
- Node.js project with package.json
- GitHub Actions enabled

## Step 1: Set Up Branch Protection

1. Go to your repository on GitHub
2. Navigate to Settings > Branches
3. Add branch protection rules for `main` and `develop`:
   - Require pull request reviews before merging
   - Require status checks to pass
   - Prohibit direct pushes
   - Include administrators in restrictions

## Step 2: Install Semantic Release

```bash
npm install --save-dev semantic-release @semantic-release/git @semantic-release/changelog
```

## Step 3: Add Semantic Release Configuration

Create `release.config.js` in your project root:

```javascript
module.exports = {
  branches: [
    'main',
    {name: 'develop', prerelease: 'dev'},
    {name: 'release/*', prerelease: 'rc'}
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github'
  ]
};
```

## Step 4: Add GitHub Workflows

Create the following workflow files:

1. `.github/workflows/pr-validation.yml` - Validates PRs
2. `.github/workflows/semantic-release.yml` - Handles releases
3. `.github/workflows/branch-management.yml` - Manages branch rules

## Step 5: Create Helper Scripts

Add the following scripts to your project:

1. `scripts/create-release.sh` - For starting a new release
2. `scripts/create-hotfix.sh` - For creating hotfixes

## Step 6: Initialize Project Structure

```bash
# Create develop branch
git checkout -b develop main
git push -u origin develop

# Update CHANGELOG.md format
cat > CHANGELOG.md << EOL
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with professional release workflow

## [0.1.0] - $(date +%Y-%m-%d)

### Added
- Initial version
EOL

# Commit changes
git add CHANGELOG.md
git commit -m "chore: initialize changelog for semantic releases"
git push origin develop
```

## Step 7: Train Your Team

1. Share the workflow documentation with your team
2. Hold a training session on:
   - Conventional commits
   - Branch naming
   - PR process
   - Release process
3. Create a quick reference guide for common commands

## Step 8: First Release

1. Create your first release branch:
   ```bash
   ./scripts/create-release.sh
   # Enter version number (e.g., 1.0.0)
   ```

2. Create a PR from the release branch to main
3. Once merged, your first automated release will be created!

## Troubleshooting

- **Permissions Issues**: Make sure GitHub Actions has write permissions in repository settings
- **Failed Releases**: Check the semantic-release logs in GitHub Actions
- **Version Not Bumping**: Ensure your commits follow conventional commit format

## Best Practices

1. Always include the correct type in your commit messages
2. Create small, focused PRs for easier review
3. Maintain the CHANGELOG.md with detailed entries
4. Keep release branches short-lived
5. Always merge hotfixes to both main and develop

## Next Steps

- Set up automated deployment from Git tags
- Implement pre-commit hooks for commit message validation
- Add release notes to your project website or documentation