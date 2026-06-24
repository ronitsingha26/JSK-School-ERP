import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and methods.
 * Wraps the AuthContext for convenience.
 */
const useAuth = () => {
  const { user, token, loading, login, logout, isAuthenticated } = useAuthContext();

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isPrincipal: user?.role === 'principal',
    isTeacher: user?.role === 'teacher',
    isAccountant: user?.role === 'accountant',
    role: user?.role || null,
  };
};

export default useAuth;
