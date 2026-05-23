import React, { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent, addStudent } from '../services/api';

const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg text-[13px] text-white shadow-xl z-[9999] animate-[slideIn_0.3s_ease]
    ${type === 'success' ? 'bg-green-800' : type === 'error' ? 'bg-red-800' : 'bg-[#1a1a2e]'}`}>{msg}</div>
);

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-amber-400 focus:bg-white transition-all";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    rollNumber: '',
    name: '',
    registrationNo: '',
    className: '',
    section: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const showToast = (msg, type = '') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch students: ' + (err.response?.data?.message || err.message));
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!form.rollNumber || !form.name || !form.registrationNo || !form.className || !form.section) {
      return showToast('Please fill all required fields', 'error');
    }
    try {
      const { data } = await addStudent(form);
      setStudents(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ rollNumber: '', name: '', registrationNo: '', className: '', section: '', email: '', password: '' });
      showToast('Student added successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add student', 'error');
      console.error('Add student error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(s => s._id !== id));
        showToast('Student deleted', 'success');
      } catch (err) {
        showToast('Failed to delete student', 'error');
      }
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
      {toast && <Toast {...toast} />}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-7">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">Manage student information and records</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2d2d4e] focus:outline-none">
          + New Student
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No students found</p>
          <p className="text-gray-400">Add a student to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Roll Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Registration No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Class</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Section</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.rollNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.registrationNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.className}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.section}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email || '-'}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-[520px] shadow-2xl">
            <div className="text-[16px] font-bold mb-5">Add New Student</div>
            {[
              ['rollNumber', 'Roll Number *'],
              ['name', 'Name *'],
              ['registrationNo', 'Registration No *'],
              ['className', 'Class *'],
              ['section', 'Section *'],
              ['email', 'Email'],
              ['password', 'Password (optional)'],
            ].map(([field, label]) => (
              <div key={field} className="mb-3.5">
                <label className="block text-[13px] font-medium text-gray-900 mb-1.5">{label}</label>
                <input
                  type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                  className={inputCls}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg text-[13px] font-medium cursor-pointer hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddStudent}
                className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-[13px] font-medium cursor-pointer hover:bg-[#2d2d4e]">
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
