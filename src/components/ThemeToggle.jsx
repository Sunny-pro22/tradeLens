import React from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'
import styles from './ThemeToggle.module.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className={styles.iconWrap}>
        {isDark ? <FiSun className={styles.icon} /> : <FiMoon className={styles.icon} />}
      </div>
      <span className={styles.label}>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle