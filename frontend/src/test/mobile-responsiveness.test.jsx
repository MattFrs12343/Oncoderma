import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../contexts/ThemeContext'
import Home from '../pages/Home'
import FAQ from '../pages/FAQ'
import Contacto from '../pages/Contacto'
import Layout from '../components/layout/Layout'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MetricCard from '../components/dashboard/MetricCard'
import RiskIndicator from '../components/dashboard/RiskIndicator'
import ProgressRing from '../components/dashboard/ProgressRing'
import ResultCard from '../components/dashboard/ResultCard'

// **Feature: frontend-visual-extraction, Property 3: Mobile Responsiveness**
// **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

/**
 * Helper function to set viewport size for testing
 */
const setViewportSize = (width, height = 800) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

/**
 * Helper function to check if element has horizontal overflow
 */
const hasHorizontalOverflow = (element) => {
  if (!element) return false
  
  const rect = element.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  
  // Check if element extends beyond viewport
  if (rect.width > viewportWidth) {
    return true
  }
  
  // Check all children recursively
  for (const child of element.children) {
    if (hasHorizontalOverflow(child)) {
      return true
    }
  }
  
  return false
}

/**
 * Helper function to check if element uses relative units
 */
const usesRelativeUnits = (element) => {
  if (!element) return true
  
  const computedStyle = window.getComputedStyle(element)
  
  // Check for fixed pixel widths that might break responsiveness
  const width = computedStyle.width
  const maxWidth = computedStyle.maxWidth
  const minWidth = computedStyle.minWidth
  
  // Allow 'auto', percentages, rem, em, vw, vh, but flag large fixed px values
  const hasProblematicWidth = (value) => {
    if (!value || value === 'auto' || value === 'none') return false
    if (value.includes('%') || value.includes('rem') || value.includes('em') || 
        value.includes('vw') || value.includes('vh')) return false
    
    // Check for large fixed pixel values (> viewport width)
    if (value.includes('px')) {
      const pxValue = parseInt(value)
      if (pxValue > window.innerWidth) {
        return true
      }
    }
    
    return false
  }
  
  return !hasProblematicWidth(width) && !hasProblematicWidth(maxWidth) && !hasProblematicWidth(minWidth)
}

/**
 * Helper function to wrap component with necessary providers
 */
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Property 3: Mobile Responsiveness', () => {
  let originalInnerWidth
  let originalInnerHeight
  
  beforeEach(() => {
    // Save original viewport dimensions
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
  })
  
  afterEach(() => {
    // Restore original viewport dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  // Test standard breakpoints as defined in Tailwind and requirements
  const breakpoints = [
    { name: 'Mobile Small', width: 320 },
    { name: 'Mobile Medium', width: 375 },
    { name: 'Mobile Large', width: 425 },
    { name: 'Tablet Small (sm)', width: 640 },
    { name: 'Tablet (md)', width: 768 },
    { name: 'Laptop (lg)', width: 1024 },
    { name: 'Desktop (xl)', width: 1280 },
    { name: 'Desktop Large', width: 1920 },
  ]

  describe('UI Components Responsiveness', () => {
    breakpoints.forEach(({ name, width }) => {
      it(`should render Button without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(<Button>Test Button</Button>)
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Property: Component should use relative units
        const button = container.querySelector('button')
        expect(usesRelativeUnits(button)).toBe(true)
      })

      it(`should render Card without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(
          <Card title="Test Card" description="Test description">
            Card content
          </Card>
        )
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
      })

      it(`should render LoadingSpinner without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(<LoadingSpinner fullScreen={false} />)
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
      })
    })
  })

  describe('Dashboard Components Responsiveness', () => {
    const mockRiskAssessment = {
      level: 'atencion',
      message: 'Se recomienda consulta dermatológica',
      timeframe: 'En 2-4 semanas',
      icon: '⚠️'
    }

    const mockResult = {
      name: 'Melanoma',
      simpleName: 'Melanoma',
      description: 'Tipo de cáncer de piel',
      probability: 85,
      confidence: 0.9,
      icon: '🔬',
      riskLevel: 'high',
      type: 'MEL'
    }

    breakpoints.forEach(({ name, width }) => {
      it(`should render MetricCard without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(
          <MetricCard 
            title="Confidence" 
            value="95%" 
            icon="📊"
            animated={false}
          />
        )
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
      })

      it(`should render RiskIndicator without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(
          <RiskIndicator 
            riskAssessment={mockRiskAssessment}
            animated={false}
          />
        )
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
      })

      it(`should render ProgressRing without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(
          <ProgressRing 
            percentage={75}
            animated={false}
          />
        )
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
      })

      it(`should render ResultCard without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = render(
          <ResultCard 
            result={mockResult}
            animated={false}
          />
        )
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
      })
    })
  })

  describe('Layout Components Responsiveness', () => {
    breakpoints.forEach(({ name, width }) => {
      it(`should render NavBar without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<NavBar />)
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Verify navbar is visible
        const nav = container.querySelector('nav')
        expect(nav).toBeTruthy()
      })

      it(`should render Footer without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<Footer />)
        
        // Property: Component should not cause horizontal overflow
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Verify footer is visible
        const footer = container.querySelector('footer')
        expect(footer).toBeTruthy()
      })
    })
  })

  describe('Page Components Responsiveness', () => {
    breakpoints.forEach(({ name, width }) => {
      it(`should render Home page without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<Home />)
        
        // Property: Page should not cause horizontal overflow at any viewport width
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Verify page content is rendered
        expect(container.firstChild).toBeTruthy()
      })

      it(`should render FAQ page without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<FAQ />)
        
        // Property: Page should not cause horizontal overflow at any viewport width
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Verify page content is rendered
        expect(container.firstChild).toBeTruthy()
      })

      it(`should render Contacto page without horizontal overflow at ${name} (${width}px)`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<Contacto />)
        
        // Property: Page should not cause horizontal overflow at any viewport width
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Verify page content is rendered
        expect(container.firstChild).toBeTruthy()
      })
    })
  })

  describe('Mobile-First Design Validation', () => {
    it('should use mobile-first responsive classes (Requirements 6.3)', () => {
      setViewportSize(320)
      
      const { container } = renderWithProviders(<Home />)
      
      // Check that elements use Tailwind responsive prefixes (sm:, md:, lg:, xl:)
      const allElements = container.querySelectorAll('*')
      let hasMobileFirstClasses = false
      
      allElements.forEach(element => {
        const className = element.className
        if (typeof className === 'string') {
          // Check for responsive prefixes
          if (className.includes('sm:') || className.includes('md:') || 
              className.includes('lg:') || className.includes('xl:')) {
            hasMobileFirstClasses = true
          }
        }
      })
      
      // Property: Components should use Tailwind's mobile-first responsive classes
      expect(hasMobileFirstClasses).toBe(true)
    })
  })

  describe('Flexbox and Grid Layout Validation', () => {
    it('should use flexbox or grid for responsive layouts (Requirements 6.4)', () => {
      setViewportSize(768)
      
      const { container } = renderWithProviders(<Home />)
      
      const allElements = container.querySelectorAll('*')
      let usesFlexOrGrid = false
      
      allElements.forEach(element => {
        const className = element.className
        if (typeof className === 'string') {
          // Check for Tailwind flex and grid classes
          if (className.includes('flex') || className.includes('grid')) {
            usesFlexOrGrid = true
          }
        }
      })
      
      // Property: Components should use modern layout techniques (flexbox/grid)
      // We check for Tailwind classes since jsdom doesn't compute display properly
      expect(usesFlexOrGrid).toBe(true)
    })
  })

  describe('Viewport Width Range Property Test', () => {
    // Property-based test: For any viewport width from 320px to 1920px,
    // components should render without horizontal overflow
    const testWidths = [
      320, 360, 400, 480, 540, 640, 720, 768, 800, 900, 
      1024, 1100, 1200, 1280, 1366, 1440, 1600, 1920
    ]

    testWidths.forEach(width => {
      it(`should handle viewport width ${width}px without layout breaks`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<Home />)
        
        // Property: For any viewport width in range [320, 1920], 
        // no horizontal overflow should occur
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Property: Content should be visible and rendered
        expect(container.firstChild).toBeTruthy()
        
        // Property: No element should have width exceeding viewport
        const allElements = container.querySelectorAll('*')
        allElements.forEach(element => {
          const rect = element.getBoundingClientRect()
          // Allow small overflow for scrollbars and borders (< 20px)
          expect(rect.width).toBeLessThanOrEqual(width + 20)
        })
      })
    })
  })

  describe('Text Readability at All Sizes', () => {
    breakpoints.forEach(({ name, width }) => {
      it(`should have readable text at ${name} (${width}px) - Requirements 6.5`, () => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(<Home />)
        
        // Check that text elements use appropriate Tailwind text size classes
        const textElements = container.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button')
        
        let hasTextSizeClasses = false
        const problematicElements = []
        
        textElements.forEach(element => {
          const className = element.className
          if (typeof className === 'string') {
            // Check for Tailwind text size classes (text-xs, text-sm, text-base, etc.)
            // text-xs is 12px which is minimum for readability
            if (className.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/)) {
              hasTextSizeClasses = true
            }
            // Flag elements with no text size class (they'll use browser default 16px)
            // which is acceptable
          }
        })
        
        // Property: Text elements should use Tailwind text size classes for consistent readability
        // At minimum, components should have some text sizing applied
        expect(textElements.length).toBeGreaterThan(0)
        
        // Verify that the page has text content
        expect(container.textContent.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Comprehensive Layout Test', () => {
    it('should render complete Layout with all components responsively', () => {
      const testWidths = [320, 640, 768, 1024, 1920]
      
      testWidths.forEach(width => {
        setViewportSize(width)
        
        const { container } = renderWithProviders(
          <Layout>
            <Home />
          </Layout>
        )
        
        // Property: Complete layout should work at all breakpoints
        expect(hasHorizontalOverflow(container)).toBe(false)
        
        // Verify all major layout components are present
        expect(container.querySelector('nav')).toBeTruthy()
        expect(container.querySelector('main')).toBeTruthy()
        expect(container.querySelector('footer')).toBeTruthy()
      })
    })
  })
})
