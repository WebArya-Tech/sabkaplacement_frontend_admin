import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bell, Search, Menu, X, CheckCircle, Briefcase, Users, BookOpen, Monitor } from 'lucide-react'
import Profile from './Profile'
import API from '../services/api'

const pageTitles = {
  '/': 'Dashboard',
  '/jobs': 'Job Management',
  '/jobs/approve': 'Approve Jobs',
  '/jobs/rejected': 'Rejected Jobs',
  '/jobs/spam': 'Spam Jobs',
  '/users/employers': 'Employers',
  '/users/candidates': 'Candidates',
  '/users/trainers': 'Trainers',
  '/courses': 'All Courses',
  '/courses/add': 'Add Course',
  '/courses/assign': 'Assign Trainer',
}

// Notifications fetched from API

function useClickOutside(ref, callback) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) callback() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, callback])
}

export default function Header({ onMenuToggle, currentPath, onLogout }) {
  const title = pageTitles[currentPath] || 'Admin Panel'
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)

  const notifRef = useRef(null)
  const searchRef = useRef(null)

  useClickOutside(notifRef, () => setNotifOpen(false))
  useClickOutside(searchRef, () => setSearchOpen(false))

  const [globalSearch, setGlobalSearch] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!globalSearch.trim()) {
      setSearchResults(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const [jobsRes, compsRes] = await Promise.all([
          API.get('/admin/jobs'),
          API.get('/admin/companies')
        ])
        const q = globalSearch.toLowerCase()
        const jobs = jobsRes.data.data?.filter(j => j.title?.toLowerCase().includes(q) || j.companyId?.companyName?.toLowerCase().includes(q)).slice(0, 3) || []
        const comps = compsRes.data.data?.filter(c => c.companyName?.toLowerCase().includes(q)).slice(0, 3) || []
        setSearchResults({ jobs, comps })
      } catch (e) {
        console.error(e)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [globalSearch])

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications')
      if (res.data.success) {
        setNotifications(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Optional: Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    } catch (err) {
      console.error(err)
    }
  }

  const dismissNotif = async (id) => {
    try {
      await API.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {profileOpen && <Profile onClose={() => setProfileOpen(false)} onLogout={onLogout} />}

      <header className="sticky top-0 z-10 shadow-md" style={{ background: '#3385AA' }}>
        <div className="flex items-center justify-between px-3 md:px-6 py-4 h-[72px]">
          {/* Left */}
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg transition-colors" style={{ color: '#fff' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-sm md:text-lg font-bold leading-tight" style={{ color: '#fff' }}>{title}</h1>
              <p className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.7)' }}>Welcome back, Administrator</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 w-56" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <Search size={15} style={{ color: 'rgba(255,255,255,0.8)' }} className="shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search globally..." 
                  className="bg-transparent text-sm outline-none w-full" 
                  style={{ color: '#fff' }} 
                  value={globalSearch}
                  onChange={e => { setGlobalSearch(e.target.value); setSearchOpen(true) }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                       setSearchOpen(false)
                       navigate('/jobs') // Default redirect
                    }
                  }}
                />
              </div>

              {searchOpen && globalSearch.trim() && searchResults && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2">
                  {searchResults.jobs.length === 0 && searchResults.comps.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found for "{globalSearch}"</div>
                  ) : (
                    <>
                      {searchResults.comps.length > 0 && (
                        <div>
                          <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employers</p>
                          {searchResults.comps.map(c => (
                            <Link to="/users/employers" onClick={() => setSearchOpen(false)} key={c._id} className="block px-4 py-2 hover:bg-gray-50 text-sm">
                              <p className="font-semibold text-gray-800 truncate">{c.companyName}</p>
                              <p className="text-xs text-gray-500 truncate">{c.industry || 'Company'}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.jobs.length > 0 && (
                        <div className={searchResults.comps.length > 0 ? "border-t border-gray-50 mt-1 pt-1" : ""}>
                          <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jobs</p>
                          {searchResults.jobs.map(j => (
                            <Link to="/jobs" onClick={() => setSearchOpen(false)} key={j._id} className="block px-4 py-2 hover:bg-gray-50 text-sm">
                              <p className="font-semibold text-gray-800 truncate">{j.title}</p>
                              <p className="text-xs text-gray-500 truncate">{j.companyId?.companyName || 'Unknown'}</p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 md:p-2.5 rounded-xl transition-colors"
                style={{ color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: '#e74c3c' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 top-[72px] sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-medium" style={{ color: '#3385AA' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-400">No notifications</div>
                    ) : notifications.map(({ id, type, title: t, message, createdAt, unread }) => {
                      const color = type === 'success' ? '#10b981' : type === 'error' ? '#e74c3c' : '#3385AA'
                      const Icon = type === 'success' ? CheckCircle : type === 'error' ? Users : Briefcase
                      return (
                      <div key={id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${unread ? 'bg-[#eaf4f9]' : ''}`}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: color + '18' }}>
                          <Icon size={14} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700">{t}</p>
                          <p className="text-xs text-gray-400 truncate">{message}</p>
                          <p className="text-[10px] text-gray-300 mt-0.5">{new Date(createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => dismissNotif(id)} className="shrink-0 p-0.5 hover:bg-gray-200 rounded-md transition-colors mt-0.5">
                          <X size={11} className="text-gray-400" />
                        </button>
                      </div>
                    )})}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors cursor-pointer"
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow shrink-0" style={{ background: '#fff', color: '#3385AA' }}>
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold leading-tight" style={{ color: '#fff' }}>Admin</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Super Admin</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
