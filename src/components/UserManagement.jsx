import React, { useState, useEffect, useRef } from 'react'
import API from '../services/api'
import { useLocation } from 'react-router-dom'
import {
  Search, Filter, Eye, Trash2, Building2, Users, GraduationCap,
  Mail, Phone, MapPin, ChevronLeft, ChevronRight, Download,
  X, CheckCircle, XCircle, AlertCircle, ChevronDown, UserCheck, Briefcase, FileText
} from 'lucide-react'

const statusBadge = (s) =>
  s === 'active'
    ? 'bg-green-50 text-green-700 border border-green-200'
    : 'bg-gray-100 text-gray-500 border border-gray-200'

const PAGE_SIZE = 5

export default function UserManagement() {
  const location = useLocation()
  const path = location.pathname
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState(path.includes('employers') ? 'employers' : 'trainers')
  const [actionLoading, setActionLoading] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage] = useState(1)
  const filterRef = useRef(null)

  const isEmployers = path === '/users/employers'
  const isTrainers = path === '/users/trainers'
  const isCandidates = path === '/users/candidates'
  
  const [viewUser, setViewUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)

  const handleExport = () => {
    // Simple CSV export logic or just an alert for now to prevent crash
    alert("Export feature coming soon!")
  }

  const handleDelete = async (id) => {
    setActionLoading(true)
    try {
      let endpoint = ''
      if (isEmployers) endpoint = `/admin/companies/${id}`
      else if (isTrainers) endpoint = `/admin/trainers/${id}`
      else if (isCandidates) endpoint = `/admin/candidates/${id}`
      
      await API.delete(endpoint)
      setDeleteUser(null)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    } finally {
      setActionLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      let endpoint = ''
      if (isEmployers) endpoint = `/admin/companies?status=${filterStatus}`
      else if (isTrainers) endpoint = `/admin/trainers?status=${filterStatus}`
      else if (isCandidates) endpoint = `/admin/candidates` // status check not implemented for candidates yet
      
      const res = await API.get(endpoint)
      setUsers(res.data.data)
    } catch (err) {
      console.error('Failed to fetch users', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [path, filterStatus])

  const handleApprove = async (id) => {
    if (!window.confirm(`Approve this ${isEmployers ? 'Employer' : 'Trainer'}?`)) return
    setActionLoading(true)
    try {
      const endpoint = isEmployers
        ? `/admin/companies/${id}/approve`
        : `/admin/trainers/${id}/approve`
      await API.put(endpoint)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id) => {
    const remarks = window.prompt('Enter rejection remarks:')
    if (remarks === null) return
    setActionLoading(true)
    try {
      const endpoint = isEmployers
        ? `/admin/companies/${id}/reject`
        : `/admin/trainers/${id}/reject`
      await API.put(endpoint, { remarks })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed')
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = users.filter((u) => {
    const name = isEmployers ? u.companyName : u.fullName
    return (
      (name && name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
    )
  })

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3385AA]/30 border-t-[#3385AA] rounded-full animate-spin" />
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const icon = isEmployers ? Building2 : isTrainers ? GraduationCap : Users
  const color = '#3385AA'
  const bg = '#eaf4f9'
  const title = isEmployers ? 'Employers' : isTrainers ? 'Trainers' : 'Candidates'
  const Icon = icon

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {[
          { label: `Total ${title}`, value: users.length, color, bg },
          { 
            label: 'Pending Action', 
            value: isCandidates ? 0 : users.filter(u => !u.isApproved).length, 
            color: '#f59e0b', 
            bg: '#fffbeb' 
          },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: card.bg }}>
              <Icon size={16} className="sm:hidden" style={{ color: card.color }} />
              <Icon size={22} className="hidden sm:block" style={{ color: card.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{title} List</h2>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none sm:w-56">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-600 outline-none w-full"
              />
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all"
                style={filterStatus !== 'all'
                  ? { background: '#3385AA', color: '#fff', borderColor: '#3385AA' }
                  : { background: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }}
              >
                <Filter size={14} />
                {filterStatus === 'all' ? 'Filter' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                <ChevronDown size={13} />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden w-40">
                  {['all', 'active', 'inactive'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setFilterStatus(opt); setFilterOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${filterStatus === opt ? 'font-semibold' : 'text-gray-600'}`}
                      style={filterStatus === opt ? { color: '#3385AA' } : {}}
                    >
                      {opt === 'all' ? 'All Status' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                {isEmployers && <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Jobs</th>}
                {isCandidates && <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Skills</th>}
                {isTrainers && <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Expertise</th>}
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 && (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400">No records found</td></tr>
              )}
              {paged.map((u, idx) => {
                const name = isEmployers ? u.companyName : isTrainers ? u.fullName : u.name
                const email = isEmployers ? u.userId?.email : u.email
                const phone = isEmployers ? u.userId?.phone : isTrainers ? u.phoneNumber : u.phone
                
                // Get location string
                let locStr = 'N/A';
                if (isEmployers && u.location) {
                  locStr = typeof u.location === 'object' 
                    ? [u.location.city, u.location.state].filter(Boolean).join(', ')
                    : u.location;
                } else if (isCandidates && u.location) {
                  locStr = typeof u.location === 'object'
                    ? [u.location.city, u.location.state].filter(Boolean).join(', ')
                    : u.location;
                }

                // Get "extra" column (Jobs/Skills/Expertise)
                let extra = 'N/A';
                if (isEmployers) extra = u.website || 'N/A';
                else if (isTrainers) extra = u.instituteName || 'N/A';
                else if (isCandidates) extra = Array.isArray(u.skills) ? u.skills.slice(0, 2).join(', ') + (u.skills.length > 2 ? '...' : '') : 'N/A';

                const isApproved = isCandidates ? true : u.isApproved;
                
                return (
                  <tr key={u._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-3 md:px-5 py-3.5 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-3 md:px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: color }}>
                          {name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium text-gray-800 truncate max-w-[100px] sm:max-w-none">{name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden sm:table-cell"><span className="flex items-center gap-1 truncate max-w-[160px] md:max-w-none"><Mail size={12} className="shrink-0" />{email || 'N/A'}</span></td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden lg:table-cell">{phone || 'N/A'}</td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden md:table-cell"><span className="flex items-center gap-1">{locStr}</span></td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden md:table-cell"><span className="flex items-center gap-1">{extra}</span></td>
                    <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden lg:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 md:px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isApproved ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {isApproved ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-3 md:px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {!isCandidates && !isApproved && (
                          <>
                            <button
                              onClick={() => handleApprove(u._id)}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => handleReject(u._id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                              title="Reject"
                            >
                               <XCircle size={15} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            let locStr = 'N/A';
                            if ((isEmployers || isCandidates) && u.location) {
                              locStr = typeof u.location === 'object' 
                                ? [u.location.city, u.location.state, u.location.country].filter(Boolean).join(', ')
                                : u.location;
                            }
                            setViewUser({
                              name, 
                              email, 
                              phone, 
                              location: locStr || 'N/A',
                              joined: new Date(u.createdAt).toLocaleDateString(), 
                              status: isApproved ? 'active' : 'pending',
                              // Employer specific
                              industry: isEmployers && (u.company?.industryType || u.industry),
                              gst: isEmployers && u.business?.gstNumber,
                              pan: isEmployers && u.business?.panNumber,
                              cin: isEmployers && u.business?.cinNumber,
                              // Candidate specific
                              skills: isCandidates && (Array.isArray(u.skills) ? u.skills.join(', ') : u.skills),
                              // Trainer specific
                              experience: isTrainers && u.experience,
                              qualification: isTrainers && u.highestQualification,
                              specialization: isTrainers && u.specialization
                            });
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteUser({ id: u._id, name })}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-3 md:px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 gap-2 flex-wrap">
          <span className="text-xs sm:text-sm">Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries</span>
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
                className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                style={p === page ? { background: '#3385AA', color: '#fff' } : { color: '#6b7280' }}
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

      {/* ── VIEW MODAL ── */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #1a2e3b 0%, #3385AA 100%)' }}>
              <h3 className="text-white font-semibold text-base">{title} Details</h3>
              <button onClick={() => setViewUser(null)} className="text-white/70 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Avatar + Name */}
            <div className="flex flex-col items-center pt-6 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3" style={{ background: color }}>
                {viewUser.name.charAt(0)}
              </div>
              <p className="text-lg font-bold text-gray-800">{viewUser.name}</p>
              <span className={`mt-1 px-3 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge(viewUser.status)}`}>{viewUser.status}</span>
            </div>
            {/* Details */}
            <div className="px-6 py-4 space-y-3">
              {[
                { icon: Mail, label: 'Email', value: viewUser.email },
                { icon: Phone, label: 'Phone', value: viewUser.phone },
                { icon: MapPin, label: 'Location', value: viewUser.location },
                // Employer extra info
                viewUser.industry && { icon: Briefcase, label: 'Industry', value: viewUser.industry },
                viewUser.gst && { icon: FileText, label: 'GST Number', value: viewUser.gst },
                viewUser.pan && { icon: FileText, label: 'PAN Number', value: viewUser.pan },
                viewUser.cin && { icon: FileText, label: 'CIN Number', value: viewUser.cin },
                // Candidate extra info
                viewUser.skills && { icon: Briefcase, label: 'Skills', value: viewUser.skills },
                // Trainer extra info
                viewUser.specialization && { icon: Briefcase, label: 'Specialization', value: viewUser.specialization },
                viewUser.experience && { icon: FileText, label: 'Experience', value: viewUser.experience },
                viewUser.qualification && { icon: GraduationCap, label: 'Qualification', value: viewUser.qualification },
                // General
                { icon: UserCheck, label: 'Joined', value: viewUser.joined },
              ].filter(Boolean).map(({ icon: Ic, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                    <Ic size={14} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={() => setViewUser(null)}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3385AA, #1a6b8a)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Confirm Delete</h3>
              <button onClick={() => setDeleteUser(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <p className="text-gray-700 font-medium">Delete <span className="font-bold text-gray-900">{deleteUser.name}</span>?</p>
              <p className="text-sm text-gray-400">This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => setDeleteUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteUser.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
