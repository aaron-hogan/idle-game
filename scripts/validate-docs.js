#!/usr/bin/env node

/**
 * Documentation validation script
 * 
 * This script checks for consistency in the project's documentation,
 * ensuring that all required documentation files are present and
 * follow the established structure.
 */

console.log('Validating documentation...');

// Import required modules
const fs = require('fs');
const path = require('path');

// Define documentation paths to validate
const DOCS_ROOT = path.join(__dirname, '..', 'docs');
const DOCS_SECTIONS = ['features', 'guides', 'processes', 'project', 'specifications'];

// Check if docs directory exists
if (!fs.existsSync(DOCS_ROOT)) {
  console.error('❌ Docs directory not found!');
  process.exit(1);
}

// Validate section directories
let errors = 0;

DOCS_SECTIONS.forEach(section => {
  const sectionPath = path.join(DOCS_ROOT, section);
  
  if (!fs.existsSync(sectionPath)) {
    console.error(`❌ Missing section directory: ${section}`);
    errors++;
    return;
  }
  
  // Check for README.md in each section
  const readmePath = path.join(sectionPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ Missing README.md in ${section}`);
    errors++;
  }
});

// Check for required project documentation
const REQUIRED_PROJECT_DOCS = [
  'overview.md',
  'status.md',
  'todo.md'
];

REQUIRED_PROJECT_DOCS.forEach(doc => {
  const docPath = path.join(DOCS_ROOT, 'project', doc);
  if (!fs.existsSync(docPath)) {
    console.error(`❌ Missing required project document: ${doc}`);
    errors++;
  }
});

// Check for CHANGELOG.md in root
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
if (!fs.existsSync(changelogPath)) {
  console.error('❌ Missing CHANGELOG.md in project root');
  errors++;
}

// Output validation results
if (errors > 0) {
  console.error(`❌ Documentation validation failed with ${errors} error(s)`);
  process.exit(1);
} else {
  console.log('✅ Documentation validation passed');
  process.exit(0);
}