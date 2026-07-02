import { useState, useEffect, useCallback, useRef } from 'react'
import { getStockInfo} from '../Data/stockData'

const API_KEY = 'process.env.ALPHA_VANTAGE_API_KEY' 
const BASE_URL = 'https://www.alphavantage.co/query'

function parseAlphaVantageData(json) {
  const timeSeries = json['Time Series (Daily)']
  if (!timeSeries) return null
  const dates = Object.keys(timeSeries).sort()
  return dates.map(date => {
    const d = timeSeries[date]
    return {
      date,
      open: parseFloat(d['1. open']),
      high: parseFloat(d['2. high']),
      low: parseFloat(d['3. low']),
      close: parseFloat(d['4. close']),
      volume: parseInt(d['5. volume'], 10),
    }
  })
}

export function useStockData(symbol) {
  const [data, setData] = useState([])
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const fetchData = useCallback(async () => {
    if (!symbol) {
      setData([]); setInfo(null); setLoading(false); return
    }

    setLoading(true)
    setError(null)

    const cacheKey = `av_${symbol}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed && parsed.length > 0) {
          setData(parsed)
          setInfo(getStockInfo(symbol))
          setLoading(false)
          return
        }
      } catch (e) { /* ignore */ }
    }

    try {
      const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}&outputsize=compact`
      const response = await fetch(url)
      const json = await response.json()

      if (json['Error Message']) {
        throw new Error(json['Error Message'])
      }

      const parsedData = parseAlphaVantageData(json)
      if (!parsedData || parsedData.length === 0) {
        throw new Error('No data returned')
      }

      localStorage.setItem(cacheKey, JSON.stringify(parsedData))

      setData(parsedData)
      setInfo(getStockInfo(symbol))
    } catch (err) {
      console.warn('Alpha Vantage failed, falling back to local data:', err.message)
      const fallback = STOCK_DATA[symbol]
      if (fallback && fallback.length > 0) {
        setData(fallback)
        setInfo(getStockInfo(symbol))
      } else {
        setError('No data available for this symbol')
        setData([])
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    mounted.current = true
    fetchData()
    return () => { mounted.current = false }
  }, [fetchData])

  return { data, info, loading, error, refetch: fetchData }
}
