import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getTeacherDashboard } from '../services/api';

const StatCard = ({ label, value, desc, yellow }) => (
  <div className={`bg-white rounded-lg p-5 border shadow-sm ${yellow ? 'border-t-2 border-t-amber-400 border-x-gray-200 border-b-gray-200' : 'border-gray-200'}`}>
    <div className="text-[12px] text-gray-500 font-medium mb-2">{label}</div>
    <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-1">{value}</div>
    <div className="text-[11px] text-gray-400">{desc}</div>
  </div>
);

export default function TeacherDashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherDashboard().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="px-10 py-8 max-w-[1200px]">

      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>
        {data?.activeSession && (
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-[12px] text-gray-500 font-medium">
            🕐 Active Session: {data.activeSession.name} ({data.activeSession.year})
          </div>
        )}
      </div>

 
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students"  value={data?.totalStudents  || 0} desc="Registered in system" />
        <StatCard label="Pass Percentage" value={`${data?.passPercentage || 0}%`} desc="Across all subjects" yellow />
        <StatCard label="Total Subjects"  value={data?.totalSubjects  || 0} desc="Offered courses" />
        <StatCard label="Average Score"   value={data?.averageScore   || 0} desc="Overall average marks" />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px' }}>


        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
            <div className="text-[15px] font-semibold text-gray-900">Top Performers</div>
            <div className="text-[12px] text-gray-500 mt-0.5">Highest ranking students for the active session.</div>
          </div>
          {data?.topPerformers?.length > 0 ? data.topPerformers.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <div className="w-[30px] h-[30px] bg-gray-100 rounded-full flex items-center justify-center text-[12px] font-semibold text-gray-500 shrink-0">
                #{i + 1}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-gray-900">{s.name}</div>
                <div className="text-[11px] text-gray-400 mt-px">{s.className} | Roll: {s.rollNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-bold text-gray-900">{s.percentage}%</div>
                <div className="text-[11px] text-gray-400">{s.totalMarks} / {s.maxTotalMarks}</div>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 px-5 text-gray-400">
              <div className="text-4xl mb-3 opacity-40">📊</div>
              <div className="text-[14px] font-medium">No results yet</div>
              <div className="text-[12px]">Add marks to see top performers</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
            <div className="text-[15px] font-semibold text-gray-900">Quick Actions</div>
            <div className="text-[12px] text-gray-500 mt-0.5">Common tasks and links</div>
          </div>
          <div className="p-5 flex flex-col gap-2.5">
            {[
              { icon: '📖', title: 'Enter Marks',     desc: 'Update student scores',    path: '/teacher/marks-entry' },
              { icon: '👥', title: 'Manage Students', desc: 'Add or edit profiles',     path: '/teacher/students' },
              { icon: '📈', title: 'View Analytics',  desc: 'Detailed performance metrics', path: '/teacher/analytics' },
            ].map(qa => (
              <div key={qa.path} onClick={() => navigate(qa.path)}
                className="flex items-center gap-3.5 p-3.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all">
                <div className="w-[38px] h-[38px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 shrink-0 text-lg">{qa.icon}</div>
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">{qa.title}</div>
                  <div className="text-[11px] text-gray-400 mt-px">{qa.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}