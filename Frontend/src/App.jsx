import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './Components/Sidebar';

// Pages
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import Students from './pages/Students';
import MarksEntry from './pages/MarksEntry';
import Subjects from './pages/Subjects';
import Sessions from './pages/Sessions';
import Analytics from './pages/Analytics';
import StudentDashboard from './pages/StudentDashboard';
import Results from './pages/Studentresult';
import Performance from './pages/StudentPerformance';

function ProtectedLayout({ children, requiredRole }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-h-screen md:ml-[210px]">
        <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 md:hidden">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span className="text-lg">☰</span>
              Menu
            </button>
            <div className="text-sm font-semibold text-gray-900">BRCMportal</div>
          </div>
        </div>

        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace /> : <Login />
      } />
      <Route path="/register" element={
        user ? <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace /> : <Register />
      } />

      <Route path="/teacher/dashboard"  element={<ProtectedLayout requiredRole="teacher"><TeacherDashboard /></ProtectedLayout>} />
      <Route path="/teacher/students"   element={<ProtectedLayout requiredRole="teacher"><Students /></ProtectedLayout>} />
      <Route path="/teacher/marks-entry"element={<ProtectedLayout requiredRole="teacher"><MarksEntry /></ProtectedLayout>} />
      <Route path="/teacher/subjects"   element={<ProtectedLayout requiredRole="teacher"><Subjects /></ProtectedLayout>} />
      <Route path="/teacher/sessions"   element={<ProtectedLayout requiredRole="teacher"><Sessions /></ProtectedLayout>} />
      <Route path="/teacher/analytics"  element={<ProtectedLayout requiredRole="teacher"><Analytics /></ProtectedLayout>} />

      <Route path="/student/dashboard"  element={<ProtectedLayout requiredRole="student"><StudentDashboard /></ProtectedLayout>} />
      <Route path="/student/results"    element={<ProtectedLayout requiredRole="student"><Results /></ProtectedLayout>} />
      <Route path="/student/performance"element={<ProtectedLayout requiredRole="student"><Performance /></ProtectedLayout>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}