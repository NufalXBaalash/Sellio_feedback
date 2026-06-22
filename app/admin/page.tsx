'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AlertModal from '../../components/alert-modal'
import type { CustomerSessionStats, MerchantSessionStats } from '@/lib/types/session'

// --- Types ---
type TabId = 'customers' | 'merchants' | 'health'

interface StatsPayload {
  customerStats: CustomerSessionStats
  merchantStats: MerchantSessionStats
}

// --- KPI Card ---
function KpiCard({ label, value, suffix = '', color = 'green' }: { label: string; value: string | number; suffix?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    green: 'from-green-50 to-green-100 border-green-200',
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    red: 'from-red-50 to-red-100 border-red-200',
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200',
    orange: 'from-orange-50 to-orange-100 border-orange-200',
    teal: 'from-teal-50 to-teal-100 border-teal-200',
  }
  const textMap: Record<string, string> = {
    green: 'text-green-600', blue: 'text-blue-600', red: 'text-red-600',
    yellow: 'text-yellow-600', purple: 'text-purple-600', orange: 'text-orange-600', teal: 'text-teal-600',
  }
  const labelMap: Record<string, string> = {
    green: 'text-green-900', blue: 'text-blue-900', red: 'text-red-900',
    yellow: 'text-yellow-900', purple: 'text-purple-900', orange: 'text-orange-900', teal: 'text-teal-900',
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

// Convert a {key: count} distribution into a labeled bar-chart array, preserving
// the supplied key order and falling back to "pretty key" for unmapped entries.
type LabelMap = Record<string, string>
function distToBars(dist: Record<string, number> | undefined, order: string[], labels: LabelMap): { label: string; value: number }[] {
  if (!dist) return order.map(k => ({ label: labels[k] || prettyKey(k), value: 0 }))
  return order.map(k => ({ label: labels[k] || prettyKey(k), value: dist[k] || 0 }))
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

// --- Customer Session Table ---
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

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
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
                    {s.open_feedback && (
                      <div className="sm:col-span-2">
                        <Label>Written Feedback</Label>
                        <div className="mt-1 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {s.open_feedback}
                        </div>
                      </div>
                    )}
                    {s.order_prevented_text && (
                      <div className="sm:col-span-2">
                        <Label>What Prevented Completion</Label>
                        <div className="mt-1 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {s.order_prevented_text}
                        </div>
                      </div>
                    )}
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

// --- Merchant Session Table (shows M1–M11 in expanded detail) ---
function MerchantSessionTable({ sessions }: { sessions: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (sessions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Merchant Sessions</h3>
        <p className="text-gray-400 text-center py-8">No merchant sessions yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Merchant Sessions <span className="text-gray-400 font-normal text-sm">(click a row to see full answers)</span></h3>
      <div className="space-y-2">
        {sessions.map((s) => {
          const isExpanded = expandedId === s.session_id
          return (
            <div key={s.session_id} className="border border-gray-100 rounded-xl overflow-hidden">
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
                {s.m_willing_to_pay && <span className="text-xs font-semibold text-[#27AE60] w-12 shrink-0">Pay: {prettyKey(s.m_willing_to_pay)}</span>}
                {s.m_merchant_nps != null && <span className="text-xs font-semibold text-blue-600 w-10 shrink-0">NPS {s.m_merchant_nps}</span>}
                {s.contact_name && <span className="text-xs font-medium text-gray-700 max-w-[140px] truncate shrink-0" title={s.contact_name}>{s.contact_name}</span>}
                <span className="text-xs text-gray-400 ml-auto shrink-0">{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</span>
                <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {/* Contact details (joined from the reward-claim / feedback table) */}
                    <div className="sm:col-span-2">
                      <Label>Contact Details</Label>
                      {(s.contact_name || s.contact_phone || s.contact_email) ? (
                        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                          {s.contact_name && <span className="text-gray-800 font-medium">{s.contact_name}</span>}
                          {s.contact_phone && <a href={`tel:${s.contact_phone}`} className="text-blue-600 hover:underline">{s.contact_phone}</a>}
                          {s.contact_email && <a href={`mailto:${s.contact_email}`} className="text-blue-600 hover:underline break-all">{s.contact_email}</a>}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-gray-400">No contact info claimed for this session.</p>
                      )}
                    </div>

                    {/* Full funnel timing */}
                    <div className="sm:col-span-2">
                      <Label>Timing</Label>
                      <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-600">
                        {s.landing_viewed_at && <span>Landed: {new Date(s.landing_viewed_at).toLocaleString()}</span>}
                        {s.instagram_clicked_at && <span>IG Clicked: {new Date(s.instagram_clicked_at).toLocaleString()}</span>}
                        {s.test_started_at && <span>Test Started: {new Date(s.test_started_at).toLocaleString()}</span>}
                        {s.test_returned_at && <span>Returned: {new Date(s.test_returned_at).toLocaleString()}</span>}
                        {s.survey_started_at && <span>Survey Started: {new Date(s.survey_started_at).toLocaleString()}</span>}
                        {s.survey_completed_at && <span>Completed: {new Date(s.survey_completed_at).toLocaleString()}</span>}
                        {s.total_duration_seconds != null && <span>Duration: {Math.floor(s.total_duration_seconds / 60)}m {s.total_duration_seconds % 60}s</span>}
                      </div>
                    </div>

                    {/* Flow + device metadata */}
                    <div className="sm:col-span-2">
                      <Label>Flow & Device</Label>
                      <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                        <div>Flow: <span className="font-medium text-gray-700">Merchant</span> · Language: <span className="font-medium text-gray-700 uppercase">{s.language || '—'}</span> · Status: <span className="font-medium text-gray-700">{s.status}</span></div>
                        {s.user_agent && <div className="text-gray-400 break-all">UA: {s.user_agent}</div>}
                      </div>
                    </div>
                    <div>
                      <Label>AI Evaluation (M2)</Label>
                      <div className="mt-1 text-sm">AI Quality: {s.m_ai_accuracy_rating != null ? <span className="font-semibold">{s.m_ai_accuracy_rating}/5</span> : '—'}</div>
                    </div>
                    <div>
                      <Label>Value & Intent (M3–M8)</Label>
                      <div className="mt-1 text-sm">Service Useful: {s.m_service_useful ? <span className="font-semibold">{prettyKey(s.m_service_useful)}</span> : '—'}</div>
                      <div className="text-sm">Top Benefit: {s.m_top_benefit ? <span className="font-semibold">{prettyKey(s.m_top_benefit)}</span> : '—'}</div>
                      <div className="text-sm">Willing to Pay: {s.m_willing_to_pay ? <span className="font-semibold">{prettyKey(s.m_willing_to_pay)}</span> : '—'}</div>
                      <div className="text-sm">Price Expectation: {s.m_price_expectation ? <span className="font-semibold">{prettyKey(s.m_price_expectation)}</span> : '—'}</div>
                      <div className="text-sm">Pricing Fair: {s.m_pricing_fair ? <span className="font-semibold">{prettyKey(s.m_pricing_fair)}</span> : '—'}</div>
                      <div className="text-sm">Adoption Timeline: {s.m_adoption_timeline ? <span className="font-semibold">{prettyKey(s.m_adoption_timeline)}</span> : '—'}</div>
                    </div>
                    <div>
                      <Label>Blockers & NPS (M9–M10)</Label>
                      <div className="mt-1 text-sm">Blocker: {s.m_blocker ? <span className="text-red-500 font-semibold">{prettyKey(s.m_blocker)}</span> : '—'}</div>
                      <div className="text-sm">Merchant NPS: {s.m_merchant_nps != null ? <span className="font-semibold">{s.m_merchant_nps}/10</span> : '—'}</div>
                    </div>
                    {(s.m_top_benefit_text || s.m_blocker_text) && (
                      <div className="sm:col-span-2">
                        <Label>Notes</Label>
                        {s.m_top_benefit_text && <div className="mt-1 bg-white p-3 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap"><b>Benefit detail:</b> {s.m_top_benefit_text}</div>}
                        {s.m_blocker_text && <div className="mt-1 bg-white p-3 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap"><b>Blocker detail:</b> {s.m_blocker_text}</div>}
                      </div>
                    )}
                    {s.m_open_feedback && (
                      <div className="sm:col-span-2">
                        <Label>Merchant Feedback (M11)</Label>
                        <div className="mt-1 bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {s.m_open_feedback}
                        </div>
                      </div>
                    )}
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

// NPS breakdown visual (reused for customer + merchant)
function NpsBreakdown({ nps, title }: { nps: { score: number; promoters: number; passives: number; detractors: number; promoterPercent: number; passivePercent: number; detractorPercent: number }; title: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 md:col-span-2">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center">
          <p className={`text-5xl font-bold ${nps.score >= 0 ? 'text-[#27AE60]' : 'text-red-500'}`}>{nps.score}</p>
          <p className="text-sm text-gray-500 mt-1">NPS Score</p>
        </div>
        <div className="flex-1 w-full">
          <div className="flex h-8 rounded-full overflow-hidden">
            <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${nps.promoterPercent || 0}%` }}>{nps.promoters}</div>
            <div className="bg-yellow-400 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${nps.passivePercent || 0}%` }}>{nps.passives}</div>
            <div className="bg-red-400 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${nps.detractorPercent || 0}%` }}>{nps.detractors}</div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>🟢 Promoters ({nps.promoterPercent}%)</span>
            <span>🟡 Passives ({nps.passivePercent}%)</span>
            <span>🔴 Detractors ({nps.detractorPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [activeTab, setActiveTab] = useState<TabId>('customers')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [stats, setStats] = useState<StatsPayload | null>(null)
  const [alert, setAlert] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string; onConfirm?: () => void }>({ isOpen: false, type: 'success', title: '', message: '' })

  const customerStats = stats?.customerStats ?? null
  const merchantStats = stats?.merchantStats ?? null

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
      if (res.ok) setStats(await res.json())
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
    { id: 'customers', label: '👤 Customers' },
    { id: 'merchants', label: '🏪 Merchants' },
    { id: 'health', label: '📊 Health' },
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

          {/* ========== CUSTOMERS TAB ========== */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Customer Analytics (Flow A)</h2>
                <div className="flex gap-2">
                  <button onClick={handleCleanup} className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-100 transition-all">Mark Abandoned</button>
                  <button onClick={loadSessionStats} disabled={isLoadingSessions} className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50">
                    {isLoadingSessions ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {customerStats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Sessions" value={customerStats.totalSessions} color="blue" />
                    <KpiCard label="Completed" value={customerStats.completedSessions} color="green" />
                    <KpiCard label="Abandoned" value={customerStats.abandonedSessions} color="red" />
                    <KpiCard label="Completion Rate" value={customerStats.completionRate} suffix="%" color="purple" />
                    <KpiCard label="Conversation Start" value={customerStats.conversationStartRate} suffix="%" color="green" />
                    <KpiCard label="Order Completion" value={customerStats.orderCompletionRate} suffix="%" color="blue" />
                    <KpiCard label="Avg AI Accuracy" value={customerStats.avgAiAccuracy} suffix="/5" color="yellow" />
                    <KpiCard label="Avg User Rating" value={customerStats.avgOverallRating} suffix="/5" color="orange" />
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Session Funnel</h3>
                    <BarChart data={[
                      { label: 'Landing Viewed', value: customerStats.funnel.landingViews },
                      { label: 'Instagram Clicked', value: customerStats.funnel.instagramClicks },
                      { label: 'Returned', value: customerStats.funnel.testReturns },
                      { label: 'Survey Started', value: customerStats.funnel.surveyStarts },
                      { label: 'Completed', value: customerStats.funnel.surveyCompletions },
                    ]} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Landing → IG</p><p className="text-lg font-bold text-[#27AE60]">{customerStats.funnel.landingToInstagramCTR}%</p></div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">IG → Return</p><p className="text-lg font-bold text-blue-600">{customerStats.funnel.instagramToReturnRate}%</p></div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Return → Complete</p><p className="text-lg font-bold text-purple-600">{customerStats.funnel.returnToCompletionRate}%</p></div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500">Overall</p><p className="text-lg font-bold text-green-600">{customerStats.funnel.overallCompletionRate}%</p></div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Trust Distribution</h3>
                      <BarChart data={[
                        { label: 'Yes', value: customerStats.trustDistribution.yes || 0 },
                        { label: 'Maybe', value: customerStats.trustDistribution.maybe || 0 },
                        { label: 'No', value: customerStats.trustDistribution.no || 0 },
                      ]} colorClass="bg-blue-500" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Human vs AI Perception</h3>
                      <BarChart data={[
                        { label: 'Definitely AI', value: customerStats.humanLikenessDistribution.definitely_ai || 0 },
                        { label: 'Probably AI', value: customerStats.humanLikenessDistribution.probably_ai || 0 },
                        { label: 'Not Sure', value: customerStats.humanLikenessDistribution.not_sure || 0 },
                        { label: 'Probably Human', value: customerStats.humanLikenessDistribution.probably_human || 0 },
                        { label: 'Definitely Human', value: customerStats.humanLikenessDistribution.definitely_human || 0 },
                      ]} colorClass="bg-purple-500" />
                    </div>
                    {Object.keys(customerStats.failureReasonsDistribution).length > 0 && (
                      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Failure Reasons</h3>
                        <BarChart data={Object.entries(customerStats.failureReasonsDistribution).map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }))} colorClass="bg-red-400" />
                      </div>
                    )}
                    {Object.keys(customerStats.issueSeverityDistribution).length > 0 && (
                      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Failure Severity</h3>
                        <BarChart data={[
                          { label: 'Minor', value: customerStats.issueSeverityDistribution.minor || 0 },
                          { label: 'Moderate', value: customerStats.issueSeverityDistribution.moderate || 0 },
                          { label: 'Major', value: customerStats.issueSeverityDistribution.major || 0 },
                        ]} colorClass="bg-orange-500" />
                      </div>
                    )}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Business Recommendation</h3>
                      <BarChart data={[
                        { label: 'Definitely', value: customerStats.businessRecommendationDistribution.definitely || 0 },
                        { label: 'Probably', value: customerStats.businessRecommendationDistribution.probably || 0 },
                        { label: 'Not Sure', value: customerStats.businessRecommendationDistribution.not_sure || 0 },
                        { label: 'Probably Not', value: customerStats.businessRecommendationDistribution.probably_not || 0 },
                        { label: 'Definitely Not', value: customerStats.businessRecommendationDistribution.definitely_not || 0 },
                      ]} colorClass="bg-teal-500" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Conversation Duration</h3>
                      <BarChart data={[
                        { label: '< 1 min', value: customerStats.conversationDurationDistribution.less_than_1min || 0 },
                        { label: '1–3 min', value: customerStats.conversationDurationDistribution['1_to_3min'] || 0 },
                        { label: '3–5 min', value: customerStats.conversationDurationDistribution['3_to_5min'] || 0 },
                        { label: '5+ min', value: customerStats.conversationDurationDistribution.more_than_5min || 0 },
                      ]} colorClass="bg-cyan-500" />
                    </div>
                    <NpsBreakdown nps={customerStats.nps} title="NPS Breakdown" />
                  </div>

                  <SessionTable sessions={customerStats.recentSessions} />

                  <div className="text-center">
                    <button onClick={handleExportSessions} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50">
                      {isLoading ? 'Exporting...' : 'Export Sessions CSV'}
                    </button>
                  </div>
                </>
              )}

              {!customerStats && !isLoadingSessions && (
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
                  <p className="text-gray-400">No session data loaded. Click Refresh to load.</p>
                </div>
              )}
            </div>
          )}

          {/* ========== MERCHANTS TAB ========== */}
          {activeTab === 'merchants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Merchant Analytics (Flow B)</h2>
                <button onClick={loadSessionStats} disabled={isLoadingSessions} className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all disabled:opacity-50">
                  {isLoadingSessions ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {merchantStats && (
                <>
                  {/* KPI cards — 2 rows of 4 */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Merchants" value={merchantStats.totalMerchants} color="blue" />
                    <KpiCard label="Completed Surveys" value={merchantStats.completedMerchants} color="green" />
                    <KpiCard label="Service Useful Rate" value={merchantStats.serviceUsefulRate} suffix="%" color="green" />
                    <KpiCard label="Willing to Pay" value={merchantStats.willingToPayRate} suffix="%" color="blue" />
                    <KpiCard label="Pricing Fair Rate" value={merchantStats.pricingFairRate} suffix="%" color="purple" />
                    <KpiCard label="Adoption Intent" value={merchantStats.adoptionIntentRate} suffix="%" color="orange" />
                    <KpiCard label="Merchant NPS" value={merchantStats.merchantNps.score} color="blue" />
                    <KpiCard label="Most Expected Price" value={merchantStats.avgPriceExpectation} color="teal" />
                  </div>

                  {/* Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Benefits</h3>
                      <BarChart data={distToBars(merchantStats.topBenefitDistribution, ['auto_replies','dm_to_sales','time_saving','no_lost_leads','inventory_mgmt','other'], {
                        auto_replies: 'Auto Replies', dm_to_sales: 'DM → Sales', time_saving: 'Time Saving',
                        no_lost_leads: 'No Lost Leads', inventory_mgmt: 'Inventory Mgmt', other: 'Other',
                      })} colorClass="bg-[#27AE60]" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Willingness to Pay</h3>
                      <BarChart data={distToBars(merchantStats.willingToPayDistribution, ['yes','maybe','no'], {
                        yes: 'Yes', maybe: 'Maybe', no: 'No',
                      })} colorClass="bg-blue-500" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Price Expectation</h3>
                      <BarChart data={distToBars(merchantStats.priceExpectationDistribution, ['under_2000','2000_3000','3000_4000','4000_5000','over_5000'], {
                        under_2000: '< 2k', '2000_3000': '2k–3k', '3000_4000': '3k–4k', '4000_5000': '4k–5k', over_5000: '> 5k',
                      })} colorClass="bg-purple-500" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing Fairness</h3>
                      <BarChart data={distToBars(merchantStats.pricingFairDistribution, ['too_cheap','fair','expensive_but_ok','too_expensive'], {
                        too_cheap: 'Too Cheap', fair: 'Fair', expensive_but_ok: 'Expensive but OK', too_expensive: 'Too Expensive',
                      })} colorClass="bg-teal-500" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Adoption Timeline</h3>
                      <BarChart data={distToBars(merchantStats.adoptionTimelineDistribution, ['now','within_month','within_3months','need_more_proof'], {
                        now: 'Now', within_month: '< 1 Month', within_3months: '< 3 Months', need_more_proof: 'Need More Proof',
                      })} colorClass="bg-orange-500" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Adoption Blockers</h3>
                      <BarChart data={distToBars(merchantStats.blockerDistribution, ['price','trust_ai','need_trial','incomplete','not_needed','other'], {
                        price: 'Price', trust_ai: 'Trust AI', need_trial: 'Need Trial', incomplete: 'Incomplete', not_needed: 'Not Needed', other: 'Other',
                      })} colorClass="bg-red-400" />
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Service Value Perception</h3>
                      <BarChart data={distToBars(merchantStats.serviceUsefulDistribution, ['definitely','probably','not_sure','probably_not','definitely_not'], {
                        definitely: 'Definitely', probably: 'Probably', not_sure: 'Not Sure', probably_not: 'Probably Not', definitely_not: 'Definitely Not',
                      })} colorClass="bg-green-500" />
                    </div>
                    <NpsBreakdown nps={merchantStats.merchantNps} title="Merchant NPS Breakdown" />
                  </div>

                  <MerchantSessionTable sessions={merchantStats.recentMerchantSessions} />

                  <div className="text-center">
                    <button onClick={handleExportSessions} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50">
                      {isLoading ? 'Exporting...' : 'Export All Sessions CSV'}
                    </button>
                  </div>
                </>
              )}

              {!merchantStats && !isLoadingSessions && (
                <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
                  <p className="text-gray-400">No merchant data loaded. Click Refresh to load.</p>
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

              {customerStats && merchantStats && (
                <>
                  <p className="text-gray-500 text-sm">Combined health across both flows. Customer metrics reflect AI quality; merchant metrics reflect business viability.</p>

                  {/* Combined totals banner */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Sessions (Both Flows)" value={(customerStats.totalSessions || 0) + (merchantStats.totalMerchants || 0)} color="blue" />
                    <KpiCard label="Customer Completions" value={customerStats.completedSessions} color="green" />
                    <KpiCard label="Merchant Completions" value={merchantStats.completedMerchants} color="teal" />
                    <KpiCard label="Merchant Willing to Pay" value={merchantStats.willingToPayRate} suffix="%" color="orange" />
                  </div>

                  {/* AI quality health (from customers) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conversation Start Rate</h3>
                        <HealthIndicator value={customerStats.conversationStartRate} thresholds={{ green: 80, yellow: 50 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{customerStats.conversationStartRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Customers who started chatting</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Completion Rate</h3>
                        <HealthIndicator value={customerStats.orderCompletionRate} thresholds={{ green: 50, yellow: 25 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{customerStats.orderCompletionRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Customers who completed orders</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg AI Accuracy</h3>
                        <HealthIndicator value={customerStats.avgAiAccuracy * 20} thresholds={{ green: 70, yellow: 40 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{customerStats.avgAiAccuracy}<span className="text-lg text-gray-400">/5</span></p>
                      <p className="text-xs text-gray-400 mt-1">Response accuracy rating</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer NPS</h3>
                        <HealthIndicator value={customerStats.nps.score + 100} thresholds={{ green: 160, yellow: 130 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{customerStats.nps.score}</p>
                      <p className="text-xs text-gray-400 mt-1">-100 to +100 scale</p>
                    </div>
                  </div>

                  {/* Business health (from merchants) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service Useful</h3>
                        <HealthIndicator value={merchantStats.serviceUsefulRate} thresholds={{ green: 60, yellow: 30 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{merchantStats.serviceUsefulRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Definitely + Probably</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Willing to Pay</h3>
                        <HealthIndicator value={merchantStats.willingToPayRate} thresholds={{ green: 50, yellow: 25 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{merchantStats.willingToPayRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Yes + Maybe</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pricing Fairness</h3>
                        <HealthIndicator value={merchantStats.pricingFairRate} thresholds={{ green: 50, yellow: 25 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{merchantStats.pricingFairRate}%</p>
                      <p className="text-xs text-gray-400 mt-1">Fair + Expensive but OK</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Merchant NPS</h3>
                        <HealthIndicator value={merchantStats.merchantNps.score + 100} thresholds={{ green: 160, yellow: 130 }} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{merchantStats.merchantNps.score}</p>
                      <p className="text-xs text-gray-400 mt-1">-100 to +100 scale</p>
                    </div>
                  </div>
                </>
              )}

              {(!customerStats || !merchantStats) && !isLoadingSessions && (
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
