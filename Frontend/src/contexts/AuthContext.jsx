import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("brcm_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const { data } = await api.post("/auth/login", { username, password, role });
      const userData = { _id: data._id, name: data.name, username: data.username, role: data.role };
      localStorage.setItem("brcm_token", data.token);
      localStorage.setItem("brcm_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem("brcm_token");
    localStorage.removeItem("brcm_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
