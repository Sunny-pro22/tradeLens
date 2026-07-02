// src/components/MarketOverview.jsx
import React from 'react'
import { useMarketOverview } from '../hooks/useMarketOverview'
import styles from './MarketOverview.module.css'

function MarketOverview() {
  const { data, loading } = useMarketOverview()

  if (loading) {
    return <div className={styles.skeleton}>Loading markets...</div>
  }

  return (
    <div className={styles.container}>
      {data.map((item) => (
        <div key={item.symbol} className={styles.card}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          <span className={item.change >= 0 ? styles.positive : styles.negative}>
            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default MarketOverview