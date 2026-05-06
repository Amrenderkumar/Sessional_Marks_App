import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getMyPerformance } from '../services/api';

export default function Performance() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPerformance().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
    </div>
  );

  const chartData = data?.performanceData?.map(p => ({
    name:       p.session,
    Percentage: p.percentage,
  })) || [];

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      <div className="mb-7">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Performance Trend</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Track your progress across academic sessions</p>
      </div>

      {/* Chart card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-amber-500">📈</span>
            <div className="text-[15px] font-semibold text-gray-900">Overall Progression</div>
          </div>
          <div className="text-[12px] text-gray-500 mt-0.5">Your percentage score across all completed sessions</div>
        </div>
        <div className="p-5">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="name" tick={{ fontSize:11 }} />
                <YAxis tick={{ fontSize:11 }} domain={[0,100]} />
                <Tooltip formatter={(v) => [`${v}%`, 'Percentage']} />
                <Line
                  type="monotone" dataKey="Percentage"
                  stroke="#f59e0b" strokeWidth={2}
                  dot={{ fill:'#1a1a2e', r:4 }}
                  activeDot={{ r:6 }}
                  name="Overall Percentage"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="text-4xl mb-3 opacity-40">📊</div>
              <div className="text-[14px] font-medium">No performance data yet</div>
            </div>
          )}
        </div>
      </div>

   
      {data?.performanceData?.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {data.performanceData.map((p, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">{p.session}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{p.year}</div>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[12px] font-bold text-gray-700">
                  {p.grade}
                </div>
              </div>
              <div className="text-[26px] font-bold text-gray-900 mt-2 mb-1">{p.percentage}%</div>
              <div className="text-[11px] text-gray-400">Total: {p.totalMarks}/{p.maxTotalMarks}</div>

            
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width:`${p.percentage}%` }}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}