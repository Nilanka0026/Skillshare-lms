import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContextValue.js';
import { authApi } from '../services/api.js';

const roleHome = {
  student: '/dashboard/student',
  instructor: '/dashboard/instructor',
  admin: '/dashboard/admin'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('skillshareUser');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setAuthLoading(false);
  }, []);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    localStorage.setItem('skillshareUser', JSON.stringify(nextUser));
    return nextUser;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const userData = await authApi.login({ email, password });
    return persistUser(userData);
  }, [persistUser]);

  const register = useCallback(async ({ email, fullName, password, role }) => {
    const userData = await authApi.register({
      email,
      name: fullName,
      password,
      role
    });
    return persistUser(userData);
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('skillshareUser');
  }, []);

  const value = useMemo(() => ({
    authLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    register,
    roleHome,
    user
  }), [authLoading, login, logout, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
