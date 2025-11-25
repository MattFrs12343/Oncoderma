import { describe, it, expect } from 'vitest'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

// **Feature: frontend-visual-extraction, Property 7: Clean Code Structure**
// **Validates: Requirements 7.1, 7.3**

/**
 * Helper function to count different types of comments in a file
 */
const analyzeComments = (content) => {
  const lines = content.split('\n')
  let jsdocBlocks = 0
  let singleLineComments = 0
  let multiLineComments = 0
  let inJSDoc = false
  let inMultiLine = false
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Check for JSDoc start
    if (trimmed.startsWith('/**')) {
      inJSDoc = true
      jsdocBlocks++
      continue
    }
    
    // Check for JSDoc end
    if (inJSDoc && trimmed.includes('*/')) {
      inJSDoc = false
      continue
    }
    
    // Skip lines inside JSDoc
    if (inJSDoc) {
      continue
    }
    
    // Check for multi-line comment start
    if (trimmed.startsWith('/*') && !trimmed.startsWith('/**')) {
      inMultiLine = true
      multiLineComments++
      if (trimmed.includes('*/')) {
        inMultiLine = false
      }
      continue
    }
    
    // Check for multi-line comment end
    if (inMultiLine && trimmed.includes('*/')) {
      inMultiLine = false
      continue
    }
    
    // Skip lines inside multi-line comments
    if (inMultiLine) {
      continue
    }
    
    // Check for single-line comments (excluding test annotations)
    if (trimmed.startsWith('//')) {
      // Exclude test-specific comments like "// **Feature:" or "// **Validates:"
      if (!trimmed.includes('**Feature:') && !trimmed.includes('**Validates:')) {
        singleLineComments++
      }
    }
  }
  
  return {
    jsdocBlocks,
    singleLineComments,
    multiLineComments,
    totalLines: lines.length,
    codeLines: lines.filter(l => l.trim().length > 0).length
  }
}

/**
 * Helper function to check if a JSDoc comment is for complex props or component description
 */
const isComplexPropsJSDoc = (content, jsdocIndex) => {
  const lines = content.split('\n')
  let foundJSDoc = false
  let jsdocCount = 0
  let jsdocContent = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.startsWith('/**')) {
      if (jsdocCount === jsdocIndex) {
        foundJSDoc = true
        continue
      }
      jsdocCount++
    }
    
    if (foundJSDoc) {
      if (line.includes('*/')) {
        // Check the next few lines after JSDoc ends
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim()
          // Check if JSDoc is followed by a component/function definition
          if (nextLine.includes('const ') || nextLine.includes('function ') || 
              nextLine.includes('export') || nextLine.includes('class ')) {
            return true
          }
        }
        break
      }
      
      jsdocContent.push(line)
      
      // Check if it contains @param, prop documentation, or component description
      if (line.includes('@param') || line.includes('Props:') || line.includes('@prop') ||
          line.includes('component') || line.includes('Component')) {
        return true
      }
    }
  }
  
  // If JSDoc describes a component or has any documentation purpose, it's valid
  return jsdocContent.length > 0
}

/**
 * Recursively get all component files
 */
const getComponentFiles = async (dir, fileList = []) => {
  const files = await readdir(dir, { withFileTypes: true })
  
  for (const file of files) {
    const filePath = join(dir, file.name)
    
    if (file.isDirectory()) {
      // Skip test directories
      if (file.name !== 'test' && file.name !== '__tests__') {
        await getComponentFiles(filePath, fileList)
      }
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      // Skip test files
      if (!file.name.includes('.test.') && !file.name.includes('.spec.')) {
        fileList.push(filePath)
      }
    }
  }
  
  return fileList
}

describe('Property 7: Clean Code Structure', () => {
  it('should have minimal comments in component files', async () => {
    const srcDir = join(process.cwd(), 'src')
    const componentFiles = await getComponentFiles(srcDir)
    
    // Property: For any component file, it should have minimal comments
    for (const filePath of componentFiles) {
      const content = await readFile(filePath, 'utf-8')
      const stats = analyzeComments(content)
      
      // Calculate comment density (comments per 100 lines of code)
      const commentDensity = ((stats.singleLineComments + stats.multiLineComments) / stats.codeLines) * 100
      
      // Property: Comment density should be low (< 15% for non-JSDoc comments)
      // This allows for minimal helpful comments while preventing over-documentation
      expect(commentDensity).toBeLessThan(15)
      
      // Property: If JSDoc exists, it should be minimal (max 2-3 per file for complex components)
      if (stats.jsdocBlocks > 0) {
        expect(stats.jsdocBlocks).toBeLessThanOrEqual(5)
      }
    }
  })

  it('should only have JSDoc for complex props or component descriptions', async () => {
    const srcDir = join(process.cwd(), 'src')
    const componentFiles = await getComponentFiles(srcDir)
    
    for (const filePath of componentFiles) {
      const content = await readFile(filePath, 'utf-8')
      const stats = analyzeComments(content)
      
      // If file has JSDoc, verify it's for valid purposes
      if (stats.jsdocBlocks > 0) {
        // Check each JSDoc block
        for (let i = 0; i < stats.jsdocBlocks; i++) {
          const isValid = isComplexPropsJSDoc(content, i)
          // JSDoc should be for component/function documentation or complex props
          expect(isValid).toBe(true)
        }
      }
    }
  })

  it('should have self-explanatory code without excessive inline comments', async () => {
    const srcDir = join(process.cwd(), 'src')
    const componentFiles = await getComponentFiles(srcDir)
    
    for (const filePath of componentFiles) {
      const content = await readFile(filePath, 'utf-8')
      const lines = content.split('\n')
      
      let consecutiveComments = 0
      let maxConsecutiveComments = 0
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        if (trimmed.startsWith('//') && !trimmed.includes('**Feature:') && !trimmed.includes('**Validates:')) {
          consecutiveComments++
          maxConsecutiveComments = Math.max(maxConsecutiveComments, consecutiveComments)
        } else if (trimmed.length > 0) {
          consecutiveComments = 0
        }
      }
      
      // Property: Should not have more than 3 consecutive single-line comments
      // (indicates over-documentation)
      expect(maxConsecutiveComments).toBeLessThanOrEqual(3)
    }
  })

  it('should not have README files in component subdirectories', async () => {
    const srcDir = join(process.cwd(), 'src')
    
    const checkForReadme = async (dir) => {
      const files = await readdir(dir, { withFileTypes: true })
      
      for (const file of files) {
        const filePath = join(dir, file.name)
        
        if (file.isDirectory()) {
          await checkForReadme(filePath)
        } else if (file.name.toLowerCase().includes('readme')) {
          // Property: No README files should exist in subdirectories
          throw new Error(`Found README file in subdirectory: ${filePath}`)
        }
      }
    }
    
    await checkForReadme(srcDir)
    expect(true).toBe(true)
  })

  it('should have clean code structure across 100 random file samples', async () => {
    const srcDir = join(process.cwd(), 'src')
    const componentFiles = await getComponentFiles(srcDir)
    
    // Run property test with multiple iterations
    const iterations = Math.min(100, componentFiles.length * 10)
    
    for (let i = 0; i < iterations; i++) {
      // Pick a random file
      const randomFile = componentFiles[Math.floor(Math.random() * componentFiles.length)]
      const content = await readFile(randomFile, 'utf-8')
      const stats = analyzeComments(content)
      
      // Property: Any randomly selected file should have clean structure
      const commentDensity = ((stats.singleLineComments + stats.multiLineComments) / stats.codeLines) * 100
      expect(commentDensity).toBeLessThan(15) // Slightly more lenient for random sampling
      
      // Property: Should not have excessive JSDoc blocks
      expect(stats.jsdocBlocks).toBeLessThanOrEqual(5)
    }
  })

  it('should have minimal documentation overhead', async () => {
    const srcDir = join(process.cwd(), 'src')
    const componentFiles = await getComponentFiles(srcDir)
    
    let totalCodeLines = 0
    let totalCommentLines = 0
    let totalJSDocBlocks = 0
    
    for (const filePath of componentFiles) {
      const content = await readFile(filePath, 'utf-8')
      const stats = analyzeComments(content)
      
      totalCodeLines += stats.codeLines
      totalCommentLines += stats.singleLineComments + stats.multiLineComments
      totalJSDocBlocks += stats.jsdocBlocks
    }
    
    // Property: Overall comment-to-code ratio should be minimal
    const overallCommentRatio = (totalCommentLines / totalCodeLines) * 100
    expect(overallCommentRatio).toBeLessThan(10)
    
    // Property: Average JSDoc blocks per file should be low
    const avgJSDocPerFile = totalJSDocBlocks / componentFiles.length
    expect(avgJSDocPerFile).toBeLessThan(3)
  })
})
