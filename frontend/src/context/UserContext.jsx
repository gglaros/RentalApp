import { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { tokenStorage, setUnauthorizedHandler } from "../api/client";
import { usersApi } from "../api/users";

const UserContext = createContext();

const tokenExpiry = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp * 1000 : null;
  } catch {
    return null;
  }
};

const readValidToken = () => {
  const token = tokenStorage.get();
  if (!token) return null;
  const exp = tokenExpiry(token);
  if (!exp || exp <= Date.now()) {
    tokenStorage.clear();
    return null;
  }
  return token;
};

function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(readValidToken);
  const [loading, setLoading] = useState(() => !!readValidToken());

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUserProfile(null);
    setLoading(false);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setUserProfile(await usersApi.getMe());
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await usersApi.login(email, password);
    tokenStorage.set(data.token);
    setLoading(true);
    setToken(data.token);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    if (tokenStorage.get()) {
      try {
        await usersApi.logout();
      } catch {
      }
    }
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [token, fetchProfile]);

  useEffect(() => {
    if (!token) return;
    const exp = tokenExpiry(token);
    if (!exp) return clearSession();
    const timer = setTimeout(clearSession, Math.max(exp - Date.now(), 0));
    return () => clearTimeout(timer);
  }, [token, clearSession]);

  const valueToShare = useMemo(
    () => ({
      userProfile,
      role: userProfile?.role ?? null,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
      fetchProfile,
    }),
    [userProfile, token, loading, login, logout, fetchProfile]
  );

  return (
    <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;
