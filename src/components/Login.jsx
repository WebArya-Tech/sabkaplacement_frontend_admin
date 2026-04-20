import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import API from '../services/api'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    
    try {
      const response = await API.post('/auth/login', form)
      const { token, user } = response.data.data
      
      if (user.role !== 'admin') {
        setError('Access denied. Admin role required.')
        setLoading(false)
        return
      }
      
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('adminData', JSON.stringify(user))
      onLogin()
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4" style={{ background: '#f0f4f8' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Top banner */}
          <div className="px-5 py-6 sm:px-8 sm:py-8 text-center border-b border-gray-100">
            <div className="flex justify-center mb-4">
              <img src="/logo.jpeg" alt="Admin Panel Logo" className="h-14 w-auto object-contain" />
            </div>
            <p className="text-xl font-bold text-gray-800">Admin Panel</p>
            <p className="text-xs mt-1 text-gray-400">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[#3385AA] focus:ring-2 focus:ring-[#3385AA]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-[#3385AA] focus:ring-2 focus:ring-[#3385AA]/10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="font-medium hover:opacity-80" style={{ color: '#3385AA' }}>Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white font-bold text-base tracking-wide transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #3385AA 0%, #1a6b8a 100%)', boxShadow: '0 4px 15px rgba(51,133,170,0.4)' }}
              >
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: '#3385AA' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#94a3b8' }}>© 2026 AdminPanel. All rights reserved.</p>
      </div>
    </div>
  )
}
