import { useEffect, useState } from "react";
import api from "../api/client";
import { Users, BookOpen, Calendar, FileText } from "lucide-react";

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/analytics/overview").then((r) => setStats(r.data));
    api.get("/students").then((r) => setStudents(r.data));
  }, []);

  const cards = [
    { label: "Students", value: stats?.students || 0, icon: Users, color: "bg-blue-500" },
    { label: "Subjects", value: stats?.subjects || 0, icon: BookOpen, color: "bg-green-500" },
    { label: "Sessions", value: stats?.sessions || 0, icon: Calendar, color: "bg-purple-500" },
    { label: "Total Marks", value: stats?.marks || 0, icon: FileText, color: "bg-gold-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-700">Teacher Dashboard</h2>
        <p className="text-slate-500">Overview of all students and academic data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{c.label}</p>
                <p className="text-3xl font-bold text-navy-700 mt-1">{c.value}</p>
              </div>
              <div className={`${c.color} p-3 rounded-lg`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-navy-700">All Students</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Roll No</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Reg No</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Class</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Section</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{s.rollNumber}</td>
                  <td className="px-6 py-3 text-slate-600">{s.registrationNumber}</td>
                  <td className="px-6 py-3">{s.name}</td>
                  <td className="px-6 py-3">{s.className}</td>
                  <td className="px-6 py-3">{s.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
