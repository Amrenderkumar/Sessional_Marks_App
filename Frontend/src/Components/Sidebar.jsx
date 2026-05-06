import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Icons = {
  Book: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Dashboard: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Students: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Marks: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  Subject: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Session: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Analytics: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Results: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Performance: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Logout: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const teacherNav = [
  { label: 'Dashboard',   icon: 'Dashboard',   path: '/teacher/dashboard' },
  { label: 'Students',    icon: 'Students',    path: '/teacher/students' },
  { label: 'Marks Entry', icon: 'Marks',       path: '/teacher/marks-entry' },
  { label: 'Subjects',    icon: 'Subject',     path: '/teacher/subjects' },
  { label: 'Sessions',    icon: 'Session',     path: '/teacher/sessions' },
  { label: 'Analytics',   icon: 'Analytics',   path: '/teacher/analytics' },
];

const studentNav = [
  { label: 'Dashboard',   icon: 'Dashboard',   path: '/student/dashboard' },
  { label: 'My Results',  icon: 'Results',     path: '/student/results' },
  { label: 'Performance', icon: 'Performance', path: '/student/performance' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const navItems  = user?.role === 'teacher' ? teacherNav : studentNav;
  const initial   = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <aside className="fixed top-0 left-0 h-screen w-[210px] bg-[#0f1117] flex flex-col z-50">

      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#1e2030]">
        <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center text-base">📖</div>
        <span className="text-white text-[15px] font-bold tracking-tight">BRCMportal</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1e2030]">
        <div className="w-[34px] h-[34px] bg-gray-700 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-[13px] font-medium truncate">{user?.name}</div>
          <div className="text-gray-500 text-[11px] capitalize">{user?.role}</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon     = Icons[item.icon];
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] w-full text-left border-none cursor-pointer transition-all duration-150
                ${isActive
                  ? 'bg-[#1c2235] text-amber-400 font-medium border-l-[3px] border-amber-400'
                  : 'bg-transparent text-gray-400 hover:bg-[#1c1f2e] hover:text-gray-300'}`}
            >
              <Icon />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-[#1e2030]">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-gray-400 text-[13px] cursor-pointer w-full border-none bg-transparent transition-all hover:bg-[#1e2030] hover:text-red-400"
        >
          <Icons.Logout />
          Logout
        </button>
      </div>
    </aside>
  );
}