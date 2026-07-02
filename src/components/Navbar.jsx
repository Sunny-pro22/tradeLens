import React from 'react'
import { FaChartLine } from 'react-icons/fa'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'
import styles from './Navbar.module.css'

function Navbar({ onSearch, selectedSymbol }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <FaChartLine className={styles.logoIcon} />
            <span className={styles.logoText}>StockVue</span>
          </div>
        </div>

        <div className={styles.center}>
          <SearchBar onSelect={onSearch} selectedSymbol={selectedSymbol} />
        </div>
{/* 
        <div className={styles.right}>
          <ThemeToggle />
        </div> */}
      </div>
    </header>
  )
}

export default Navbar