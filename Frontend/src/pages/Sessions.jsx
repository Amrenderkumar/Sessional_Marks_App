import React, { useState, useEffect } from 'react';
import { getAllSessions, createSession, activateSession, deleteSession } from '../services/api';

const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg text-[13px] text-white shadow-xl z-[9999] animate-[slideIn_0.3s_ease]
    ${type === 'success' ? 'bg-green-800' : type === 'error' ? 'bg-red-800' : 'bg-[#1a1a2e]'}`}>{msg}</div>
);

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-amber-400 focus:bg-white transition-all";

export default function Sessions() {
  const [sessions,  setSessions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', year:'', isActive:false });
  const [toast, setToast] = useState(null);

  const load = () => getAllSessions().then(r => setSessions(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const showToast = (msg, type='') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleCreate = async () => {
    if (!form.name || !form.year) return showToast('Name and year required','error');
    try {
      await createSession(form);
      setShowModal(false); setForm({name:'',year:'',isActive:false});
      load(); showToast('Session created','success');
    } catch (err) { showToast(err.response?.data?.message||'Failed','error'); }
  };

  const handleActivate = async (id) => { await activateSession(id); load(); showToast('Session activated','success'); };
  const handleDelete   = async (id) => {
    if (!window.confirm('Delete this session?')) return;
    await deleteSession(id); load(); showToast('Session deleted','success');
  };

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      {toast && <Toast {...toast} />}

      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Sessional Sessions</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage academic years and terms</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e] border-none">
          + New Session
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
          <div className="text-[15px] font-semibold text-gray-900">🗃️ All Sessions</div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="w-8 h-8 border-[3px] border-gray-100 border-t-amber-400 rounded-full animate-spin"/>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Session Name','Sessional Year','Status','Created',''].map(h => (
                    <th key={h} className="text-[12px] font-medium text-gray-400 text-left px-4 py-2.5 border-b border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-400">📅 {s.year}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium
                        ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-1.5">
                      {!s.isActive && (
                        <button onClick={() => handleActivate(s._id)}
                          className="px-2.5 py-1 text-[12px] text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          Set Active
                        </button>
                      )}
                      <button onClick={() => handleDelete(s._id)}
                        className="px-2.5 py-1 text-[12px] text-red-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-[480px] shadow-2xl">
            <div className="text-[16px] font-bold mb-5">Create New Session</div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Session Name *</label>
              <input className={inputCls} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. 2025-26 Annual Exam" />
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Sessional Year *</label>
              <input className={inputCls} value={form.year} onChange={e=>setForm({...form,year:e.target.value})} placeholder="e.g. 2025-2026" />
            </div>
            <div className="flex items-center gap-2 mb-3.5">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="w-4 h-4"/>
              <label htmlFor="isActive" className="text-[13px] font-medium text-gray-900 cursor-pointer">Set as Active Session</label>
            </div>
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-[13px] font-medium cursor-pointer hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate}
                className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e]">Create Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}