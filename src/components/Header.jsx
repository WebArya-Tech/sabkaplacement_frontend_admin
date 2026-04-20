import React, { useState, useRef, useEffect } from 'react'
import { Bell, Search, Menu, Settings, X, CheckCircle, Briefcase, Users, BookOpen, Monitor, Moon, Globe, Shield, Info } from 'lucide-react'
import Profile from './Profile'

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

const NOTIFICATIONS = [
  { id: 1, icon: Briefcase, color: '#3385AA', title: 'New job posted', desc: 'TechCorp posted a new Full-Time role', time: '2 min ago', unread: true },
  { id: 2, icon: Users, color: '#10b981', title: 'New candidate registered', desc: 'Priya Sharma joined as a candidate', time: '15 min ago', unread: true },
  { id: 3, icon: CheckCircle, color: '#f59e0b', title: 'Job approved', desc: 'Senior Developer role has been approved', time: '1 hr ago', unread: true },
  { id: 4, icon: BookOpen, color: '#8b5cf6', title: 'Course assigned', desc: 'React Basics assigned to Trainer Ravi', time: '3 hr ago', unread: false },
  { id: 5, icon: Users, color: '#e74c3c', title: 'User reported', desc: 'A candidate account was flagged as spam', time: 'Yesterday', unread: false },
]

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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('English')
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const notifRef = useRef(null)
  const settingsRef = useRef(null)

  useClickOutside(notifRef, () => setNotifOpen(false))
  useClickOutside(settingsRef, () => setSettingsOpen(false))

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  const dismissNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

  return (
    <>
      {profileOpen && <Profile onClose={() => setProfileOpen(false)} onLogout={onLogout} />}

      {/* Privacy & Security Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setPrivacyOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Shield size={18} style={{ color: '#3385AA' }} />
                <h3 className="text-base font-bold text-gray-800">Privacy &amp; Security</h3>
              </div>
              <button onClick={() => setPrivacyOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: true },
                { label: 'Login Activity Alerts', desc: 'Get notified on new device logins', enabled: true },
                { label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity', enabled: false },
                { label: 'Data Export', desc: 'Allow exporting your admin data', enabled: false },
              ].map(({ label, desc, enabled }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <div className="relative w-10 h-5 rounded-full shrink-0" style={{ background: enabled ? '#3385AA' : '#d1d5db' }}>
                    <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow" style={{ left: enabled ? '22px' : '2px' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => setPrivacyOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #3385AA, #1a6b8a)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setAboutOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Info size={18} style={{ color: '#3385AA' }} />
                <h3 className="text-base font-bold text-gray-800">About</h3>
              </div>
              <button onClick={() => setAboutOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-6 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #1a2e3b, #3385AA)' }}>A</div>
              <h4 className="text-lg font-bold text-gray-800">Admin Panel</h4>
              <p className="text-xs text-gray-400 mt-1">Sabka Placement Management System</p>
              <div className="mt-5 space-y-2 text-left">
                {[
                  ['Version', '1.0.0'],
                  ['Build', 'April 2026'],
                  ['Framework', 'React + Vite'],
                  ['License', 'Private'],
                  ['Support', 'admin@sabkaplacement.com'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between px-4 py-2 bg-gray-50 rounded-xl">
                    <span className="text-xs text-gray-500 font-medium">{k}</span>
                    <span className="text-xs text-gray-700 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 pb-5">
              <button onClick={() => setAboutOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #3385AA, #1a6b8a)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-56" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Search size={15} style={{ color: 'rgba(255,255,255,0.8)' }} className="shrink-0" />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full" style={{ color: '#fff' }} />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(v => !v); setSettingsOpen(false) }}
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
                    ) : notifications.map(({ id, icon: Icon, color, title: t, desc, time, unread }) => (
                      <div key={id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${unread ? 'bg-[#eaf4f9]' : ''}`}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: color + '18' }}>
                          <Icon size={14} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700">{t}</p>
                          <p className="text-xs text-gray-400 truncate">{desc}</p>
                          <p className="text-[10px] text-gray-300 mt-0.5">{time}</p>
                        </div>
                        <button onClick={() => dismissNotif(id)} className="shrink-0 p-0.5 hover:bg-gray-200 rounded-md transition-colors mt-0.5">
                          <X size={11} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative hidden sm:block" ref={settingsRef}>
              <button
                onClick={() => { setSettingsOpen(v => !v); setNotifOpen(false) }}
                className="p-2.5 rounded-xl transition-colors"
                style={{ color: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <Settings size={18} />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800">Settings</h3>
                  </div>
                  <div className="p-2 space-y-1">
                    {/* Dark Mode toggle */}
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Moon size={15} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Dark Mode</span>
                      </div>
                      <button
                        onClick={() => setDarkMode(v => !v)}
                        className="relative w-9 h-5 rounded-full transition-colors"
                        style={{ background: darkMode ? '#3385AA' : '#d1d5db' }}
                      >
                        <span
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                          style={{ left: darkMode ? '17px' : '2px' }}
                        />
                      </button>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Globe size={15} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Language</span>
                      </div>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1 outline-none"
                        style={{ accentColor: '#3385AA' }}
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Gujarati</option>
                      </select>
                    </div>

                    {/* Privacy */}
                    <button onClick={() => { setPrivacyOpen(true); setSettingsOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <Shield size={15} className="text-gray-500" />
                      <span className="text-sm text-gray-700">Privacy &amp; Security</span>
                    </button>

                    {/* About */}
                    <button onClick={() => { setAboutOpen(true); setSettingsOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                      <Info size={15} className="text-gray-500" />
                      <span className="text-sm text-gray-700">About</span>
                    </button>

                    <div className="pt-1 border-t border-gray-100 px-3 py-2">
                      <p className="text-[10px] text-gray-300">Admin Panel v1.0.0</p>
                    </div>
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
