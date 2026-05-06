import React, { useState, useEffect } from 'react';
import { getMyResults } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Results() {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeIdx,  setActiveIdx]  = useState(0);

  useEffect(() => {
    getMyResults().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handlePrint  = () => window.print();

  const handleDownload = () => {
    if (!activeResult) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('BRCMportal - Result Card', 14, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${data.student.name}   Roll: ${data.student.rollNumber}`, 14, 30);
    doc.text(`Session: ${activeResult.session.name}   Status: ${activeResult.status}`, 14, 38);
    autoTable(doc, {
      startY: 46,
      head: [['Subject','Code','Max Marks','Passing','Obtained','Grade']],
      body: activeResult.marks.map(m => [
        m.subject?.name, m.subject?.code, m.subject?.maxMarks,
        m.subject?.passingMarks, m.marksObtained,
        (() => { const p=(m.marksObtained/m.subject?.maxMarks)*100; return p>=90?'A+':p>=80?'A':p>=70?'B+':p>=60?'B':p>=50?'C':p>=33?'D':'F'; })()
      ]),
    });
    doc.text(`Total: ${activeResult.totalMarks}/${activeResult.maxTotalMarks}   Percentage: ${activeResult.percentage}%   Grade: ${activeResult.grade}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`result_${data.student.rollNumber}_${activeResult.session.name}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[200px]">
      <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
    </div>
  );

  const activeResult = data?.results?.[activeIdx];

  return (
    <div className="px-10 py-8 max-w-[1200px]">

      
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">My Results</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Detailed subject-wise performance</p>
        </div>
        <div className="flex gap-2.5 items-center">
          {data?.results?.length > 0 && (
            <select
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none cursor-pointer"
              value={activeIdx} onChange={e => setActiveIdx(Number(e.target.value))}>
              {data.results.map((r, i) => (
                <option key={r._id} value={i}>{r.session?.name}</option>
              ))}
            </select>
          )}
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-[13px] font-medium cursor-pointer hover:bg-gray-50">
            🖨️ Print
          </button>
        </div>
      </div>

      {!activeResult ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="text-4xl mb-3 opacity-40">📄</div>
          <div className="text-[14px] font-medium">No results available yet</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
  
          <div className="bg-gray-100 px-5 py-4 flex justify-between items-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{activeResult.session?.name}</div>
              <div className="text-[12px] text-gray-500 mt-0.5">Sessional Year {activeResult.session?.year}</div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">TOTAL MARKS</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">{activeResult.totalMarks}/{activeResult.maxTotalMarks}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">PERCENTAGE</div>
                <div className="text-xl font-bold text-gray-900 mt-0.5">{activeResult.percentage}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">STATUS</div>
                <div className={`text-xl font-bold mt-0.5 flex items-center gap-1 ${activeResult.status==='PASS'?'text-green-500':'text-red-500'}`}>
                  {activeResult.status==='PASS'?'✅':'❌'} {activeResult.status}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Subject','Code','Max Marks','Passing Marks','Marks Obtained','Grade','Remarks'].map(h => (
                    <th key={h} className="text-[12px] font-medium text-gray-400 text-left px-4 py-2.5 border-b border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeResult.marks.map((m, i) => {
                  const pct   = (m.marksObtained / m.subject?.maxMarks) * 100;
                  const grade = pct>=90?'A+':pct>=80?'A':pct>=70?'B+':pct>=60?'B':pct>=50?'C':pct>=33?'D':'F';
                  const pass  = m.marksObtained >= m.subject?.passingMarks;
                  return (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-900">{m.subject?.name}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-400">{m.subject?.code}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-900 text-center">{m.subject?.maxMarks}</td>
                      <td className="px-4 py-3 text-[13px] text-gray-900 text-center">{m.subject?.passingMarks}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-gray-900 text-right">{m.marksObtained}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-[5px] text-[11px] font-bold text-white
                          ${pass ? 'bg-[#1a1a2e]' : 'bg-red-600'}`}>{grade}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-400">-</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

      
          <div className="flex justify-end p-5 border-t border-gray-100">
            <button onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e] border-none">
              ⬇️ Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}