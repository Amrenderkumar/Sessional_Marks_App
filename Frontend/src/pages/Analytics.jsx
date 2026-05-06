import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getAnalytics, getAllSessions } from '../services/api';

export default function Analytics() {
  const [data,    setData]    = useState(null);
  const [sessions,setSessions]= useState([]);
  const [selSess, setSelSess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { getAllSessions().then(r => setSessions(r.data)); }, []);

  useEffect(() => {
    setLoading(true);
    getAnalytics(selSess).then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [selSess]);

  const pieData = data ? [
    { name: 'Passed', value: data.passFailData?.passed || 0 },
    { name: 'Failed', value: data.passFailData?.failed || 0 },
  ] : [];

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">School performance metrics</p>
        </div>
        <select
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none min-w-[200px] cursor-pointer"
          value={selSess} onChange={e => setSelSess(e.target.value)}>
          <option value="">Active Session</option>
          {sessions.map(s => <option key={s._id} value={s._id}>{s.name}{s.isActive?' (Active)':''}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
        </div>
      ) : (
        <>
      
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label:'Overall Pass Rate',       value:`${data?.overallPassRate||0}%` },
              { label:'Global Average',           value: data?.globalAverage||0 },
              { label:'Total Subjects Evaluated', value: data?.totalSubjectsEvaluated||0 },
            ].map(c => (
              <div key={c.label} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                <div className="text-[12px] text-gray-500 font-medium mb-2">{c.label}</div>
                <div className="text-[28px] font-bold text-gray-900 tracking-tight leading-none">{c.value}</div>
              </div>
            ))}
          </div>

        
          <div className="grid gap-5" style={{ gridTemplateColumns:'1fr 380px' }}>

        
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
                <div className="text-[15px] font-semibold text-gray-900">Subject Performance</div>
                <div className="text-[12px] text-gray-500 mt-0.5">Average marks across all subjects</div>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data?.subjectAnalytics||[]} barGap={4}>
                    <XAxis dataKey="code" tick={{ fontSize:12 }} />
                    <YAxis tick={{ fontSize:11 }} domain={[0,100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgMarks" name="Avg Marks"   fill="#1a1a2e" radius={[3,3,0,0]} />
                    <Bar dataKey="passRate"  name="Pass Rate %" fill="#f59e0b" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
                <div className="text-[15px] font-semibold text-gray-900">Pass/Fail Distribution</div>
                <div className="text-[12px] text-gray-500 mt-0.5">Global pass rate overview</div>
              </div>
              <div className="p-5 flex flex-col items-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                      <Cell fill="#1a1a2e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-5 mt-2">
                  <span className="flex items-center gap-1.5 text-[12px]">
                    <span className="w-2.5 h-2.5 bg-[#1a1a2e] rounded-full inline-block"/> Passed
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-red-500">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"/> Failed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}