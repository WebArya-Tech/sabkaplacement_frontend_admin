import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import JobManagement from './components/JobManagement'
import UserManagement from './components/UserManagement'
import CourseManagement from './components/CourseManagement'
import Login from './components/Login'
import Register from './components/Register'

function Layout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          currentPath={location.pathname}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobManagement />} />
            <Route path="/jobs/approve" element={<JobManagement />} />
            <Route path="/jobs/approved" element={<JobManagement />} />
            <Route path="/jobs/rejected" element={<JobManagement />} />
            <Route path="/users/employers" element={<UserManagement />} />
            <Route path="/users/candidates" element={<UserManagement />} />
            <Route path="/users/trainers" element={<UserManagement />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/courses/add" element={<CourseManagement />} />
            <Route path="/courses/assign" element={<CourseManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('adminData')
    // Also clear localStorage just in case old tokens are lingering
    localStorage.removeItem('token')
    localStorage.removeItem('adminData')
    setIsLoggedIn(false)
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#3385AA]/30 border-t-[#3385AA] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <Layout onLogout={handleLogout} />
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
