import React, { useState, useEffect } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  UserCheck,
  Clock,
  Star,
} from 'lucide-react'



const statusBadge = (status) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-green-50 text-green-700 border border-green-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    spam: 'bg-gray-100 text-gray-600 border border-gray-200',
  }
  return map[status] || map.pending
}

const quickLinks = [
  { label: 'Approve Jobs', icon: CheckCircle, path: '/jobs/approve', color: '#16a34a', bg: '#f0fdf4' },
  { label: 'Rejected Jobs', icon: XCircle, path: '/jobs/rejected', color: '#dc2626', bg: '#fef2f2' },
  { label: 'Spam Jobs', icon: AlertTriangle, path: '/jobs/spam', color: '#d97706', bg: '#fffbeb' },
  { label: 'Add Course', icon: BookOpen, path: '/courses/add', color: '#7c3aed', bg: '#f5f3ff' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          API.get('/admin/dashboard'),
          API.get('/admin/jobs') // Usually this could use ?limit=5, but we can slice client side
        ])
        setStats(statsRes.data.data)
        setRecentJobs(jobsRes.data.data.slice(0, 5).map(job => ({
          id: job._id,
          title: job.title,
          company: job.companyId?.companyName || 'N/A',
          location: job.location,
          status: job.status.toLowerCase(),
          date: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        })))
      } catch (err) {
        console.error('Failed to fetch dashboard data', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#3385AA]/30 border-t-[#3385AA] rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 inline-block">
          <AlertTriangle className="mx-auto mb-2" size={32} />
          <p className="font-semibold">Failed to connect to server</p>
          <p className="text-sm opacity-80">Please ensure the backend server is running and try again.</p>
        </div>
        <div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#3385AA] text-white rounded-lg hover:bg-[#2a6d8c] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Jobs', value: stats?.jobs?.total || 0, icon: Briefcase, color: '#3385AA', bg: '#eaf4f9' },
    { label: 'Pending Jobs', value: stats?.jobs?.pending || 0, icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Active Jobs', value: stats?.jobs?.active || 0, icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Candidates', value: stats?.users?.candidates || 0, icon: Users, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Companies', value: stats?.users?.companies || 0, icon: Building2, color: '#ec4899', bg: '#fdf2f8' },
    { label: 'Admins', value: stats?.users?.admins || 0, icon: Star, color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon
          const isLastOdd = i === statCards.length - 1 && statCards.length % 2 !== 0
          return (
            <div
              key={s.label}
              className={`bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow${isLastOdd ? ' col-span-2 sm:col-span-1' : ''}`}
            >
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div
                  className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#f0fdf4', color: '#16a34a' }}
                >
                  {s.change}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((q) => {
            const Icon = q.icon
            return (
              <Link
                key={q.label}
                to={q.path}
                className="flex items-center gap-2 md:gap-3 bg-white rounded-xl px-3 md:px-4 py-3 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: q.bg }}>
                  <Icon size={16} style={{ color: q.color }} />
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-700 leading-tight">{q.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Recent Job Listings</h2>
          <Link
            to="/jobs"
            className="flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#3385AA' }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-3 md:px-5 py-3.5 text-gray-400">{job.id}</td>
                  <td className="px-3 md:px-5 py-3.5 font-medium text-gray-800">{job.title}</td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-600 hidden sm:table-cell">{job.company}</td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden md:table-cell">{job.location}</td>
                  <td className="px-3 md:px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden sm:table-cell">{job.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
