import React from 'react'
import styles from './TimeFrameSelector.module.css'

const TIMEFRAMES = [
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
  { label: 'ALL', value: 'all' },
]

function TimeframeSelector({ active, onChange }) {
  return (
    <div className={styles.wrapper}>
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          className={`${styles.btn} ${active === tf.value ? styles.active : ''}`}
          onClick={() => onChange(tf.value)}
          aria-label={`Timeframe ${tf.label}`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  )
}

export default TimeframeSelector