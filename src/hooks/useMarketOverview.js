import { useState, useEffect } from 'react'

const API_KEY = 'process.env.ALPHA_VANTAGE_API_KEY' 
const BASE_URL = 'https://www.alphavantage.co/query'

const INDICES = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^IXIC', name: 'NASDAQ' },
  { symbol: '^DJI', name: 'Dow Jones' },
]

function parseIndexData(json) {
  const timeSeries = json['Time Series (Daily)']
  if (!timeSeries) return null
  const dates = Object.keys(timeSeries).sort()
  if (dates.length === 0) return null
  const latest = timeSeries[dates[dates.length - 1]]
  return {
    price: parseFloat(latest['4. close']),
    change: 0,
  }
}

export function useMarketOverview() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIndices() {
      try {
        const results = await Promise.all(
          INDICES.map(async (idx) => {
            const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${idx.symbol}&apikey=${API_KEY}&outputsize=compact`
            const res = await fetch(url)
            const json = await res.json()
            const parsed = parseIndexData(json)
            return {
              ...idx,
              price: parsed?.price || 0,
              change: parsed?.change || 0,
            }
          })
        )
        setData(results)
      } catch (err) {
        console.warn('Failed to fetch indices, using fallback')
        setData([
          { symbol: '^GSPC', name: 'S&P 500', price: 5123.45, change: 0.32 },
          { symbol: '^IXIC', name: 'NASDAQ', price: 16234.56, change: -0.15 },
          { symbol: '^DJI', name: 'Dow Jones', price: 38456.78, change: 0.57 },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchIndices()
  }, [])

  return { data, loading }
}