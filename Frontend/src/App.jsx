import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';

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
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-[210px] flex-1 min-h-screen bg-gray-50">
        {children}
      </main>
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