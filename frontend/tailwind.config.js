/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'image-box-exit': 'imageBoxExit 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'image-box-enter': 'imageBoxEnter 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'results-enter': 'resultsEnter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.08s forwards',
        'results-exit': 'resultsExit 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        // Mobile versions (20% faster)
        'image-box-exit-mobile': 'imageBoxExit 0.24s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'image-box-enter-mobile': 'imageBoxEnter 0.24s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'results-enter-mobile': 'resultsEnter 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) 0.06s forwards',
        'results-exit-mobile': 'resultsExit 0.24s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      },
      keyframes: {
        imageBoxExit: {
          '0%': { 
            transform: 'scale(1) translateY(0)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scale(0.8) translateY(-12px)',
            opacity: '0'
          },
        },
        imageBoxEnter: {
          '0%': { 
            transform: 'scale(0.8) translateY(-12px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1) translateY(0)',
            opacity: '1'
          },
        },
        resultsEnter: {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0',
            boxShadow: 'none'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          },
        },
        resultsExit: {
          '0%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(20px)',
            opacity: '0'
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
    },
  },
  plugins: [],
}
