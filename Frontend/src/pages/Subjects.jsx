import React, { useState, useEffect } from 'react';
import { getAllSubjects, addSubject, deleteSubject } from '../services/api';

const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg text-[13px] text-white shadow-xl z-[9999] animate-[slideIn_0.3s_ease]
    ${type === 'success' ? 'bg-green-800' : type === 'error' ? 'bg-red-800' : 'bg-[#1a1a2e]'}`}>{msg}</div>
);

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-amber-400 focus:bg-white transition-all";

export default function Subjects() {
  const [subjects,  setSubjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code:'', name:'', maxMarks:100, passingMarks:33 });
  const [toast, setToast] = useState(null);

  const load = () => getAllSubjects().then(r => setSubjects(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const showToast = (msg, type='') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleAdd = async () => {
    if (!form.code || !form.name) return showToast('Code and name required','error');
    try {
      await addSubject(form);
      setShowModal(false);
      setForm({ code:'', name:'', maxMarks:100, passingMarks:33 });
      load(); showToast('Subject added','success');
    } catch (err) { showToast(err.response?.data?.message || 'Failed','error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    await deleteSubject(id); load(); showToast('Subject deleted','success');
  };

  return (
    <div className="px-10 py-8 max-w-[1200px]">
      {toast && <Toast {...toast} />}

      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Subjects</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage curriculum subjects and grading rules</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e] border-none">
          + New Subject
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 pt-[18px] pb-3.5 border-b border-gray-100">
          <div className="text-[15px] font-semibold text-gray-900">📖 Subject Directory</div>
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
                  {['Code','Subject Name','Max Marks','Passing Marks',''].map(h => (
                    <th key={h} className="text-[12px] font-medium text-gray-400 text-left px-4 py-2.5 border-b border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[12px] font-semibold text-gray-700">{s.code}</span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-gray-900 text-right">{s.maxMarks}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-400 text-right">{s.passingMarks}</td>
                    <td className="px-4 py-3">
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
            <div className="text-[16px] font-bold mb-5">Add New Subject</div>
            {[['code','Code (e.g. MATH) *'],['name','Subject Name *']].map(([f,label]) => (
              <div key={f} className="mb-3.5">
                <label className="block text-[13px] font-medium text-gray-900 mb-1.5">{label}</label>
                <input className={inputCls} value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})} />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {[['maxMarks','Max Marks'],['passingMarks','Passing Marks']].map(([f,label]) => (
                <div key={f} className="mb-3.5">
                  <label className="block text-[13px] font-medium text-gray-900 mb-1.5">{label}</label>
                  <input className={inputCls} type="number" value={form[f]} onChange={e => setForm({...form,[f]:Number(e.target.value)})} />
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-[13px] font-medium cursor-pointer hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd}
                className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e]">Add Subject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}