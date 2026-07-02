import React, { useState, useRef, useEffect } from 'react'
import { searchStocks } from '../Data/stockData'
import { FiSearch, FiX } from 'react-icons/fi'
import styles from './searchBar.module.css'

function SearchBar({ onSelect, selectedSymbol }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (query.length > 0) {
      const matches = searchStocks(query)
      setResults(matches.slice(0, 8))
      setIsOpen(true)
      setHighlighted(-1)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (stock) => {
    setQuery(stock.symbol)
    setIsOpen(false)
    setResults([])
    if (onSelect) onSelect(stock.symbol)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    setResults([])
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && highlighted >= 0 && results[highlighted]) {
      handleSelect(results[highlighted])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.inputWrap}>
        <FiSearch className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search stocks… AAPL, TSLA, NVDA"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search stocks"
          autoComplete="off"
        />
        {query && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
            <FiX />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((stock, idx) => {
            const isSelected = selectedSymbol === stock.symbol
            const isHighlighted = idx === highlighted
            return (
              <button
                key={stock.symbol}
                className={`${styles.resultItem} ${isSelected ? styles.selected : ''} ${
                  isHighlighted ? styles.highlighted : ''
                }`}
                onClick={() => handleSelect(stock)}
                onMouseEnter={() => setHighlighted(idx)}
              >
                <span className={styles.symbol}>{stock.symbol}</span>
                <span className={styles.name}>{stock.name}</span>
                {isSelected && <span className={styles.badge}>Active</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar
