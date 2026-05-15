import { createContext, useContext, useEffect, useMemo, useState } from "react";

import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const fetchCurrentUser = async () => {
    if (!localStorage.getItem("accessToken")) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await apiClient.get("/auth/me");
      setUser(response.data);
      return response.data;
    } catch {
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const accessToken = response.data.access_token;
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
    await fetchCurrentUser();
    return response.data;
  };

  const register = async ({ email, full_name, password }) => {
    await apiClient.post("/auth/register", { email, full_name, password });
    return login({ email, password });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      fetchCurrentUser,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
