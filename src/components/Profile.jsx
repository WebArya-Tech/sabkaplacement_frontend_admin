import React, { useState } from 'react'
import { X, Shield, MapPin, Calendar, Edit3, Camera, CheckCircle, LogOut } from 'lucide-react'

const adminData = {
  name: 'Admin User',
  role: 'Super Administrator',
  id: 'ADMIN2026001',
  email: 'admin@sabkaplacement.com',
  phone: '+91 98765 43210',
  location: 'New Delhi, India',
  joined: 'January 2024',
  department: 'IT & Operations',
  access: 'Full Access',
}

// Persists edited values across drawer open/close
let persistedForm = {
  name: adminData.name,
  email: adminData.email,
  phone: adminData.phone,
  location: adminData.location,
}

export default function Profile({ onClose, onLogout }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...persistedForm })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    persistedForm = { ...form }  // persist for next open
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer — slides in from LEFT (same side as sidebar) */}
      <div
        className="fixed top-0 right-0 h-full z-50 w-full bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: '1100px', animation: 'slideInLeft 0.25s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0 flex-1 pr-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">My Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Manage your personal information and settings</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #3385AA, #1a6b8a)' }}
              >
                <Edit3 size={14} /> <span className="hidden sm:inline">Edit Profile</span>
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Avatar */}
          <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1a2e3b 0%, #3385AA 100%)', border: '4px solid #e0f0f7' }}
                >
                  A
                </div>
                <button
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ background: '#3385AA' }}
                  title="Change Photo"
                >
                  <Camera size={13} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{form.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Admin ID: {adminData.id}</p>
                <p className="text-xs text-gray-500">{form.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: '#1a2e3b' }}>
                    {adminData.department}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: '#3385AA' }}>
                    {adminData.access}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save success */}
          {saved && (
            <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              <CheckCircle size={15} /> Profile updated successfully!
            </div>
          )}

          {/* Personal Information */}
          <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
            <h4 className="text-sm font-bold mb-4" style={{ color: '#3385AA' }}>Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email Address', key: 'email' },
                { label: 'Phone Number', key: 'phone' },
                { label: 'Location', key: 'location' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                  {editing ? (
                    <input
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#3385AA] focus:ring-2 focus:ring-[#3385AA]/10"
                    />
                  ) : (
                    <div className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700">{form[key]}</div>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm text-white font-semibold transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #3385AA, #1a6b8a)' }}>
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="px-4 sm:px-6 py-5 border-b border-gray-100">
            <h4 className="text-sm font-bold mb-4" style={{ color: '#3385AA' }}>Account Details</h4>
            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Role', value: adminData.role },
                { icon: Calendar, label: 'Member Since', value: adminData.joined },
                { icon: MapPin, label: 'Department', value: adminData.department },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#eaf4f9' }}>
                    <Icon size={16} style={{ color: '#3385AA' }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 sm:px-6 py-6 mt-auto">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut size={18} />
              Logout Session
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-semibold">
              Sabkaplacement Admin v4.0.1
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
