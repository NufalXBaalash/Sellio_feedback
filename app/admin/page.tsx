'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AlertModal from '../../components/alert-modal'
import type { SessionStats } from '@/lib/types/session'

// --- Types ---
type TabId = 'testing' | 'health'

// --- KPI Card ---
function KpiCard({ label, value, suffix = '', color = 'green' }: { label: string; value: string | number; suffix?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    green: 'from-green-50 to-green-100 border-green-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    red: 'from-red-50 to-red-100 border-red-200',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200',
  }
  const textMap: Record<string, string> = {
    green: 'text-green-600', blue: 'text-blue-600', red: 'text-red-600',
    yellow: 'text-yellow-600', purple: 'text-purple-600', orange: 'text-orange-600',
  }
  const labelMap: Record<string, string> = {
    green: 'text-green-900', blue: 'text-blue-900', red: 'text-red-900',
    yellow: 'text-yellow-900', purple: 'text-purple-900', orange: 'text-orange-900',
  }
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-xl p-5 border`}>
      <h3 className={`${labelMap[color]} font-semibold text-xs mb-1 uppercase tracking-wide`}>{label}</h3>
      <p className={`text-2xl font-bold ${textMap[color]}`}>{value}{suffix}</p>
    </div>
  )
}

// --- Bar Chart (CSS only) ---
function BarChart({ data, maxValue, colorClass = 'bg-[#27AE60]' }: { data: { label: string; value: number }[]; maxValue?: number; colorClass?: string }) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-600 w-28 sm:w-36 text-right shrink-0 truncate">{d.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className={`h-full ${colorClass} rounded-full transition-all duration-700`} style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-10 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

// --- Health Indicator ---
function HealthIndicator({ value, thresholds }: { value: number; thresholds: { green: number; yellow: number } }) {
  const color = value >= thresholds.green ? 'bg-green-500' : value >= thresholds.yellow ? 'bg-yellow-500' : 'bg-red-500'
  return <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
}

// --- Label helper ---
function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-xs font-semibold text-gray-400 uppercase tracking-wide ${className}`}>{children}</span>
}

function formatBool(v: boolean | null | undefined) {
  if (v === true) return <span className="text-green-600 font-semibold">Yes</span>
  if (v === false) return <span className="text-red-500 font-semibold">No</span>
  return <span className="text-gray-300">—</span>
}

function prettyKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// --- Session Table with expandable detail rows ---
function SessionTable({ sessions }: { sessions: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (sessions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sessions</h3>
        <p className="text-gray-400 text-center py-8">No sessions yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sessions <span className="text-gray-400 font-normal text-sm">(click a row to see full feedback)</span></h3>
      <div className="space-y-2">
        {sessions.map((s) => {
          const isExpanded = expandedId === s.session_id
          return (
            <div key={s.session_id} className="border border-gray-100 rounded-xl overflow-hidden">
              {/* Summary row — clickable */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : s.session_id)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  s.status === 'completed' ? 'bg-green-500' : s.status === 'abandoned' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <span className="font-mono text-xs text-gray-500 w-20 shrink-0">{s.session_id?.slice(0, 8)}…</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium w-24 text-center shrink-0 ${
                  s.status === 'completed' ? 'bg-green-100 text-green-800' :
                  s.status === 'abandoned' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }">{s.status}</span>
                <span className="text-xs text-gray-500 w-10 shrink-0">{s.language?.toUpperCase()}</span>
                {s.overall_rating != null && <span className="text-xs font-semibold text-[#27AE60] w-10 shrink-0">⭐ {s.overall_rating}/5</span>}
                {s.nps_score != null && <span className="text-xs font-semibold text-blue-600 w-10 shrink-0">NPS {s.nps_score}</span>}
                <span className="text-xs text-gray-400 ml-auto shrink-0">{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</span>
                <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {/* Timing */}
                    <div className="sm:col-span-2">
                      <Label>Timing</Label>
                      <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-600">
                        {s.landing_viewed_at && <span>Landed: {new Date(s.landing_viewed_at).toLocaleString()}</span>}
                        {s.instagram_clicked_at && <span>IG Clicked: {new Date(s.instagram_clicked_at).toLocaleString()}</span>}
                        {s.test_returned_at && <span>Returned: {new Date(s.test_returned_at).toLocaleString()}</span>}
                        {s.survey_completed_at && <span>Completed: {new Date(s.survey_completed_at).toLocaleString()}</span>}
                        {s.total_duration_seconds != null && <span>Duration: {Math.floor(s.total_duration_seconds / 60)}m {s.total_duration_seconds % 60}s</span>}
                      </div>
                    </div>

                    {/* Survey answers grid */}
                    <div>
                      <Label>Conversation</Label>
                      <div className="mt-1 text-sm">Started: {formatBool(s.conversation_started)}</div>
                      <div className="text-sm">AI Accuracy: {s.ai_accuracy_rating != null ? <span className="font-semibold">{s.ai_accuracy_rating}/5</span> : '—'}</div>
                      <div className="text-sm">Order Completed: {formatBool(s.order_completed)}</div>
                    </div>

                    <div>
                      <Label>Ratings</Label>
                      <div className="mt-1 text-sm">Overall: {s.overall_rating != null ? <span className="font-semibold">{s.overall_rating}/5</span> : '—'}</div>
                      <div className="text-sm">NPS: {s.nps_score != null ? <span className="font-semibold">{s.nps_score}/10</span> : '—'}</div>
                      <div className="text-sm">Duration Estimate: {s.conversation_duration_estimate ? prettyKey(s.conversation_duration_estimate) : '—'}</div>
                    </div>

                    <div>
                      <Label>Perception</Label>
                      <div className="mt-1 text-sm">Human Likeness: {s.human_likeness ? <span className="font-semibold">{prettyKey(s.human_likeness)}</span> : '—'}</div>
                      <div className="text-sm">Trust Level: {s.trust_level ? <span className="font-semibold">{prettyKey(s.trust_level)}</span> : '—'}</div>
                      <div className="text-sm">Recommendation: {s.business_recommendation ? <span className="font-semibold">{prettyKey(s.business_recommendation)}</span> : '—'}</div>
                    </div>

                    <div>
                      <Label>Issues</Label>
                      <div className="mt-1 text-sm">Failure Reason: {s.order_prevented_reason ? <span className="text-red-500 font-semibold">{prettyKey(s.order_prevented_reason)}</span> : '—'}</div>
                      <div className="text-sm">Severity: {s.issue_severity ? <span className={`font-semibold ${
                        s.issue_severity === 'major' ? 'text-red-600' : s.issue_severity === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                      }`}>{prettyKey(s.issue_severity)}</span> : '—'}</div>
                    </div>

                    {/* Open feedback — full width */}
                    {s.open_feedback && (
                      <div className="sm:col-span-2">
                        <Label>Written Feedback</Label>
                        <div className="mt-1 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {s.open_feedback}
                        </div>
                      </div>
                    )}

                    {/* Order prevented text — full width */}
                    {s.order_prevented_text && (
                      <div className="sm:col-span-2">
                        <Label>What Prevented Completion</Label>
                        <div className="mt-1 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {s.order_prevented_text}
                        </div>
                      </div>
                    )}

                    {/* Session ID — full width */}
                    <div className="sm:col-span-2">
                      <Label>Session ID</Label>
                      <p className="mt-1 text-xs font-mono text-gray-400">{s.session_id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [activeTab, setActiveTab] = useState<TabId>('testing')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null)
  const [alert, setAlert] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string; onConfirm?: () => void }>({ isOpen: false, type: 'success', title: '', message: '' })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (credentials.email === 'admin' && credentials.password === '123456789') {
      setIsAuthenticated(true)
    } else {
      setError('Invalid credentials')
    }
  }

  const loadSessionStats = async () => {
    setIsLoadingSessions(true)
    try {
      const res = await fetch('/api/sessions/stats')
      if (res.ok) setSessionStats(await res.json())
    } catch (e) { console.error(e) } finally { setIsLoadingSessions(false) }
  }

  useEffect(() => {
    if (isAuthenticated) { loadSessionStats() }
  }, [isAuthenticated])

  const handleExportSessions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/export?type=sessions')
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'SellioAI-test-sessions.csv'
        document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a)
        setAlert({ isOpen: true, type: 'success', title: 'Export Successful', message: 'Sessions CSV downloaded.' })
      } else { setAlert({ isOpen: true, type: 'error', title: 'Export Failed', message: 'Error exporting sessions.' }) }
    } catch { setAlert({ isOpen: true, type: 'error', title: 'Export Failed', message: 'Network error.' }) }
    finally { setIsLoading(false) }
  }

  const handleCleanup = async () => {
    try {
      const res = await fetch('/api/sessions/cleanup', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setAlert({ isOpen: true, type: 'success', title: 'Cleanup Complete', message: `${data.abandonedCount} sessions marked as abandoned.` })
        loadSessionStats()
      }
    } catch { setAlert({ isOpen: true, type: 'error', title: 'Cleanup Failed', message: 'Network error.' }) }
  }

  // --- Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-4">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="text" value={credentials.email} onChange={(e) => setCredentials(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={credentials.password} onChange={(e) => setCredentials(p => ({ ...p, password: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Enter your password" required />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all">Login</button>
          </form>
          <div className="text-center mt-6"><Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">Back to Home</Link></div>
        </div>
      </div>
    )
  }

  // --- Dashboard ---
  const tabs: { id: TabId; label: string }[] = [
    { id: 'testing', label: 'AI Testing' },
    { id: 'health', label: 'Health Dashboard' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <div className="pt-8 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage data, analytics, and AI performance</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="bg-white border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all">Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-6">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-[#27AE60] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">

          {/* ========== AI TESTING TAB ========== */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">AI Testing Analytics</h2>
                <div className="flex gap-2">
                  <button onClick={handleCleanup} className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-100 transition-all">Mark Abandoned</button>
                  <button onClick={loadSessionStats} disabled={isLoadingSessions} className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50">
                    {isLoadingSessions ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {sessionStats && (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Sessions" value={sessionStats.totalSessions} color="blue" />
                    <KpiCard label="Completed" value={sessionStats.completedSessions} color="green" />
                    <KpiCard label="Abandoned" value={sessionStats.abandonedSessions} color="red" />
                    <KpiCard label="Completion Rate" value={sessionStats.completionRate} suffix="%" color="purple" />
                    <KpiCard label="Conversation Start" value={sessionStats.conversationStartRate} suffix="%" color="green" />
                    <KpiCard label="Order Completion" value={sessionStats.orderCompletionRate} suffix="%" color="blue" />
                    <KpiCard label="Avg AI Accuracy" value={sessionStats.avgAiAccuracy} suffix="/5" color="yellow" />
                    <KpiCard label="Avg User Rating" value={sessionStats.avgOverallRating} suffix="/5" color="orange" />
                  </div>

                  {/* Funnel */}
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Session Funnel</h3>
                    <BarChart data={[
                      { label: 'Landing Viewed', value: sessionStats.funnel.landingViews },
                      { label: 'Instagram Clicked', value: sessionStats.funnel.instagramClicks },
                      { label: 'Returned', value: sessionStats.funnel.testReturns },
                      { label: 'Survey Started', value: sessionStats.funnel.surveyStarts },
                      { label: 'Completed', value: sessionStats.funnel.surveyCompletions },
                    ]} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Landing → IG</p>
                        <p className="text-lg font-bold text-[#27AE60]">{sessionStats.funnel.landingToInstagramCTR}%</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">IG → Return</p>
                        <p className="text-lg font-bold text-blue-600">{sessionStats.funnel.instagramToReturnRate}%</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Return → Complete</p>
                        <p className="text-lg font-bold text-purple-600">{sessionStats.funnel.returnToCompletionRate}%</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500">Overall</p>
                        <p className="text-lg font-bold text-green-600">{sessionStats.funnel.overallCompletionRate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Trust Distribution */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Trust Distribution</h3>
                      <BarChart data={[
                        { label: 'Yes', value: sessionStats.trustDistribution.yes || 0 },
                        { label: 'Maybe', value: sessionStats.trustDistribution.maybe || 0 },
                        { label: 'No', value: sessionStats.trustDistribution.no || 0 },
                      ]} colorClass="bg-blue-500" />
                    </div>

                    {/* Human Likeness */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Human vs AI Perception</h3>
                      <BarChart data={[
                        { label: 'Definitely AI', value: sessionStats.humanLikenessDistribution.definitely_ai || 0 },
                        { label: 'Probably AI', value: sessionStats.humanLikenessDistribution.probably_ai || 0 },
                        { label: 'Not Sure', value: sessionStats.humanLikenessDistribution.not_sure || 0 },
                        { label: 'Probably Human', value: sessionStats.humanLikenessDistribution.probably_human || 0 },
                        { label: 'Definitely Human', value: sessionStats.humanLikenessDistribution.definitely_human || 0 },
                      ]} colorClass="bg-purple-500" />
                    </div>

                    {/* Failure Reasons */}
                    {Object.keys(sessionStats.failureReasonsDistribution).length > 0 && (
                      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Failure Reasons</h3>
                        <BarChart data={Object.entries(sessionStats.failureReasonsDistribution).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))} colorClass="bg-red-400" />
                      </div>
                    )}

                    {/* Issue Severity */}
                    {Object.keys(sessionStats.issueSeverityDistribution).length > 0 && (
                      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Failure Severity</h3>
                        <BarChart data={[
                          { label: 'Minor', value: sessionStats.issueSeverityDistribution.minor || 0 },
                          { label: 'Moderate', value: sessionStats.issueSeverityDistribution.moderate || 0 },
                          { label: 'Major', value: sessionStats.issueSeverityDistribution.major || 0 },
                        ]} colorClass="bg-orange-500" />
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Business Recommendation</h3>
                      <BarChart data={[
                        { label: 'Definitely', value: sessionStats.businessRecommendationDistribution.definitely || 0 },
                        { label: 'Probably', value: sessionStats.businessRecommendationDistribution.probably || 0 },
                        { label: 'Not Sure', value: sessionStats.businessRecommendationDistribution.not_sure || 0 },
                        { label: 'Probably Not', value: sessionStats.businessRecommendationDistribution.probably_not || 0 },
                        { label: 'Definitely Not', value: sessionStats.businessRecommendationDistribution.definitely_not || 0 },
                      ]} colorClass="bg-teal-500" />
                    </div>

                    {/* Conversation Duration */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Conversation Duration</h3>
                      <BarChart data={[
                        { label: '< 1 min', value: sessionStats.conversationDurationDistribution.less_than_1min || 0 },
                        { label: '1–3 min', value: sessionStats.conversationDurationDistribution['1_to_3min'] || 0 },
                        { label: '3–5 min', value: sessionStats.conversationDurationDistribution['3_to_5min'] || 0 },
                        { label: '5+ min', value: sessionStats.conversationDurationDistribution.more_than_5min || 0 },
                      ]} colorClass="bg-cyan-500" />
                    </div>

                    {/* NPS Gauge */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 md:col-span-2">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">NPS Breakdown</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="text-center">
                          <p className={`text-5xl font-bold ${sessionStats.nps.score >= 0 ? 'text-[#27AE60]' : 'text-red-500'}`}>
                            {sessionStats.nps.score}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">NPS Score</p>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex h-8 rounded-full overflow-hidden">
                            <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${sessionStats.nps.promoterPercent || 0}%` }}>
                              {sessionStats.nps.promoters}
                            </div>
                            <div className="bg-yellow-400 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${sessionStats.nps.passivePercent || 0}%` }}>
                              {sessionStats.nps.passives}
                            </div>
                            <div className="bg-red-400 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${sessionStats.nps.detractorPercent || 0}%` }}>
                              {sessionStats.nps.detractors}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>🟢 Promoters ({sessionStats.nps.promoterPercent}%)</span>
                            <span>🟡 Passives ({sessionStats.nps.passivePercent}%)</span>
                            <span>🔴 Detractors ({sessionStats.nps.detractorPercent}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Sessions Table */}
                  <SessionTable sessions={sessionStats.recentSessions} />

                  {/* Export */}
                  <div className="text-center">
                    <button onClick={handleExportSessions} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50">
                      {isLoading ? 'Exporting...' : 'Export Sessions CSV'}
                    </button>
                  </div>
                </>
              )}

              {!sessionStats && !isLoadingSessions && (
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
                  <p className="text-gray-400">No session data loaded. Click Refresh to load.</p>
                </div>
              )}
            </div>
          )}

          {/* ========== HEALTH DASHBOARD TAB ========== */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Product Health Dashboard</h2>
                <button onClick={loadSessionStats} disabled={isLoadingSessions} className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50">
                  {isLoadingSessions ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {sessionStats && (
                <>
                  <p className="text-gray-500 text-sm">Auto-calculated KPIs for evaluating SellioAI performance. Single source of truth for AI health.</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conversation Start Rate</h3>
                        <HealthIndicator value={sessionStats.conversationStartRate} thresholds={{ green: 80, yellow: 50 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{sessionStats.conversationStartRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Users who started chatting</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Completion Rate</h3>
                        <HealthIndicator value={sessionStats.orderCompletionRate} thresholds={{ green: 50, yellow: 25 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{sessionStats.orderCompletionRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Users who completed orders</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg AI Accuracy</h3>
                        <HealthIndicator value={sessionStats.avgAiAccuracy * 20} thresholds={{ green: 70, yellow: 40 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{sessionStats.avgAiAccuracy}<span className="text-lg text-gray-400">/5</span></p>
                      <p className="text-xs text-gray-400 mt-1">Response accuracy rating</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trust Score</h3>
                        <HealthIndicator value={sessionStats.trustDistribution.yes || 0} thresholds={{ green: 60, yellow: 30 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{sessionStats.trustDistribution.yes || 0}<span className="text-lg text-gray-400">/{sessionStats.completedSessions}</span></p>
                      <p className="text-xs text-gray-400 mt-1">Users who said &ldquo;Yes&rdquo; to trust</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Human-Likeness Score</h3>
                        <HealthIndicator value={((sessionStats.humanLikenessDistribution.probably_human || 0) + (sessionStats.humanLikenessDistribution.definitely_human || 0))} thresholds={{ green: 30, yellow: 10 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {(sessionStats.humanLikenessDistribution.probably_human || 0) + (sessionStats.humanLikenessDistribution.definitely_human || 0)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Said probably/definitely human</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">NPS Score</h3>
                        <HealthIndicator value={sessionStats.nps.score + 100} thresholds={{ green: 160, yellow: 130 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{sessionStats.nps.score}</p>
                      <p className="text-xs text-gray-400 mt-1">-100 to +100 scale</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recommendation Rate</h3>
                        <HealthIndicator value={
                          sessionStats.completedSessions > 0
                            ? Math.round(((sessionStats.businessRecommendationDistribution.definitely || 0) + (sessionStats.businessRecommendationDistribution.probably || 0)) / sessionStats.completedSessions * 100)
                            : 0
                        } thresholds={{ green: 50, yellow: 25 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        {sessionStats.completedSessions > 0
                          ? Math.round(((sessionStats.businessRecommendationDistribution.definitely || 0) + (sessionStats.businessRecommendationDistribution.probably || 0)) / sessionStats.completedSessions * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Definitely + Probably</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Failure Severity</h3>
                        <HealthIndicator value={100 - ((sessionStats.issueSeverityDistribution.major || 0) * 33)} thresholds={{ green: 70, yellow: 40 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        <span className="text-green-600">{sessionStats.issueSeverityDistribution.minor || 0}</span>
                        {' / '}
                        <span className="text-yellow-600">{sessionStats.issueSeverityDistribution.moderate || 0}</span>
                        {' / '}
                        <span className="text-red-600">{sessionStats.issueSeverityDistribution.major || 0}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Minor / Moderate / Major</p>
                    </div>
                  </div>
                </>
              )}

              {!sessionStats && !isLoadingSessions && (
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
                  <p className="text-gray-400">No data loaded. Click Refresh to load session data.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center pb-8">
        <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">Back to Home</Link>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert(p => ({ ...p, isOpen: false }))}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.type === 'warning' ? 'Yes, Reset Data' : 'OK'}
        onConfirm={alert.type === 'warning' ? alert.onConfirm : undefined}
      />
    </div>
  )
}
