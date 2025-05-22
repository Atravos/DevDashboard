// rollup.config.js - CommonJS version
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');

// Banner for the top of generated files
const banner = `/**
 * DevDashboard - Developer Productivity Metrics Visualization Library
 * v0.1.0
 * 
 * @license MIT
 * Copyright ${new Date().getFullYear()} Your Name
 */`;

// Main library build configurations
module.exports = [
  // ESM build (keep d3 as external)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/dev-dashboard.esm.js',
      format: 'esm',
      banner,
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ],
    external: ['d3']
  },
  
  // UMD build (bundle d3 instead of keeping external)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/dev-dashboard.js',
      format: 'umd',
      name: 'DevDashboard',
      banner,
      sourcemap: true,
      globals: {
        d3: 'D3'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })
    ]
    // Removed 'external' to bundle d3 into the library
  },
  
  // Minified UMD build (bundle d3 instead of keeping external)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/dev-dashboard.min.js',
      format: 'umd',
      name: 'DevDashboard',
      banner,
      sourcemap: true,
      globals: {
        d3: 'D3'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
    // Removed 'external' to bundle d3 into the library
  }
];