import React from 'react'
import styles from './EmptyState.module.css'
import { FiBarChart2 } from 'react-icons/fi'

function EmptyState({ message = 'No stock data available', subMessage }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrap}>
        <FiBarChart2 className={styles.icon} />
      </div>
      <h3 className={styles.title}>{message}</h3>
      {subMessage && <p className={styles.sub}>{subMessage}</p>}
    </div>
  )
}

export default EmptyState