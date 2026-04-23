import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { BookOpen, GraduationCap, Users } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ username: "", name: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Passwords match nahi kar rahe");
      return;
    }
    if (form.password.length < 6) {
      setError("Password kam se kam 6 characters hona chahiye");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: form.username,
        name: form.name,
        password: form.password,
        role,
      });
      setSuccess("✓ Account ban gaya! Login page pe redirect kar rahe hain...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpen className="w-10 h-10 text-gold-500" />
          </div>
          <h1 className="text-3xl font-bold text-navy-700 tracking-tight">BRCMportal</h1>
          <p className="text-slate-500 mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-xl border-t-4 border-t-gold-500 overflow-hidden">
          <div className="px-6 pt-6 pb-2 text-center">
            <h2 className="text-2xl font-semibold text-navy-700">Sign Up</h2>
            <p className="text-sm text-slate-500 mt-1">Choose your role and fill details</p>
          </div>

          <div className="p-6">
            {/* Role Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition ${
                  role === "student"
                    ? "bg-white text-navy-700 shadow-sm"
                    : "text-slate-500 hover:text-navy-700"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition ${
                  role === "teacher"
                    ? "bg-white text-navy-700 shadow-sm"
                    : "text-slate-500 hover:text-navy-700"
                }`}
              >
                <Users className="w-4 h-4" />
                Teacher
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {role === "student" ? "Roll Number / Username" : "Username"}
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder={role === "student" ? "S006" : "teacher2"}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-type password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy-700 hover:bg-navy-600 text-white py-2.5 rounded-md font-medium transition disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-navy-700 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
