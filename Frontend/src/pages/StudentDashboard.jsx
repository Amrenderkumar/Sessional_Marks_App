import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { TrendingUp, Award, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (user?.student?._id) {
      api.get(`/analytics/student/${user.student._id}`).then((r) => setData(r.data));
    }
  }, [user]);

  if (!data) return <div>Loading results...</div>;

  const chartData = data.marks.map((m) => ({
    subject: m.subjectId?.code || "—",
    marks: m.marksObtained,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-700">My Results</h2>
        <p className="text-slate-500">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-gold-500" />
            <p className="text-sm text-slate-500">Percentage</p>
          </div>
          <p className="text-3xl font-bold text-navy-700">{data.percentage}%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-sm text-slate-500">Total Marks</p>
          </div>
          <p className="text-3xl font-bold text-navy-700">
            {data.totalMarks} / {data.maxMarks}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-slate-500">Subjects</p>
          </div>
          <p className="text-3xl font-bold text-navy-700">{data.subjectsCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-navy-700 mb-4">Subject Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="subject" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="marks" fill="#1e3a5f" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-navy-700">Detailed Marks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Sessional</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Marks</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.marks.map((m) => (
                <tr key={m._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{m.subjectId?.name}</td>
                  <td className="px-6 py-3 text-slate-600">{m.sessionId?.name}</td>
                  <td className="px-6 py-3">
                    {m.marksObtained} / {m.subjectId?.maxMarks}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-block bg-gold-100 text-gold-700 px-2 py-1 rounded text-xs font-semibold">
                      {m.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
