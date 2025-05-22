# Contributing to DevDashboard

Thank you for your interest in contributing to DevDashboard! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Submitting Changes](#submitting-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Adding Visualizations](#adding-visualizations)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

Before you begin:

- Check the [issues](https://github.com/yourusername/dev-dashboard/issues) page for open issues that you might be interested in working on.
- If you have a new feature or bug fix in mind, please create an issue first to discuss it.

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally
    ```bash
    git clone https://github.com/your-username/dev-dashboard.git
    cd dev-dashboard
    ```
3. Install dependencies
    ```bash
    npm install
    ```
4. Set up the development environment
    ```bash
    npm run dev
    ```
5. Start the example server
    ```bash
    npm start
    ```

## Submitting Changes

1. Create a new branch for your changes
    ```bash
    git checkout -b feature/your-feature-name
    ```
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes with a clear commit message
    ```bash
    git commit -m "Add feature: description of your changes"
    ```
5. Push your branch to your fork
    ```bash
    git push origin feature/your-feature-name
    ```
6. Submit a pull request to the main repository

## Pull Request Process

1. Ensure your code passes all tests (`npm test`)
2. Update the documentation if needed
3. The PR title should clearly describe the changes
4. Link any relevant issues in the PR description
5. Your PR will be reviewed by maintainers, who may request changes
6. Once approved, your PR will be merged

## Coding Standards

- Follow the existing code style
- Use descriptive variable and function names
- Comment complex code sections
- Write JSDoc comments for all public API methods and classes
- Follow the principles of clean code and SOLID design

## Adding Visualizations

To add a new visualization type:

1. Create a new file in the `src/visualizations/` directory
2. Extend the `BaseVisualization` class
3. Implement the required methods (`_init()`, `render()`, etc.)
4. Register your visualization in `src/index.js`
5. Add tests for your visualization
6. Document your visualization in the README.md
7. Add an example to demonstrate your visualization

Example structure for a new visualization:

```javascript
// src/visualizations/my-visualization.js
import BaseVisualization from './base';

class MyVisualization extends BaseVisualization {
  _init() {
    super._init();
    // Your initialization code
  }
  
  render() {
    // Your rendering code
  }
}

export default MyVisualization;
```

## Testing

- Write unit tests for all new code
- Make sure all tests pass before submitting a PR
- Run tests with `npm test`
- Aim for high test coverage

## Documentation

- Update the README.md if you're adding new features or changing existing ones
- Add JSDoc comments to all public methods and classes
- Generate documentation with `npm run docs`
- Include examples of how to use your changes

Thank you for contributing to DevDashboard!