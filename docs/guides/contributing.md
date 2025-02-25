# Contributing Guide

This guide provides guidelines for contributing to the Anti-Capitalist Idle Game project.

## Code Contribution Process

1. **Find an Issue to Work On**
   - Check the project's issue tracker for open issues
   - Issues labeled "good first issue" are ideal for new contributors

2. **Fork the Repository**
   - Fork the repository to your GitHub account
   - Clone your fork to your local machine

3. **Create a Feature Branch**
   - Create a branch for your changes with a descriptive name
   - Example: `feature/add-new-resource-type` or `fix/game-loop-performance`

4. **Make Your Changes**
   - Follow the [style guide](style-guide.md)
   - Write tests for your changes
   - Update documentation as needed

5. **Run Tests and Validation**
   - Run tests to ensure everything works
   - Validate documentation if you've made documentation changes

6. **Commit Your Changes**
   - Use descriptive commit messages
   - Reference the issue number in your commit message
   - Example: "Add new resource type (#42)"

7. **Submit a Pull Request**
   - Push your changes to your fork
   - Submit a pull request to the main repository
   - Provide a clear description of your changes

8. **Respond to Feedback**
   - Address any feedback from code reviews
   - Make additional changes if requested
   - Your pull request will be merged when approved

## Documentation Contribution

When adding or updating documentation:

1. **Follow Documentation Standards**
   - Follow the standards in `/docs/processes/documentation/standards.md`
   - Use the templates in `/docs/processes/documentation/templates/`

2. **Validate Documentation**
   - Run the validation script:
     ```bash
     cd docs
     ./processes/documentation/validation/validate-docs.sh
     ```
   - Fix any issues identified by the validation script

3. **Update Related Documentation**
   - Update the README.md file if necessary
   - Update any related documentation

## Testing Contribution

When contributing tests:

1. **Follow Testing Standards**
   - Follow the standards in `/docs/processes/testing/standards.md`
   - Use the templates in `/docs/processes/testing/templates/`

2. **Organize Tests Properly**
   - Place unit tests alongside the code being tested
   - Place integration tests in the appropriate integration test files
   - Use descriptive test names

3. **Run the Full Test Suite**
   - Ensure all tests pass before submitting your changes
   - Fix any tests that fail

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help create a positive environment for all contributors

## Questions and Help

If you have questions or need help with contributing:

- Check the documentation in the `/docs/` directory
- Ask for help in the project communication channels