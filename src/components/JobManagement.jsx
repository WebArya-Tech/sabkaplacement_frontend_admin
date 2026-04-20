import React, { useState, useRef, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import API from '../services/api'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  Trash2,
} from 'lucide-react'

const statusConfig = {
  Pending: { label: 'Pending', class: 'bg-amber-50 text-amber-700 border border-amber-200' },
  Active: { label: 'Active', class: 'bg-green-50 text-green-700 border border-green-200' },
  Rejected: { label: 'Rejected', class: 'bg-red-50 text-red-700 border border-red-200' },
  Closed: { label: 'Closed', class: 'bg-gray-100 text-gray-600 border border-gray-200' },
}

function JobDetailModal({ job, onClose }) {
  if (!job) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center" style={{ background: '#eaf4f9' }}>
                <Briefcase size={20} style={{ color: '#3385AA' }} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-800">{job.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">{job.company}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><p className="text-gray-400">Location</p><p className="font-medium text-gray-700 flex items-center gap-1"><MapPin size={13} />{job.location}</p></div>
          <div><p className="text-gray-400">Job Type</p><p className="font-medium text-gray-700">{job.type}</p></div>
          <div><p className="text-gray-400">Salary</p><p className="font-medium text-gray-700">{job.salary}</p></div>
          <div><p className="text-gray-400">Posted Date</p><p className="font-medium text-gray-700">{job.date}</p></div>
          <div><p className="text-gray-400">Applications</p><p className="font-medium text-gray-700">{job.apps}</p></div>
          <div><p className="text-gray-400">Status</p>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusConfig[job.status]?.class}`}>
              {statusConfig[job.status]?.label}
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function JobManagement() {
  const location = useLocation()
  const path = location.pathname

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [page, setPage] = useState(1)
  const [remarks, setRemarks] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const PER_PAGE = 8
  const filterRef = useRef(null)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let endpoint = '/admin/jobs'
      // If we are on a specific filter page
      let params = {}
      if (path === '/jobs/approve') params.status = 'Pending'
      else if (path === '/jobs/rejected') params.status = 'Rejected'
      else if (path === '/jobs/spam') params.status = 'Rejected' // Assuming spam is a type of rejection or handled similarly
      
      // Override with manual filters if set
      if (filterStatus !== 'all') params.status = filterStatus
      
      const res = await API.get(endpoint, { params })
      setJobs(res.data.data)
    } catch (err) {
      console.error('Failed to fetch jobs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [path, filterStatus])

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this job?')) return
    setActionLoading(true)
    try {
      await API.put(`/admin/jobs/${id}/approve`)
      fetchJobs()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve job')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!remarks) return alert('Please enter rejection remarks')
    setActionLoading(true)
    try {
      await API.put(`/admin/jobs/${selectedJob._id}/reject`, { remarks })
      setShowRejectModal(false)
      setSelectedJob(null)
      setRemarks('')
      fetchJobs()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject job')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job completely? This action cannot be undone.')) return
    setActionLoading(true)
    try {
      await API.delete(`/admin/jobs/${id}`)
      fetchJobs()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job')
    } finally {
      setActionLoading(false)
    }
  }

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filterByPath = (j) => {
    if (path === '/jobs/approve') return j.status === 'pending'
    if (path === '/jobs/rejected') return j.status === 'rejected'
    if (path === '/jobs/spam') return j.status === 'spam'
    return true
  }

  const filtered = jobs.filter((j) => {
    if (!filterByPath(j)) return false
    if (filterStatus !== 'all' && j.status !== filterStatus) return false
    if (filterType !== 'all' && j.type !== filterType) return false
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const updateStatus = (id, newStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)))
  }

  const handleExport = () => {
    const headers = ['#', 'Job Title', 'Company', 'Location', 'Type', 'Salary', 'Applications', 'Status', 'Date']
    const rows = filtered.map((j) => [j.id, j.title, j.company, j.location, j.type, j.salary, j.apps, j.status, j.date])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasActiveFilter = filterStatus !== 'all' || filterType !== 'all'

  const pageTitle = () => {
    if (path === '/jobs/approve') return 'Pending Jobs — Approve / Reject'
    if (path === '/jobs/rejected') return 'Rejected Jobs'
    if (path === '/jobs/spam') return 'Spam Jobs'
    return 'All Jobs'
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-72">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search jobs or company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="bg-transparent text-sm text-gray-600 outline-none w-full"
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1) }} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 relative flex-wrap" ref={filterRef}>
          {/* Filter button */}
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
            style={hasActiveFilter
              ? { background: '#3385AA', color: '#fff', borderColor: '#3385AA' }
              : { background: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }}
          >
            <Filter size={14} />
            Filter
            {hasActiveFilter && <span className="ml-1 bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {[filterStatus !== 'all', filterType !== 'all'].filter(Boolean).length}
            </span>}
          </button>



          {/* Export button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
            style={{ borderColor: '#3385AA', color: '#3385AA', background: '#eaf4f9' }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: '3px solid #3385AA' }}>
        <div className="px-4 md:px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-semibold" style={{ color: '#3385AA' }}>{pageTitle()}</h2>
          <span className="text-sm text-gray-400">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#eaf4f9' }}>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#3385AA' }}>#</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#3385AA' }}>Job Title</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: '#3385AA' }}>Company</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#3385AA' }}>Location</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#3385AA' }}>Type</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: '#3385AA' }}>Apps</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#3385AA' }}>Status</th>
                <th className="text-right px-3 md:px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#3385AA' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No records found</td></tr>
              )}
              {paginated.map((job, idx) => (
                <tr key={job._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-3 md:px-5 py-3.5 text-gray-400 text-xs">{(page - 1) * PER_PAGE + idx + 1}</td>
                  <td className="px-3 md:px-5 py-3.5 font-medium text-gray-800 max-w-[120px] md:max-w-none truncate">{job.title}</td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-600 hidden sm:table-cell">{job.companyId?.companyName || 'N/A'}</td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden md:table-cell"><span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span></td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden md:table-cell">{job.jobType}</td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-600 font-medium hidden sm:table-cell">{job.applications?.length || 0}</td>
                  <td className="px-3 md:px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusConfig[job.status]?.class || 'bg-gray-100'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedJob(job)}
                        title="View Details"
                        className="p-1.5 rounded-lg hover:bg-[#3385AA]/10 transition-colors"
                        style={{ color: '#3385AA' }}
                      >
                        <Eye size={15} />
                      </button>
                      {job.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(job._id)}
                            title="Approve"
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            onClick={() => { setSelectedJob(job); setShowRejectModal(true) }}
                            title="Reject"
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 flex-wrap gap-2">
          <span>Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-7 h-7 rounded-lg text-xs font-medium transition-colors"
                style={p === page
                  ? { background: '#3385AA', color: '#fff' }
                  : { background: 'transparent', color: '#6b7280' }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
