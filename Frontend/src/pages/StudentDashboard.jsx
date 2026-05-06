import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyDashboard } from '../services/api';

const gradeFromPct = (obtained, max) => {
  const p = (obtained / max) * 100;
  if (p >= 90) return 'A+'; if (p >= 80) return 'A'; if (p >= 70) return 'B+';
  if (p >= 60) return 'B';  if (p >= 50) return 'C'; if (p >= 33) return 'D';
  return 'F';
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDashboard().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
    </div>
  );

  const { student, result, activeSession } = data || {};

  return (
    <div className="px-10 py-8 max-w-[1200px]">

      
      <div className="mb-7">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Student Portal</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Welcome back, {user?.name}. Here's your academic summary.</p>
      </div>


      <div className="grid grid-cols-4 gap-4 mb-6">
  
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="text-[12px] text-gray-500 font-medium mb-2">Current Status</div>
          {result
            ? <div className={`text-lg font-bold flex items-center gap-1 ${result.status==='PASS'?'text-green-500':'text-red-500'}`}>
                {result.status} {result.status==='PASS'?'✅':'❌'}
              </div>
            : <div className="text-[14px] text-gray-400">No result yet</div>}
          <div className="text-[11px] text-gray-400 mt-1">Overall status</div>
        </div>
     
        <div className="bg-white rounded-lg p-5 border-t-2 border-t-amber-400 border-x-gray-200 border-b-gray-200 border shadow-sm">
          <div className="text-[12px] text-gray-500 font-medium mb-2">Percentage</div>
          <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-1">{result?.percentage ?? '--'}%</div>
          <div className="text-[11px] text-gray-400">Total marks</div>
        </div>
  
        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="text-[12px] text-gray-500 font-medium mb-2">Grade</div>
          <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-1">{result?.grade ?? '--'}</div>
          <div className="text-[11px] text-gray-400">Overall grade</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="text-[12px] text-gray-500 font-medium mb-2">Total Marks</div>
          <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none mb-1">
            {result ? `${result.totalMarks}/${result.maxTotalMarks}` : '--'}
          </div>
          <div className="text-[11px] text-gray-400">Sum of all subjects</div>
        </div>
      </div>

    
      <div className="grid gap-5" style={{ gridTemplateColumns:'1fr 360px' }}>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
            <div className="text-[15px] font-semibold text-gray-900">Subject Overview</div>
            <div className="text-[12px] text-gray-500 mt-0.5">Performance for {activeSession?.name || '--'}</div>
          </div>
          <div className="p-5">
            {result?.marks?.length > 0 ? result.marks.map((m,i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-gray-900">{m.subject?.name}</div>
                  <div className="text-[11px] text-gray-400 mt-px">{m.subject?.code}</div>
                </div>
                <div className="text-right mr-3">
                  <div className="text-[13px] font-semibold text-gray-900">{m.marksObtained}/{m.subject?.maxMarks}</div>
                  <div className="text-[11px] text-gray-400 mt-px">Passing: {m.subject?.passingMarks}</div>
                </div>
                <div className="w-7 h-7 rounded-[5px] bg-[#1a1a2e] text-white flex items-center justify-center text-[11px] font-bold">
                  {gradeFromPct(m.marksObtained, m.subject?.maxMarks)}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="text-4xl mb-3 opacity-40">📊</div>
                <div className="text-[14px] font-medium">No results yet</div>
                <div className="text-[12px]">Results will appear after marks are entered</div>
              </div>
            )}
          </div>
        </div>

       
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
            <div className="text-[15px] font-semibold text-gray-900">Profile Details</div>
            <div className="text-[12px] text-gray-500 mt-0.5">Your student information</div>
          </div>
          <div className="p-5">
            {[
              ['NAME',            student?.name],
              ['ROLL NUMBER',     student?.rollNumber],
              ['REGISTRATION NO', student?.registrationNo],
              ['CLASS',           `${student?.className} - ${student?.section}`],
              ['EMAIL',           student?.email],
            ].map(([label, val]) => (
              <div key={label} className="mb-4">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
                <div className="text-[14px] font-medium text-gray-900">{val || '--'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}