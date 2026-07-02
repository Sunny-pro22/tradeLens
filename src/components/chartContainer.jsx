import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import { useTheme } from '../hooks/useTheme'
import styles from './ChartContainer.module.css'

function ChartContainer({ data, symbol, timeframe }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const volumeSeriesRef = useRef(null)
  const { theme } = useTheme()
  const [isReady, setIsReady] = useState(false)

  const isDark = theme === 'dark'

  const colors = {
    background: isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#a1a1aa' : '#3f3f46',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    up: '#22c55e',
    down: '#ef4444',
    crosshair: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
  }

  const initChart = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    if (width === 0 || height === 0) return

    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
      volumeSeriesRef.current = null
    }

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: colors.crosshair, width: 1, style: 2 },
        horzLine: { color: colors.crosshair, width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        },
      },
      handleScroll: true,
      handleScale: true,
      watermark: { visible: false },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: colors.up,
      downColor: colors.down,
      borderVisible: false,
      wickUpColor: colors.up,
      wickDownColor: colors.down,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    })

    const volumeSeries = chart.addHistogramSeries({
      color: colors.up,
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      scaleMargins: { top: 0.85, bottom: 0 },
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
      visible: true,
      borderColor: colors.border,
    })

    chartRef.current = chart
    seriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries

    setIsReady(true)

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        chart.applyOptions({ width: rect.width, height: rect.height })
      }
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [colors, isDark])

  const updateData = useCallback(() => {
    if (!seriesRef.current || !volumeSeriesRef.current || !data || data.length === 0) return

    const candleData = data.map((d) => ({
      time: new Date(d.date).getTime() / 1000,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))

    const volumeData = data.map((d) => ({
      time: new Date(d.date).getTime() / 1000,
      value: d.volume,
      color: d.close >= d.open ? colors.up : colors.down,
    }))

    seriesRef.current.setData(candleData)
    volumeSeriesRef.current.setData(volumeData)

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [data, colors])

  useEffect(() => {
    const cleanup = initChart()
    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
        volumeSeriesRef.current = null
      }
      if (cleanup) cleanup()
    }
  }, [initChart])

  useEffect(() => {
    if (isReady && data && data.length > 0) {
      updateData()
    }
  }, [data, isReady, updateData])

  useEffect(() => {
    if (chartRef.current && isReady) {
      chartRef.current.timeScale().fitContent()
    }
  }, [timeframe, isReady])

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.chartContainer} />
      {(!data || data.length === 0) && (
        <div className={styles.emptyOverlay}>
          <span>No chart data available</span>
        </div>
      )}
    </div>
  )
}

export default React.memo(ChartContainer)