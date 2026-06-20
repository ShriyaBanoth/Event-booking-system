import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, logoutRequest, getMeRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we verify an existing token on first load

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMeRequest()
      .then((res) => setUser(res.data.data.user))
      .catch(() => {
        // Token invalid/expired - clear it
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, password }) => {
    const res = await registerRequest({ name, email, password });
    const { user: newUser, token } = res.data.data;
    localStorage.setItem("token", token);
    setUser(newUser);
    return newUser;
  };

  const login = async ({ email, password }) => {
    const res = await loginRequest({ email, password });
    const { user: loggedInUser, token } = res.data.data;
    localStorage.setItem("token", token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Even if the server call fails, proceed to clear local state -
      // logout should never leave the user stuck in a logged-in-looking UI.
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
