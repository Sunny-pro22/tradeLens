import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './LoadingScreen.module.css'
import { FaChartLine } from 'react-icons/fa'

function LoadingScreen() {
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const barRef = useRef(null)
  const textRef = useRef(null)
  const percentRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(
      logoRef.current,
      { scale: 0.5, opacity: 0, rotate: -20 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.8 }
    )

    tl.fromTo(
      barRef.current,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 1.5, ease: 'power2.inOut' },
      '-=0.4'
    )

    let count = 0
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 2
      if (count > 100) count = 100
      if (percentRef.current) {
        percentRef.current.textContent = `${count}%`
      }
      if (count === 100) clearInterval(interval)
    }, 60)

    tl.fromTo(
      textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.8'
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.content}>
        <div ref={logoRef} className={styles.logoWrap}>
          <FaChartLine className={styles.logoIcon} />
          <span className={styles.logoText}>StockVue</span>
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.barTrack}>
            <div ref={barRef} className={styles.barFill} />
          </div>
          <div ref={percentRef} className={styles.percent}>
            0%
          </div>
        </div>

        <p ref={textRef} className={styles.loadingText}>
          Loading market data...
        </p>
      </div>

      <div className={styles.backgroundGlow} />
    </div>
  )
}

export default LoadingScreen