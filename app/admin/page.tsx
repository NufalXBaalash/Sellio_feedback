'use client'

import { useState } from 'react'
import AlertModal from '../../components/alert-modal'

interface FeedbackStats {
  totalSubmissions: number
  usefulCount: number
  notUsefulCount: number
  usefulPercentage: number
  recentSubmissions: Array<{
    email: string
    isUseful: string
    feedback: string
    timestamp: string
  }>
  lastUpdated: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [alert, setAlert] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning'
    title: string
    message: string
    confirmText?: string
    onConfirm?: () => void
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })
  const [confirmReset, setConfirmReset] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (credentials.email === 'admin' && credentials.password === '123456789') {
      setIsAuthenticated(true)
      loadStats()
    } else {
      setError('Invalid credentials')
    }
  }

  const loadStats = async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to load stats')
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/export')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'sellio-feedback.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        setAlert({
          isOpen: true,
          type: 'success',
          title: 'Export Successful',
          message: 'CSV file has been downloaded successfully!'
        })
        // Refresh stats after export
        loadStats()
      } else {
        setAlert({
          isOpen: true,
          type: 'error',
          title: 'Export Failed',
          message: 'Error exporting data. Please try again.'
        })
      }
    } catch (error) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Export Failed',
        message: 'Network error. Please check your connection and try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAlert({
      isOpen: true,
      type: 'warning',
      title: 'Confirm Reset',
      message: 'Are you sure you want to reset all feedback data? This action cannot be undone.',
      confirmText: 'Yes, Reset Data',
      onConfirm: () => {
        performReset()
      }
    })
  }

  const performReset = async () => {
    setIsResetting(true)
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setAlert({
          isOpen: true,
          type: 'success',
          title: 'Reset Successful',
          message: 'CSV file has been reset successfully! All data has been cleared.'
        })
        // Refresh stats after reset
        loadStats()
      } else {
        setAlert({
          isOpen: true,
          type: 'error',
          title: 'Reset Failed',
          message: `Error resetting CSV file: ${data.message || 'Unknown error'}`
        })
      }
    } catch (error) {
      console.error('Reset error:', error)
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Reset Failed',
        message: `Network error: ${error instanceof Error ? error.message : 'Please try again'}`
      })
    } finally {
      setIsResetting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-4">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <a 
              href="/" 
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage feedback data and export reports
              </p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-white border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Statistics Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Feedback Statistics
              </h2>
              <button
                onClick={loadStats}
                disabled={isLoadingStats}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingStats ? 'Loading...' : 'Refresh Stats'}
              </button>
            </div>

            {stats && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-blue-900 font-semibold mb-2">Total Submissions</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalSubmissions}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <h3 className="text-green-900 font-semibold mb-2">Found Useful</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.usefulCount}</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                  <h3 className="text-red-900 font-semibold mb-2">Not Useful</h3>
                  <p className="text-3xl font-bold text-red-600">{stats.notUsefulCount}</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-purple-900 font-semibold mb-2">Useful %</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.usefulPercentage}%</p>
                </div>
              </div>
            )}

            {stats && stats.recentSubmissions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {stats.recentSubmissions.map((submission, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{submission.email}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.isUseful === 'yes' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.isUseful === 'yes' ? 'Useful' : 'Not Useful'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{submission.feedback}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(submission.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Export Feedback Data
              </h2>
              <p className="text-gray-600 mb-6">
                Export all customer feedback data to a CSV file containing:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="text-gray-900 font-semibold mb-2">Data Fields</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Email Address</li>
                  <li>• Feedback (Yes/No)</li>
                  <li>• Additional Comments</li>
                  <li>• Submission Timestamp</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-gray-900 font-semibold mb-2">Export Features</h3>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>• Complete data export</li>
                  <li>• CSV format for Excel</li>
                  <li>• UTF-8 encoding with BOM</li>
                  <li>• Backup from Google Sheets</li>
                </ul>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleExport}
                  disabled={isLoading || (stats && stats.totalSubmissions === 0)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Exporting...' : 'Download CSV File'}
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? 'Resetting...' : 'Reset CSV Data'}
                </button>
              </div>
              
              {stats && stats.totalSubmissions === 0 && (
                <p className="text-sm text-gray-500 mt-4">
                  ℹ️ No feedback data available to export
                </p>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                ⚠️ Reset will permanently delete all feedback data and create a new empty CSV file
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a 
              href="/" 
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.type === 'warning' ? 'Yes, Reset Data' : 'OK'}
        onConfirm={alert.type === 'warning' ? alert.onConfirm : undefined}
      />
    </div>
  )
}
