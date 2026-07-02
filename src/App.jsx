import React, { Suspense, lazy } from 'react'
import { ThemeProvider } from './hooks/useTheme'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'

const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Dashboard />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App