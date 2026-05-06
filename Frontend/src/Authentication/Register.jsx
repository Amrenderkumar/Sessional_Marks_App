import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Register() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.username || !form.password) {
      setError('All fields are required');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        username: form.username,
        password: form.password,
        role,
      });
      setSuccess('✓ Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-md mb-3">📖</div>
        <div className="text-[22px] font-bold text-gray-900">BRCMportal</div>
        <div className="text-[13px] text-gray-500 mt-0.5">Sessional Result Management System</div>
      </div>

      <div className="bg-white rounded-2xl p-7 w-full max-w-[400px] shadow-lg">
        <div className="text-lg font-bold text-center mb-1">Create Account</div>
        <div className="text-[13px] text-gray-500 text-center mb-5">Select your role and register</div>

        <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-[3px] mb-5">
          {['student', 'teacher'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 text-[13px] font-medium rounded-lg border-none cursor-pointer transition-all flex items-center justify-center gap-1.5
                ${role === r ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {r === 'student' ? '🎓' : '👤'} {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg px-3 py-2 text-[13px] mb-3 text-center">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 rounded-lg px-3 py-2 text-[13px] mb-3 text-center">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3.5">
            <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Full Name</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-3.5">
            <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Username / Roll Number</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder={role === 'student' ? 'e.g. S001' : 'e.g. teacher'}
              required
            />
          </div>

          <div className="mb-3.5">
            <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Password</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••"
              required
            />
          </div>

          <div className="mb-3.5">
            <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Confirm Password</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[14px] bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition-all"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[11px] bg-blue-600 text-white border-none rounded-lg text-[14px] font-semibold cursor-pointer transition-colors mt-1 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4 text-[13px]">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
