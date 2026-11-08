export const useTheme = () => {
  const STORAGE_KEY = 'pantone_theme'

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const initTheme = () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
    }
  }

  const getCurrentTheme = () => {
    if (typeof window === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') || 'light'
  }

  const toggleTheme = () => {
    const current = getCurrentTheme()
    const next = current === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return {
    initTheme,
    toggleTheme,
    getCurrentTheme,
  }
}
