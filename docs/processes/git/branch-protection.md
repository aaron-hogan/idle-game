# Branch Protection Rules and Configuration

This document outlines the branch protection configuration for our repository, focusing on ensuring code quality and preventing direct pushes to critical branches.

## Protected Branches

The following branches are protected in our repository:

- `main` - Primary development branch
- `release/*` - Release branches

## Protection Rules for `main` Branch

### Required Rules

1. **Require pull request reviews before merging**
   - At least 1 approval required
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from Code Owners if applicable

2. **Require status checks to pass before merging**
   - Required checks:
     - CI build
     - All tests passing
     - Type checking
     - Linting
   - Status checks must be completed before merging
   - Require branches to be up to date before merging

3. **Require conversation resolution before merging**
   - All conversations must be resolved before a PR can be merged

### Additional Protections

1. **Restrict who can push to matching branches**
   - Only organization administrators and designated maintainers

2. **Include administrators**
   - Administrators are bound by the same restrictions as other contributors

3. **Allow force pushes**
   - Not allowed for anyone

4. **Allow deletions**
   - Not allowed for anyone

## Protection Rules for `release/*` Branches

Release branches have the same protections as the main branch, with additional requirements:

1. **Additional required status checks**
   - Production build verification
   - All browser compatibility tests passing
   - Security scanning passing

2. **Require more reviewers**
   - At least 2 approvals required

## GitHub Branch Protection Configuration

To set up these protections in GitHub:

1. Navigate to the repository settings
2. Select "Branches" from the left menu
3. Under "Branch protection rules," click "Add rule"
4. Enter the branch name pattern (e.g., `main` or `release/*`)
5. Configure the protection settings as described above
6. Click "Create" or "Save changes"

## Commit Signature Verification

We encourage commit signature verification to enhance security:

1. Verify all commits with GPG or SSH signatures
2. Configure your local git client for signing:
   ```bash
   git config --global commit.gpgsign true
   ```

## Automated Branch Protection Verification

A scheduled GitHub Action runs weekly to verify that branch protections are correctly configured and have not been accidentally modified. If any issues are detected, maintainers are automatically notified.

## Verifying Branch Protection Status

To verify that branch protections are correctly configured:

1. Navigate to the repository settings
2. Select "Branches" from the left menu
3. Review the protection rules to ensure they match this document

If protections are not correctly configured, please notify the repository administrators immediately.

## Bypassing Branch Protection (Emergency Only)

In genuine emergency situations, administrators may need to bypass branch protections. This should only be done in critical situations and requires:

1. Documented approval from at least two senior team members
2. Immediate notification to the entire development team
3. Post-incident review documenting:
   - Why the bypass was necessary
   - What changes were made
   - How to prevent the need for bypassing in the future

## Protection Status Monitoring

The branch protection status is monitored through:

1. Weekly automated checks
2. Pull request validation workflows
3. Administrative review during sprint retrospectives