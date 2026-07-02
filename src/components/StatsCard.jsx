import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiBarChart2,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi'
import styles from './StatsCard.module.css'

const iconMap = {
  open: FiDollarSign,
  high: FiTrendingUp,
  low: FiTrendingDown,
  close: FiActivity,
  volume: FiBarChart2,
  highest: FiArrowUp,
  lowest: FiArrowDown,
  avgClose: FiDollarSign,
  avgVolume: FiBarChart2,
  days: FiBarChart2,
}

const labelMap = {
  open: 'Open',
  high: 'High',
  low: 'Low',
  close: 'Close',
  volume: 'Volume',
  highest: 'Highest',
  lowest: 'Lowest',
  avgClose: 'Avg Close',
  avgVolume: 'Avg Volume',
  days: 'Trading Days',
}

function StatCard({ label, value, change, type }) {
  const cardRef = useRef(null)
  const Icon = iconMap[type] || FiBarChart2
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 }
    )
  }, [])

  const formattedValue =
    typeof value === 'number'
      ? type === 'volume' || type === 'avgVolume'
        ? (value / 1000000).toFixed(1) + 'M'
        : type === 'days'
        ? value
        : value.toFixed(2)
      : value

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.label}>{labelMap[type] || label}</span>
        <div className={styles.iconWrap}>
          <Icon className={styles.icon} />
        </div>
      </div>
      <div className={styles.value}>{formattedValue}</div>
      {change !== undefined && change !== null && type !== 'days' && (
        <div className={`${styles.change} ${isPositive ? styles.positive : isNegative ? styles.negative : ''}`}>
          {isPositive ? '+' : ''}
          {change?.toFixed(2)}%
        </div>
      )}
    </div>
  )
}

function StatsCards({ data }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No statistics available</p>
      </div>
    )
  }

  const latest = data[data.length - 1]
  const highest = Math.max(...data.map((d) => d.high))
  const lowest = Math.min(...data.map((d) => d.low))
  const avgClose = data.reduce((sum, d) => sum + d.close, 0) / data.length
  const avgVolume = data.reduce((sum, d) => sum + d.volume, 0) / data.length
  const firstClose = data[0].close
  const change = ((latest.close - firstClose) / firstClose) * 100

  const stats = [
    { type: 'open', value: latest.open },
    { type: 'high', value: latest.high },
    { type: 'low', value: latest.low },
    { type: 'close', value: latest.close, change },
    { type: 'volume', value: latest.volume },
    { type: 'highest', value: highest },
    { type: 'lowest', value: lowest },
    { type: 'avgClose', value: avgClose },
    { type: 'avgVolume', value: avgVolume },
    { type: 'days', value: data.length },
  ]

  return (
    <div ref={containerRef} className={styles.grid}>
      {stats.map((stat) => (
        <StatCard key={stat.type} {...stat} />
      ))}
    </div>
  )
}

export default StatsCards