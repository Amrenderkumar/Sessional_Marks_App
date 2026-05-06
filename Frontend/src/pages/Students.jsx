import React, { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent } from '../services/api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-2">Manage student information and records</p>
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
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
              {students.map((student, idx) => (
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
    </div>
  );
}
