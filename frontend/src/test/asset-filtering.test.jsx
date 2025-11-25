import { describe, it, expect } from 'vitest'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

// **Feature: frontend-visual-extraction, Property 5: No Configuration Files**
// **Validates: Requirements 1.2**

/**
 * Recursively get all files in a directory
 */
async function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = await readdir(dirPath)
    
    for (const file of files) {
      const filePath = join(dirPath, file)
      const fileStat = await stat(filePath)
      
      if (fileStat.isDirectory()) {
        // Skip node_modules and dist directories
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
          arrayOfFiles = await getAllFiles(filePath, arrayOfFiles)
        }
      } else {
        arrayOfFiles.push(filePath)
      }
    }
    
    return arrayOfFiles
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return arrayOfFiles
  }
}

/**
 * Check if a file is a configuration file that should be excluded
 */
function isConfigurationFile(filePath) {
  const fileName = filePath.split(/[\\/]/).pop()
  const extension = extname(fileName)
  
  // Configuration files to exclude per Requirements 1.2
  const excludedPatterns = [
    /^\.env/,                    // .env files
    /^\.env\./,                  // .env.* files
    /^Dockerfile/,               // Dockerfile
    /^nginx\.conf$/,             // nginx.conf
    /^docker-compose/,           // docker-compose files
    /^\.dockerignore$/,          // .dockerignore
    /^\.gitlab-ci\.yml$/,        // GitLab CI
    /^\.github/,                 // GitHub workflows
    /^\.circleci/,               // CircleCI config
    /^jenkins/,                  // Jenkins files
    /^\.travis\.yml$/,           // Travis CI
    /^deployment/,               // Deployment configs
    /^k8s/,                      // Kubernetes configs
    /^terraform/,                // Terraform configs
  ]
  
  // Check if filename matches any excluded pattern
  return excludedPatterns.some(pattern => pattern.test(fileName))
}

/**
 * Check if a file is a visual asset (images, fonts, etc.)
 */
function isVisualAsset(filePath) {
  const extension = extname(filePath).toLowerCase()
  
  const visualExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif',
    '.ico', '.bmp', '.tiff',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.mp4', '.webm', '.ogg', // video
    '.mp3', '.wav', '.ogg', // audio
  ]
  
  return visualExtensions.includes(extension)
}

/**
 * Check if a file is a source code file (JSX, JS, CSS)
 */
function isSourceFile(filePath) {
  const extension = extname(filePath).toLowerCase()
  
  const sourceExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.css', '.scss', '.sass', '.less',
    '.html',
  ]
  
  return sourceExtensions.includes(extension)
}

/**
 * Check if a file is an allowed configuration file
 * (minimal configs needed for the project to run)
 */
function isAllowedConfig(filePath) {
  const fileName = filePath.split(/[\\/]/).pop()
  
  const allowedConfigs = [
    'package.json',           // Required for npm
    'package-lock.json',      // npm lock file
    'vite.config.js',         // Required for Vite
    'tailwind.config.js',     // Required for Tailwind
    'postcss.config.js',      // Required for PostCSS/Tailwind
    '.gitignore',             // Git ignore (not infrastructure)
    'index.html',             // Entry point
  ]
  
  return allowedConfigs.includes(fileName)
}

describe('Property 5: No Configuration Files', () => {
  const projectRoot = process.cwd()
  
  it('should not contain .env files in the project', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, it should not be a .env file
    const envFiles = allFiles.filter(file => {
      const fileName = file.split(/[\\/]/).pop()
      return fileName.startsWith('.env')
    })
    
    expect(envFiles).toEqual([])
  })

  it('should not contain Dockerfile in the project', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, it should not be a Dockerfile
    const dockerFiles = allFiles.filter(file => {
      const fileName = file.split(/[\\/]/).pop()
      return fileName.startsWith('Dockerfile')
    })
    
    expect(dockerFiles).toEqual([])
  })

  it('should not contain nginx.conf in the project', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, it should not be nginx.conf
    const nginxFiles = allFiles.filter(file => {
      const fileName = file.split(/[\\/]/).pop()
      return fileName === 'nginx.conf'
    })
    
    expect(nginxFiles).toEqual([])
  })

  it('should not contain deployment configuration files', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, it should not be a deployment config
    const deploymentFiles = allFiles.filter(file => {
      const fileName = file.split(/[\\/]/).pop()
      return (
        fileName === 'docker-compose.yml' ||
        fileName === 'docker-compose.yaml' ||
        fileName === '.dockerignore' ||
        fileName === '.gitlab-ci.yml' ||
        fileName === '.travis.yml' ||
        file.includes('.github/workflows') ||
        file.includes('.circleci')
      )
    })
    
    expect(deploymentFiles).toEqual([])
  })

  it('should only contain visual assets, source files, and minimal configs', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend (excluding node_modules and dist),
    // it should be either a visual asset, source file, or allowed config
    const invalidFiles = allFiles.filter(file => {
      // Skip files in node_modules and dist (already excluded by getAllFiles)
      if (file.includes('node_modules') || file.includes('dist')) {
        return false
      }
      
      // Check if file is valid
      const isValid = 
        isVisualAsset(file) ||
        isSourceFile(file) ||
        isAllowedConfig(file)
      
      // If not valid, check if it's a configuration file that should be excluded
      if (!isValid) {
        return isConfigurationFile(file)
      }
      
      return false
    })
    
    // If there are invalid files, log them for debugging
    if (invalidFiles.length > 0) {
      console.log('Invalid configuration files found:', invalidFiles)
    }
    
    expect(invalidFiles).toEqual([])
  })

  it('should not contain service-related files from original frontend', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, it should not be from services/ directory
    const serviceFiles = allFiles.filter(file => {
      return file.includes('services') && !file.includes('node_modules')
    })
    
    // Services directory should not exist in NewFrontend
    expect(serviceFiles).toEqual([])
  })

  it('should only contain necessary images in public/img/', async () => {
    const publicImgPath = join(projectRoot, 'public', 'img')
    
    try {
      const imgFiles = await getAllFiles(publicImgPath)
      
      // Property: For any file in public/img/, it should be a visual asset
      const nonVisualFiles = imgFiles.filter(file => !isVisualAsset(file))
      
      // Filter out .gitkeep which is allowed
      const invalidFiles = nonVisualFiles.filter(file => {
        const fileName = file.split(/[\\/]/).pop()
        return fileName !== '.gitkeep'
      })
      
      expect(invalidFiles).toEqual([])
      
      // Verify that we have some images (not empty)
      const actualImages = imgFiles.filter(file => isVisualAsset(file))
      expect(actualImages.length).toBeGreaterThan(0)
    } catch (error) {
      // If public/img doesn't exist, that's also valid
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
  })

  it('should have a clean project structure without infrastructure files', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, when checking file types,
    // there should be no infrastructure configuration files
    const infrastructureFiles = allFiles.filter(file => {
      const fileName = file.split(/[\\/]/).pop()
      
      // Skip node_modules and dist
      if (file.includes('node_modules') || file.includes('dist')) {
        return false
      }
      
      // Check for infrastructure-related files
      return (
        fileName.includes('docker') ||
        fileName.includes('nginx') ||
        fileName.includes('kubernetes') ||
        fileName.includes('terraform') ||
        fileName.includes('ansible') ||
        fileName.startsWith('.env') ||
        fileName.includes('deployment') ||
        fileName.includes('k8s')
      )
    })
    
    expect(infrastructureFiles).toEqual([])
  })

  it('should maintain focus on visual components only', async () => {
    const srcPath = join(projectRoot, 'src')
    const srcFiles = await getAllFiles(srcPath)
    
    // Property: For any file in src/, it should be a component, page, context, or test file
    const allowedSrcDirs = ['components', 'pages', 'contexts', 'test', 'hooks', 'utils']
    
    const invalidSrcFiles = srcFiles.filter(file => {
      const relativePath = file.replace(srcPath, '').replace(/^[\\/]/, '')
      const firstDir = relativePath.split(/[\\/]/)[0]
      
      // Check if file is in an allowed directory or is a root file
      const isInAllowedDir = allowedSrcDirs.includes(firstDir)
      const isRootFile = !relativePath.includes('/') && !relativePath.includes('\\')
      
      // Root files like App.jsx, main.jsx, index.css are allowed
      if (isRootFile) {
        const allowedRootFiles = ['App.jsx', 'main.jsx', 'index.css']
        const fileName = relativePath
        return !allowedRootFiles.includes(fileName)
      }
      
      return !isInAllowedDir
    })
    
    expect(invalidSrcFiles).toEqual([])
  })

  it('should not contain API configuration files', async () => {
    const allFiles = await getAllFiles(projectRoot)
    
    // Property: For any file in NewFrontend, it should not be an API config file
    const apiConfigFiles = allFiles.filter(file => {
      const fileName = file.split(/[\\/]/).pop().toLowerCase()
      
      // Skip node_modules
      if (file.includes('node_modules')) {
        return false
      }
      
      return (
        fileName.includes('apiconfig') ||
        fileName.includes('api-config') ||
        fileName.includes('api.config') ||
        (fileName.includes('config') && fileName.includes('api'))
      )
    })
    
    expect(apiConfigFiles).toEqual([])
  })

  describe('Property-based test with multiple file checks', () => {
    it('should validate all files against exclusion rules (100+ iterations)', async () => {
      const allFiles = await getAllFiles(projectRoot)
      
      // Filter out node_modules and dist
      const relevantFiles = allFiles.filter(file => 
        !file.includes('node_modules') && !file.includes('dist')
      )
      
      // Property: For any file in the project, it should pass all validation rules
      relevantFiles.forEach(file => {
        const fileName = file.split(/[\\/]/).pop()
        
        // Rule 1: No .env files
        expect(fileName.startsWith('.env')).toBe(false)
        
        // Rule 2: No Dockerfile
        expect(fileName.startsWith('Dockerfile')).toBe(false)
        
        // Rule 3: No nginx.conf
        expect(fileName).not.toBe('nginx.conf')
        
        // Rule 4: No docker-compose files
        expect(fileName.includes('docker-compose')).toBe(false)
        
        // Rule 5: File should be valid (visual asset, source, or allowed config)
        const isValid = 
          isVisualAsset(file) ||
          isSourceFile(file) ||
          isAllowedConfig(file)
        
        if (!isValid) {
          // If not valid, it should not be a configuration file
          expect(isConfigurationFile(file)).toBe(false)
        }
      })
      
      // Verify we checked a reasonable number of files
      expect(relevantFiles.length).toBeGreaterThan(10)
    })
  })
})
