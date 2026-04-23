import { useAuth } from "../contexts/AuthContext";
import { GraduationCap, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BRCMportal</h1>
              <p className="text-xs text-navy-100">Student Result Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-navy-100 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-navy-600 hover:bg-navy-500 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
