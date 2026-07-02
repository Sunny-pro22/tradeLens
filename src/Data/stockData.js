export const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
]

export function getStockInfo(symbol) {
  return STOCKS.find(s => s.symbol === symbol)
}

export function searchStocks(query) {
  if (!query) return STOCKS

  const q = query.toLowerCase()

  return STOCKS.filter(
    s =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q)
  )
}