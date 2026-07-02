

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import ChartContainer from '../components/chartContainer';
import TimeframeSelector from '../components/TimeFrameSelector';
import StatsCards from '../components/StatsCard';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import FileUpload from '../components/FileUpload';
import MarketOverview from '../components/MarketOverview';
import { useStockData } from '../hooks/useStockData';
import styles from './Dashboard.module.css';

const WATCHLIST = ['AAPL', 'TSLA', 'NVDA', 'GOOGL', 'MSFT', 'AMD'];

function filterDataByTimeframe(data, timeframe) {
  if (!data || data.length === 0) return data;
  if (timeframe === 'all') return data;

  const now = new Date();
  let cutoff = new Date(now);
  switch (timeframe) {
    case '1w':
      cutoff.setDate(now.getDate() - 7);
      break;
    case '1m':
      cutoff.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      cutoff.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      cutoff.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      cutoff.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return data;
  }
  const cutoffTime = cutoff.getTime();
  return data.filter((d) => new Date(d.date).getTime() >= cutoffTime);
}

function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState('1y');
  const [uploadedData, setUploadedData] = useState(null);
  const { data: apiData, info, loading, error } = useStockData(selectedSymbol);

  // Use uploaded data if present, else API data
  const rawData = uploadedData || apiData;
 const currentInfo = uploadedData
  ? { name: 'Uploaded CSV Data', symbol: 'CSV' }
  : info;

  const filteredData = useMemo(() => {
    return filterDataByTimeframe(rawData, timeframe);
  }, [rawData, timeframe]);

  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const statsRef = useRef(null);
  const headerRef = useRef(null);
  const watchlistRef = useRef(null);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          watchlistRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          '.dashboard-chart',
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7 },
          '-=0.2'
        )
        .fromTo(
          '.dashboard-stats',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.2'
        )
        .fromTo(
          '.market-overview',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.1'
        );
    }, containerRef);
    return () => ctx.revert();
  }, [selectedSymbol]);

  // Animate chart and stats when data/timeframe changes
  useEffect(() => {
    if (chartRef.current) {
      gsap.fromTo(
        chartRef.current,
        { opacity: 0.7, scale: 0.99 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power2.out' }
      );
    }
  }, [selectedSymbol, timeframe, uploadedData]);

const handleSearch = useCallback(
  (symbol) => {
    if (symbol && symbol !== selectedSymbol) {
      setUploadedData(null);
      setTimeframe('1y');
      setSelectedSymbol(symbol);
    }
  },
  [selectedSymbol]
);
  const handleTimeframeChange = useCallback((tf) => {
    setTimeframe(tf);
  }, []);

 const handleFileUpload = useCallback((data) => {
  if (!data || data.length === 0) {
    alert('Uploaded file contains no data.');
    return;
  }

  const required = ['date', 'open', 'high', 'low', 'close', 'volume'];

  const hasFields = required.every(field => field in data[0]);

  if (!hasFields) {
    alert('Uploaded data must contain date, open, high, low, close and volume.');
    return;
  }

  setUploadedData(data);

  // Automatically show all historical data
  setTimeframe('all');

  // Don't change the selected stock symbol
}, []);

  const handleWatchlistClick = (symbol) => {
  setUploadedData(null);
  setTimeframe('1y');
  setSelectedSymbol(symbol);
};

  // Loading state
  if (loading && !uploadedData && apiData.length === 0) {
    return (
      <div className={styles.dashboard}>
        <Navbar onSearch={handleSearch} selectedSymbol={selectedSymbol} />
        <div className={styles.container}>
          <div className={styles.loadingWrap}>
            <div className={styles.loadingSpinner} />
            <p>Loading {selectedSymbol} data…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error && !uploadedData) {
    return (
      <div className={styles.dashboard}>
        <Navbar onSearch={handleSearch} selectedSymbol={selectedSymbol} />
        <div className={styles.container}>
          <div className={styles.errorWrap}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3>Unable to load data</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className={styles.dashboard}>
        <Navbar onSearch={handleSearch} selectedSymbol={selectedSymbol} />
        <div className={styles.container}>
          <EmptyState
            message="No data available for this timeframe"
            subMessage={`Try selecting a different range`}
          />
          <div className={styles.uploadFallback}>
            <FileUpload onDataLoaded={handleFileUpload} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.dashboard}>
      <Navbar onSearch={handleSearch} selectedSymbol={selectedSymbol} />

      <main className={styles.container}>
        {/* Market Overview */}
        <div className="market-overview">
          <MarketOverview />
        </div>

        {/* Watchlist */}
        <div ref={watchlistRef} className="watchlist">
          <div className={styles.watchlist}>
            {WATCHLIST.map((sym) => (
              <button
                key={sym}
                className={`${styles.watchBtn} ${
                  selectedSymbol === sym ? styles.activeWatch : ''
                }`}
                onClick={() => handleWatchlistClick(sym)}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Header with title, price change, timeframe, and upload */}
        <div ref={headerRef} className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{currentInfo?.name || selectedSymbol}</h1>
            <span className={styles.symbol}>
  {uploadedData ? 'CSV' : selectedSymbol}
</span>
            {filteredData.length > 0 && (
              <span
                className={`${styles.priceChange} ${
                  filteredData[filteredData.length - 1].close >= filteredData[0].close
                    ? styles.positive
                    : styles.negative
                }`}
              >
                {(
                  ((filteredData[filteredData.length - 1].close - filteredData[0].close) /
                    filteredData[0].close) *
                  100
                ).toFixed(2)}
                %
              </span>
            )}
          </div>
          <div className={styles.controls}>
            <TimeframeSelector active={timeframe} onChange={handleTimeframeChange} />
            <div className={styles.uploadWrapper}>
              <FileUpload onDataLoaded={handleFileUpload} />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div ref={chartRef} className="dashboard-chart">
          <div className={styles.chartWrap}>
            <ChartContainer data={filteredData} symbol={selectedSymbol} timeframe={timeframe} />
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="dashboard-stats">
          <StatsCards data={filteredData} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
