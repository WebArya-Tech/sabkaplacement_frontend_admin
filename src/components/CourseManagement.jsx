import React, { useState, useEffect } from 'react'
import API from '../services/api'
import { useLocation } from 'react-router-dom'
import {
  BookOpen,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  UserCheck,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  GraduationCap,
} from 'lucide-react'

const statusBadge = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  inactive: 'bg-gray-100 text-gray-600 border border-gray-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
}

function CourseFormModal({ course, trainers, onClose, onSave }) {
  const isEdit = !!course?._id
  const [form, setForm] = useState(
    course || { title: '', trainer: '', duration: '', price: '', category: '', status: 'draft' }
  )

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Course' : 'Add New Course'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Advanced React Development"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3385AA] focus:ring-2 focus:ring-[#3385AA]/10"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3385AA] bg-white"
              >
                <option value="">Select...</option>
                {['Development', 'Data Science', 'Cloud', 'Marketing', 'Design'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g. 8 weeks"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3385AA]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. ₹8,000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3385AA]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3385AA] bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign Trainer</label>
            <select
              name="trainer"
              value={typeof form.trainer === 'object' ? form.trainer?._id : form.trainer}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3385AA] bg-white"
            >
              <option value="">Select Trainer...</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>{t.fullName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium hover:opacity-90 transition-opacity"
              style={{ background: '#3385AA' }}
            >
              {isEdit ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AssignTrainerModal({ course, courses, trainers, onClose, onAssign }) {
  const [selectedCourseId, setSelectedCourseId] = useState(course?._id || '')
  const [selectedTrainerId, setSelectedTrainerId] = useState('')

  const handleAssignClick = () => {
    if (!selectedCourseId || !selectedTrainerId) return
    onAssign(selectedCourseId, selectedTrainerId)
  }

  const activeCourse = course || courses.find((c) => c._id === selectedCourseId)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#eaf4f9' }}>
              <UserCheck size={16} style={{ color: '#3385AA' }} />
            </div>
            <h3 className="text-base font-bold text-gray-800">Assign Trainer</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Course</label>
            {course ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#eaf4f9' }}>
                  <GraduationCap size={14} style={{ color: '#3385AA' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{course.title}</p>
                  <p className="text-xs text-gray-400">{course.category} &bull; {course.duration}</p>
                </div>
              </div>
            ) : (
              <select
                value={selectedCourseId}
                onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedTrainerId('') }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white"
              >
                <option value="">-- Select a course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title} ({c.category})</option>
                ))}
              </select>
            )}
          </div>

          {activeCourse && activeCourse.trainerName && activeCourse.trainerName !== 'Unassigned' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
              <span className="text-xs text-amber-600 font-medium">Current Trainer:</span>
              <span className="text-xs text-amber-700 font-semibold">{activeCourse.trainerName}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Trainer</label>
            <div className="space-y-2">
              {trainers.map((t) => (
                <button
                  key={t._id}
                  onClick={() => setSelectedTrainerId(t._id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    selectedTrainerId === t._id
                      ? 'border-[#3385AA] bg-[#eaf4f9]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: selectedTrainerId === t._id ? '#3385AA' : '#94a3b8' }}
                    >
                      {t.fullName?.charAt(0) || 'T'}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 text-sm">{t.fullName}</p>
                      <p className="text-xs text-gray-400">{t.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">Expert</p>
                    </div>
                    {selectedTrainerId === t._id
                      ? <Check size={15} style={{ color: '#3385AA' }} />
                      : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button
              onClick={handleAssignClick}
              disabled={!selectedCourseId || !selectedTrainerId}
              className="flex-1 py-2.5 rounded-xl text-sm text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#3385AA' }}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CourseManagement() {
  const location = useLocation()
  const path = location.pathname
  const isAssignPage = path === '/courses/assign'

  const [courses, setCourses] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(path === '/courses/add')
  const [editCourse, setEditCourse] = useState(null)
  const [assignCourse, setAssignCourse] = useState(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [coursesRes, trainersRes] = await Promise.all([
        API.get('/admin/courses'),
        API.get('/trainers') // Public trainers list or specify admin list
      ])
      setCourses(coursesRes.data.data)
      setTrainers(trainersRes.data.data)
    } catch (err) {
      console.error('Failed to fetch courses/trainers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (path === '/courses/add') {
      setShowForm(true)
      setEditCourse(null)
    } else if (path === '/courses') {
      setShowForm(false)
      setAssignModalOpen(false)
      setEditCourse(null)
      setAssignCourse(null)
    }
  }, [path])

  const handleSave = async (form) => {
    setLoading(true)
    try {
      const payload = { ...form }
      if (!payload.trainer) {
        delete payload.trainer // Remove empty string to prevent ObjectId CastError in Mongoose
      }
      
      if (payload._id) {
        await API.put(`/admin/courses/${payload._id}`, payload)
      } else {
        await API.post('/admin/courses', payload)
      }
      setShowForm(false)
      setEditCourse(null)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save course')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (courseId, trainerId) => {
    setLoading(true)
    try {
      await API.put(`/admin/courses/${courseId}/assign`, { trainerId })
      setAssignCourse(null)
      setAssignModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign trainer')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await API.delete(`/admin/courses/${id}`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course')
    }
  }

  const filtered = courses.filter((c) =>
    (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
    (c.trainerName && c.trainerName.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading && courses.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3385AA]/30 border-t-[#3385AA] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {(showForm || editCourse) && (
        <CourseFormModal
          course={editCourse}
          trainers={trainers}
          onClose={() => { setShowForm(false); setEditCourse(null) }}
          onSave={handleSave}
        />
      )}
      {assignModalOpen && (
        <AssignTrainerModal
          course={assignCourse}
          courses={courses}
          trainers={trainers}
          onClose={() => { setAssignCourse(null); setAssignModalOpen(false) }}
          onAssign={handleAssign}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen, color: '#3385AA', bg: '#eaf4f9' },
          { label: 'Active Courses', value: courses.filter((c) => c.status === 'active').length, icon: Check, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Total Students', value: courses.reduce((s, c) => s + (c.studentsCount || 0), 0), icon: Users, color: '#9333ea', bg: '#faf5ff' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                <Icon size={16} className="sm:hidden" style={{ color: s.color }} />
                <Icon size={22} className="hidden sm:block" style={{ color: s.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">
            {isAssignPage ? 'All Courses' : 'All Courses'}
          </h2>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 sm:flex-none sm:w-52">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-600 outline-none w-full"
              />
            </div>
            {isAssignPage ? (
              <button
                onClick={() => { setAssignCourse(null); setAssignModalOpen(true) }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white font-medium hover:opacity-90 transition-opacity"
                style={{ background: '#3385AA' }}
              >
                <UserCheck size={15} /> Assign Trainer
              </button>
            ) : (
              <button
                onClick={() => { setEditCourse(null); setShowForm(true) }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white font-medium hover:opacity-90 transition-opacity"
                style={{ background: '#3385AA' }}
              >
                <PlusCircle size={15} /> Add Course
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Trainer</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Duration</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Students</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Price</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                <th className="text-left px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-3 md:px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No courses found</td></tr>
              )}
              {filtered.map((c, idx) => (
                <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-3 md:px-5 py-3.5 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-3 md:px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#eaf4f9' }}>
                        <GraduationCap size={14} style={{ color: '#3385AA' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[120px] md:max-w-none">{c.title}</p>
                        <p className="text-xs text-gray-400">{c.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-5 py-3.5 hidden sm:table-cell">
                    {c.trainerName === 'Unassigned' ? (
                      <span className="text-xs text-amber-500 font-medium italic">Unassigned</span>
                    ) : (
                      <span className="text-gray-600">{c.trainerName}</span>
                    )}
                  </td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1"><Clock size={12} />{c.duration}</span>
                  </td>
                  <td className="px-3 md:px-5 py-3.5 text-gray-600 font-medium hidden md:table-cell">{c.studentsCount}</td>
                  <td className="px-3 md:px-5 py-3.5 font-medium text-gray-700 hidden lg:table-cell">{c.price}</td>
                  <td className="px-3 md:px-5 py-3.5 hidden lg:table-cell">
                    {c.rating > 0 ? (
                      <span className="flex items-center gap-1 text-amber-500 font-medium">
                        <Star size={13} fill="currentColor" />{c.rating}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">N/A</span>
                    )}
                  </td>
                  <td className="px-3 md:px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setAssignCourse(c); setAssignModalOpen(true) }}
                        title="Assign Trainer"
                        className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 transition-colors"
                      >
                        <UserCheck size={15} />
                      </button>
                      <button
                        onClick={() => setEditCourse(c)}
                        title="Edit"
                        className="p-1.5 rounded-lg hover:bg-[#eaf4f9] transition-colors"
                        style={{ color: '#3385AA' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      {!isAssignPage && (
                        <button
                          onClick={() => handleDelete(c._id)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filtered.length} of {courses.length} courses</span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft size={15} /></button>
            <button className="w-7 h-7 rounded-lg text-white text-xs font-medium" style={{ background: '#3385AA' }}>1</button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
