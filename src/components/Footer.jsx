import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Footer.module.css'

function Footer() {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }, [])

  return (
    <footer ref={ref} className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <span className={styles.copyright}>© 2026 StockVue</span>
          <span className={styles.dot}>·</span>
          <span className={styles.tag}>Premium Market Dashboard</span>
        </div>
        <div className={styles.right}>
          <span className={styles.dataNote}>Data simulated for demonstration</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer