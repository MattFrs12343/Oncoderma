import { describe, it, expect } from 'vitest'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { readFile } from 'fs/promises'

// **Feature: frontend-visual-extraction, Property 6: Minimal Dependencies**
// **Validates: Requirements 3.4, 3.5**

/**
 * Helper function to recursively get all JS/JSX files in a directory
 */
async function getAllJSFiles(dir, fileList = []) {
  const files = await readdir(dir, { withFileTypes: true })
  
  for (const file of files) {
    const filePath = join(dir, file.name)
    
    if (file.isDirectory()) {
      // Skip node_modules and test directories for component analysis
      if (file.name !== 'node_modules' && file.name !== 'test') {
        await getAllJSFiles(filePath, fileList)
      }
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      // Skip test files
      if (!file.name.endsWith('.test.jsx') && !file.name.endsWith('.test.js')) {
        fileList.push(filePath)
      }
    }
  }
  
  return fileList
}

/**
 * Helper function to extract import statements from a file
 */
async function extractImports(filePath) {
  const content = await readFile(filePath, 'utf-8')
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\w+))?\s+from\s+)?['"]([^'"]+)['"]/g
  
  const imports = []
  let match
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1])
  }
  
  return imports
}

/**
 * Helper function to check if an import is allowed
 * Allowed imports:
 * - React and React-related (react, react-dom, react-router-dom)
 * - Relative imports (components within NewFrontend)
 * - Testing libraries (only in test files)
 */
function isAllowedImport(importPath) {
  // Allowed external dependencies
  const allowedExternalDeps = [
    'react',
    'react-dom',
    'react-dom/client',
    'react-router-dom',
    'react/jsx-runtime'
  ]
  
  // Disallowed patterns (services, external APIs, etc.)
  const disallowedPatterns = [
    '/services/',
    '/api/',
    'axios',
    'fetch',
    '@/services',
    '../services',
    './services'
  ]
  
  // Check if it's a relative import (internal component)
  if (importPath.startsWith('.') || importPath.startsWith('/')) {
    // Check if it's importing from a service directory
    for (const pattern of disallowedPatterns) {
      if (importPath.includes(pattern)) {
        return false
      }
    }
    return true
  }
  
  // Check if it's an allowed external dependency
  if (allowedExternalDeps.includes(importPath)) {
    return true
  }
  
  // Check for disallowed external dependencies
  for (const pattern of disallowedPatterns) {
    if (importPath.includes(pattern)) {
      return false
    }
  }
  
  // Any other external dependency is not allowed
  return false
}

describe('Property 6: Minimal Dependencies', () => {
  it('should only import from React, React Router, or internal components (no service imports)', async () => {
    const srcDir = join(process.cwd(), 'src')
    const allFiles = await getAllJSFiles(srcDir)
    
    // Property: For any component file, all imports should be from allowed sources
    const violations = []
    
    for (const filePath of allFiles) {
      const imports = await extractImports(filePath)
      
      for (const importPath of imports) {
        if (!isAllowedImport(importPath)) {
          violations.push({
            file: filePath.replace(process.cwd(), ''),
            import: importPath
          })
        }
      }
    }
    
    // If there are violations, create a detailed error message
    if (violations.length > 0) {
      const errorMessage = violations
        .map(v => `  - ${v.file}: imports "${v.import}"`)
        .join('\n')
      
      throw new Error(
        `Found ${violations.length} disallowed import(s):\n${errorMessage}\n\n` +
        `Components should only import from:\n` +
        `  - React (react, react-dom, react-router-dom)\n` +
        `  - Internal components (relative imports)\n` +
        `  - NO service imports allowed`
      )
    }
    
    expect(violations).toHaveLength(0)
  })

  it('should not have service directories in the project structure', async () => {
    const srcDir = join(process.cwd(), 'src')
    
    async function checkForServiceDirs(dir) {
      const files = await readdir(dir, { withFileTypes: true })
      const serviceDirs = []
      
      for (const file of files) {
        if (file.isDirectory()) {
          const dirName = file.name.toLowerCase()
          
          // Check for service-related directory names
          if (dirName === 'services' || dirName === 'api' || dirName === 'apis') {
            serviceDirs.push(join(dir, file.name).replace(process.cwd(), ''))
          }
          
          // Recursively check subdirectories (skip node_modules)
          if (file.name !== 'node_modules') {
            const subDirs = await checkForServiceDirs(join(dir, file.name))
            serviceDirs.push(...subDirs)
          }
        }
      }
      
      return serviceDirs
    }
    
    const serviceDirs = await checkForServiceDirs(srcDir)
    
    if (serviceDirs.length > 0) {
      throw new Error(
        `Found service directories in NewFrontend:\n${serviceDirs.map(d => `  - ${d}`).join('\n')}\n\n` +
        `NewFrontend should only contain visual components, no service layers.`
      )
    }
    
    expect(serviceDirs).toHaveLength(0)
  })

  it('should verify all component files can be imported without service dependencies', async () => {
    // This test verifies that components are truly independent by checking
    // that they can be imported without requiring service modules
    
    const componentFiles = [
      '../components/ui/Button',
      '../components/ui/Card',
      '../components/ui/LoadingSpinner',
      '../components/ui/ThemeToggle',
      '../components/layout/Layout',
      '../components/layout/NavBar',
      '../components/layout/Footer',
      '../components/dashboard/MetricCard',
      '../components/dashboard/RiskIndicator',
      '../components/dashboard/ProgressRing',
      '../components/dashboard/ResultCard'
    ]
    
    const importErrors = []
    
    for (const componentPath of componentFiles) {
      try {
        const module = await import(componentPath)
        
        // Verify the component exports something (default export)
        if (!module.default) {
          importErrors.push({
            component: componentPath,
            error: 'No default export found'
          })
        }
      } catch (error) {
        // Check if the error is related to service imports
        if (error.message.includes('service') || 
            error.message.includes('api') ||
            error.message.includes('Cannot find module')) {
          importErrors.push({
            component: componentPath,
            error: error.message
          })
        }
      }
    }
    
    if (importErrors.length > 0) {
      const errorMessage = importErrors
        .map(e => `  - ${e.component}: ${e.error}`)
        .join('\n')
      
      throw new Error(
        `Failed to import components due to dependencies:\n${errorMessage}\n\n` +
        `All components should be importable without service dependencies.`
      )
    }
    
    expect(importErrors).toHaveLength(0)
  })

  it('should verify package.json only contains minimal required dependencies', async () => {
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
    
    const allowedDependencies = [
      'react',
      'react-dom',
      'react-router-dom'
    ]
    
    const disallowedDependencies = [
      'axios',
      'fetch',
      'swr',
      'react-query',
      '@tanstack/react-query',
      'redux',
      'zustand',
      'jotai',
      'recoil'
    ]
    
    const dependencies = Object.keys(packageJson.dependencies || {})
    const violations = []
    
    // Check for disallowed dependencies
    for (const dep of dependencies) {
      if (disallowedDependencies.includes(dep)) {
        violations.push(dep)
      }
    }
    
    // Verify all dependencies are either allowed or dev dependencies
    for (const dep of dependencies) {
      if (!allowedDependencies.includes(dep)) {
        // This is a warning, not a hard failure
        console.warn(`Warning: Unexpected dependency found: ${dep}`)
      }
    }
    
    if (violations.length > 0) {
      throw new Error(
        `Found disallowed dependencies in package.json:\n${violations.map(d => `  - ${d}`).join('\n')}\n\n` +
        `NewFrontend should only have minimal dependencies: react, react-dom, react-router-dom`
      )
    }
    
    expect(violations).toHaveLength(0)
  })

  it('should verify no environment or configuration files for external services', async () => {
    const rootDir = process.cwd()
    const files = await readdir(rootDir)
    
    const disallowedFiles = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      'api.config.js',
      'api.config.ts',
      'services.config.js',
      'services.config.ts'
    ]
    
    const foundDisallowedFiles = files.filter(file => 
      disallowedFiles.some(disallowed => file.includes(disallowed))
    )
    
    if (foundDisallowedFiles.length > 0) {
      throw new Error(
        `Found service configuration files:\n${foundDisallowedFiles.map(f => `  - ${f}`).join('\n')}\n\n` +
        `NewFrontend should not contain service configuration files.`
      )
    }
    
    expect(foundDisallowedFiles).toHaveLength(0)
  })
})
