#!/usr/bin/env node
// setup.js - Set up the project structure

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create project directories
const directories = [
  'src',
  'src/core',
  'src/visualizations',
  'src/processors',
  'src/themes',
  'src/utils',
  'dist',
  'examples',
  'docs',
  'tests',
  'server'
];

console.log('Creating project directories...');
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created ${dir}`);
  } else {
    console.log(`✓ ${dir} already exists`);
  }
});

// Create an empty utils.js file
const utilsPath = path.join(process.cwd(), 'src/utils/utils.js');
if (!fs.existsSync(utilsPath)) {
  fs.writeFileSync(utilsPath, `/**
 * Utility functions for DevDashboard
 */

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Format a date
 * @param {Date|string} date - Date to format
 * @param {Object} options - Format options
 * @param {string} [locale='en-US'] - Locale
 * @returns {string} - Formatted date
 */
export function formatDate(date, options, locale = 'en-US') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, options);
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
export function uniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
`);
  console.log('✓ Created utils.js');
}

// Install dependencies
console.log('\nInstalling dependencies...');
try {
  execSync('npm install d3@7.8.5 --save', { stdio: 'inherit' });
  execSync('npm install @babel/core@7.23.0 @babel/preset-env@7.23.0 @rollup/plugin-babel@6.0.3 @rollup/plugin-commonjs@25.0.4 @rollup/plugin-node-resolve@15.2.1 @rollup/plugin-terser@0.4.3 eslint@8.50.0 express@4.18.2 jest@29.7.0 jsdoc@4.0.2 rollup@3.29.4 rollup-plugin-dts@6.0.2 docdash@2.0.1 --save-dev', { stdio: 'inherit' });
  console.log('✓ Dependencies installed successfully');
} catch (error) {
  console.error('Failed to install dependencies:', error.message);
}

// Create example HTML placeholder
const placeholderHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevDashboard Example</title>
</head>
<body>
  <div id="dashboard"></div>
  <script src="../dist/dev-dashboard.js"></script>
  <script>
    // Example code will go here
  </script>
</body>
</html>`;

const examplePath = path.join(process.cwd(), 'examples/placeholder.html');
if (!fs.existsSync(examplePath)) {
  fs.writeFileSync(examplePath, placeholderHtml);
  console.log('✓ Created example placeholder');
}

// Create simple test placeholder
const testPlaceholder = `// tests/placeholder.test.js

describe('DevDashboard', () => {
  test('placeholder test', () => {
    expect(true).toBe(true);
  });
});`;

const testPath = path.join(process.cwd(), 'tests/placeholder.test.js');
if (!fs.existsSync(testPath)) {
  fs.writeFileSync(testPath, testPlaceholder);
  console.log('✓ Created test placeholder');
}

console.log('\nProject setup complete! 🚀');
console.log('\nNext steps:');
console.log('1. Run "npm run build" to build the library');
console.log('2. Run "npm start" to start the example server');
console.log('3. Open http://localhost:3000/examples in your browser');