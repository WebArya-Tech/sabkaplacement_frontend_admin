import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Building2,
  UserCheck,
  UserCog,
  PlusCircle,
  BookOpen,
  X,
  Menu,
  LogOut,
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    label: 'Job Management',
    icon: Briefcase,
    children: [
      { label: 'View Jobs', path: '/jobs' },
      { label: 'Approve Jobs', path: '/jobs/approve' },
      { label: 'Rejected Jobs', path: '/jobs/rejected' },
      { label: 'Spam Jobs', path: '/jobs/spam' },
    ],
  },
  {
    label: 'User Management',
    icon: Users,
    children: [
      { label: 'Employers', path: '/users/employers' },
      { label: 'Candidates', path: '/users/candidates' },
      { label: 'Trainers', path: '/users/trainers' },
    ],
  },
  {
    label: 'Course Management',
    icon: GraduationCap,
    children: [
      { label: 'All Courses', path: '/courses' },
      { label: 'Add Course', path: '/courses/add' },
      { label: 'Assign Trainer', path: '/courses/assign' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const [openMenus, setOpenMenus] = useState({ 'Job Management': true })

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300
          w-64 lg:translate-x-0 lg:static lg:z-auto bg-white border-r border-gray-100 shadow-sm
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo — white background */}
        <div className="flex items-center justify-between px-5 bg-white border-b border-gray-100 shrink-0" style={{ height: '72px' }}>
          <img src="/logo.jpeg" alt="Logo" className="h-10 w-auto object-contain" />
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Nav — #3385AA background */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1" style={{ background: '#3385AA' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            if (!item.children) {
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive ? 'bg-white shadow-md' : 'text-white/80 hover:bg-white/20 hover:text-white'}`
                  }
                  style={({ isActive }) => isActive ? { color: '#3385AA' } : {}}
                >
                  <Icon size={18} className="shrink-0" />
                  {item.label}
                </NavLink>
              )
            }

            const isOpen = openMenus[item.label]
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} className="shrink-0" />
                    {item.label}
                  </span>
                  {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </button>
                {isOpen && (
                  <div className="mt-1 ml-4 pl-3 space-y-0.5" style={{ borderLeft: '2px solid rgba(255,255,255,0.3)' }}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${isActive ? 'bg-white shadow-sm' : 'text-white/70 hover:bg-white/20 hover:text-white'}`
                        }
                        style={({ isActive }) => isActive ? { color: '#3385AA', fontWeight: 600 } : {}}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer — same #3385AA background */}
        <div className="px-4 py-4 space-y-3 border-t border-white/20" style={{ background: '#3385AA' }}>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            onClick={() => { onClose(); onLogout() }}
          >
            <LogOut size={17} className="shrink-0" />
            Logout
          </button>
          <p className="text-xs text-center text-white/40">© 2026 AdminPanel v1.0</p>
        </div>
      </aside>
    </>
  )
}
