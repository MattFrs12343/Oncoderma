import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ui/ThemeToggle'
import Card from '../components/ui/Card'
import Layout from '../components/layout/Layout'
import { BrowserRouter } from 'react-router-dom'

// Test component to access theme context
const ThemeTestComponent = () => {
  const { theme, isDark, isLight, toggleTheme } = useTheme()
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="is-dark">{isDark ? 'true' : 'false'}</div>
      <div data-testid="is-light">{isLight ? 'true' : 'false'}</div>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle
      </button>
    </div>
  )
}

describe('Theme Switching Verification', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset document classes
    document.documentElement.classList.remove('dark')
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('ThemeContext functionality', () => {
    it('should initialize with light theme by default', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      expect(screen.getByTestId('is-light')).toHaveTextContent('true')
      expect(screen.getByTestId('is-dark')).toHaveTextContent('false')
    })

    it('should toggle from light to dark theme', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const toggleButton = screen.getByTestId('toggle-button')
      
      // Initial state should be light
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      
      // Toggle to dark
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('is-dark')).toHaveTextContent('true')
        expect(screen.getByTestId('is-light')).toHaveTextContent('false')
      })
    })

    it('should toggle from dark back to light theme', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const toggleButton = screen.getByTestId('toggle-button')
      
      // Toggle to dark
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })

      // Toggle back to light
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
        expect(screen.getByTestId('is-light')).toHaveTextContent('true')
      })
    })

    it('should persist theme to localStorage', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const toggleButton = screen.getByTestId('toggle-button')
      
      // Toggle to dark
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark')
      })

      // Toggle back to light
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('light')
      })
    })

    it('should apply dark class to document root when dark theme is active', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const toggleButton = screen.getByTestId('toggle-button')
      
      // Initially should not have dark class
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      
      // Toggle to dark
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      })
    })

    it('should remove dark class when switching to light theme', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const toggleButton = screen.getByTestId('toggle-button')
      
      // Toggle to dark
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // Toggle back to light
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
        expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      })
    })
  })

  describe('ThemeToggle component', () => {
    it('should render sun icon in dark mode', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      
      // Toggle to dark mode
      await act(async () => {
        await user.click(button)
      })

      await waitFor(() => {
        // In dark mode, should show sun icon (to switch to light)
        expect(button).toHaveAttribute('aria-label', 'Cambiar a tema claro')
      })
    })

    it('should render moon icon in light mode', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      )

      const button = screen.getByRole('button')
      
      // In light mode, should show moon icon (to switch to dark)
      expect(button).toHaveAttribute('aria-label', 'Cambiar a tema oscuro')
    })

    it('should toggle theme when clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <ThemeToggle />
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const button = screen.getByRole('button', { name: /Cambiar a tema/ })
      
      // Initial state
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      
      // Click toggle
      await act(async () => {
        await user.click(button)
      })

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })
    })
  })

  describe('Component dark mode classes', () => {
    it('should apply dark mode classes to Card component', () => {
      const { container } = render(
        <ThemeProvider>
          <Card title="Test Card">Content</Card>
        </ThemeProvider>
      )

      const card = container.querySelector('.dark\\:bg-slate-800')
      expect(card).toBeTruthy()
    })

    it('should apply dark mode classes to Layout component', () => {
      const { container } = render(
        <BrowserRouter>
          <ThemeProvider>
            <Layout />
          </ThemeProvider>
        </BrowserRouter>
      )

      const layout = container.querySelector('.dark\\:bg-gray-900')
      expect(layout).toBeTruthy()
    })
  })

  describe('No CSS variable conflicts', () => {
    it('should not use CSS variables in theme implementation', () => {
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      // Check that no CSS variables are set on root
      const rootStyles = getComputedStyle(document.documentElement)
      const cssVarPattern = /^--/
      
      // Get all CSS custom properties
      const customProps = Array.from(rootStyles).filter(prop => cssVarPattern.test(prop))
      
      // Should not have theme-related CSS variables
      const themeVars = customProps.filter(prop => 
        prop.includes('theme') || 
        prop.includes('color') || 
        prop.includes('bg') ||
        prop.includes('text')
      )
      
      expect(themeVars.length).toBe(0)
    })

    it('should use only Tailwind classes for theming', async () => {
      const user = userEvent.setup()
      
      const { container } = render(
        <ThemeProvider>
          <Card title="Test">
            <ThemeToggle />
          </Card>
        </ThemeProvider>
      )

      // Toggle to dark mode
      const button = screen.getByRole('button')
      await act(async () => {
        await user.click(button)
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })

      // Verify no inline styles with CSS variables
      const allElements = container.querySelectorAll('*')
      allElements.forEach(element => {
        const style = element.getAttribute('style')
        if (style) {
          expect(style).not.toMatch(/var\(--/)
        }
      })
    })
  })

  describe('Theme persistence', () => {
    it('should load saved theme from localStorage on mount', () => {
      // Set dark theme in localStorage
      localStorage.setItem('theme', 'dark')
      
      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should maintain theme across component remounts', async () => {
      const user = userEvent.setup()
      
      const { unmount } = render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      const toggleButton = screen.getByTestId('toggle-button')
      
      // Toggle to dark
      await act(async () => {
        await user.click(toggleButton)
      })

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark')
      })

      // Unmount and remount
      unmount()

      render(
        <ThemeProvider>
          <ThemeTestComponent />
        </ThemeProvider>
      )

      // Should still be dark
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    })
  })
})
