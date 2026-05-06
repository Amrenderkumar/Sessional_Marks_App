import React, { useState, useEffect } from 'react';
import { getAllSessions, getAllSubjects, getMarksForEntry, saveMarks } from '../services/api';

const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg text-[13px] text-white shadow-xl z-[9999] animate-[slideIn_0.3s_ease]
    ${type === 'success' ? 'bg-green-800' : type === 'error' ? 'bg-red-800' : 'bg-[#1a1a2e]'}`}>
    {msg}
  </div>
);

export default function MarksEntry() {
  const [sessions,         setSessions]         = useState([]);
  const [subjects,         setSubjects]         = useState([]);
  const [selectedSession,  setSelectedSession]  = useState('');
  const [selectedSubject,  setSelectedSubject]  = useState('');
  const [marksData,        setMarksData]        = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [saving,           setSaving]           = useState(false);
  const [toast,            setToast]            = useState(null);

  useEffect(() => {
    getAllSessions().then(r => {
      setSessions(r.data);
      const active = r.data.find(s => s.isActive);
      if (active) setSelectedSession(active._id);
    });
    getAllSubjects().then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    if (selectedSession && selectedSubject) {
      setLoading(true);
      getMarksForEntry(selectedSession, selectedSubject)
        .then(r => setMarksData(r.data.students))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else { setMarksData([]); }
  }, [selectedSession, selectedSubject]);

  const handleMarkChange = (idx, value) => {
    const updated = [...marksData];
    updated[idx].marksObtained = value === '' ? null : Number(value);
    setMarksData(updated);
  };

  const showToast = (msg, type = '') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSave = async () => {
    const payload = marksData.filter(s => s.marksObtained !== null && s.marksObtained !== undefined)
      .map(s => ({ studentId: s.studentId, marksObtained: s.marksObtained }));
    if (!payload.length) return showToast('No marks to save', 'error');
    setSaving(true);
    try {
      await saveMarks({ sessionId: selectedSession, subjectId: selectedSubject, marksData: payload });
      showToast(`Marks saved for ${payload.length} students`, 'success');
    } catch { showToast('Failed to save marks', 'error'); }
    finally  { setSaving(false); }
  };

  const selSubject = subjects.find(s => s._id === selectedSubject);
  const selectCls  = "bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none min-w-[200px] cursor-pointer";

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      {toast && <Toast {...toast} />}

      <div className="mb-7">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Marks Entry</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Record and update student scores</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-5">
        <div className="p-5 flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Sessional Session</label>
            <select className={selectCls} value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
              <option value="">Select Session</option>
              {sessions.map(s => <option key={s._id} value={s._id}>{s.name}{s.isActive ? ' (Active)' : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Subject</label>
            <select className={selectCls} value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          {marksData.length > 0 && (
            <button onClick={handleSave} disabled={saving}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e] disabled:opacity-50 border-none">
              {saving ? 'Saving...' : '💾 Save Marks'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {!selectedSession || !selectedSubject ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="text-4xl mb-3 opacity-40">📖</div>
            <div className="text-[14px] font-medium mb-1">Select criteria</div>
            <div className="text-[12px]">Choose a session and subject to begin entering marks.</div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[12px] font-medium text-gray-400 text-left px-4 py-2.5 border-b border-gray-100">Roll No.</th>
                  <th className="text-[12px] font-medium text-gray-400 text-left px-4 py-2.5 border-b border-gray-100">Student Name</th>
                  <th className="text-[12px] font-medium text-gray-400 text-right px-4 py-2.5 border-b border-gray-100">Marks / {selSubject?.maxMarks || 100}</th>
                  <th className="text-[12px] font-medium text-gray-400 text-right px-4 py-2.5 border-b border-gray-100">Passing: {selSubject?.passingMarks || 33}</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((s, idx) => (
                  <tr key={s.studentId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{s.rollNumber}</td>
                    <td className="px-4 py-3 text-[13px] text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-right">
                      <input
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-[13px] text-center outline-none focus:border-amber-400"
                        type="number" min="0" max={selSubject?.maxMarks || 100}
                        value={s.marksObtained ?? ''}
                        onChange={e => handleMarkChange(idx, e.target.value)}
                        placeholder="—"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-[12px] font-semibold">
                      {s.marksObtained != null && (
                        <span className={s.marksObtained >= (selSubject?.passingMarks || 33) ? 'text-green-500' : 'text-red-500'}>
                          {s.marksObtained >= (selSubject?.passingMarks || 33) ? '✓ PASS' : '✗ FAIL'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}