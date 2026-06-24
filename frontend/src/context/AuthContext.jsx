import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // Connected to backend

const AuthContext = createContext(null);

/* ──────────────────────────────────────────────────────────
   DUMMY USERS — Frontend-only mode
   Replace this with API calls once backend is connected.
   ────────────────────────────────────────────────────────── */
const DUMMY_USERS = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'admin@jsk.com',
    role: 'admin',
    is_active: true,
    // Login: username "admin", password "admin"
    username: 'admin',
    password: 'admin',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    email: 'rajesh@jsk.com',
    role: 'teacher',
    is_active: true,
    username: 'teacher',
    password: 'teacher',
  },
  {
    id: 3,
    name: 'Sunita Devi',
    email: 'sunita@jsk.com',
    role: 'accountant',
    is_active: true,
    username: 'accountant',
    password: 'accountant',
  },
  {
    id: 4,
    name: 'Dr. Arvind Singh',
    email: 'arvind@jsk.com',
    role: 'principal',
    is_active: true,
    username: 'principal',
    password: 'principal',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jsk_token'));
  const [loading, setLoading] = useState(true);

  // On mount, restore session from backend API
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Frontend-only mode: use localStorage instead of API
          const savedUser = localStorage.getItem('jsk_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            logout();
          }
          // Uncomment below to use actual backend:
          // const res = await api.get('/auth/me');
          // setUser(res.data.user);
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = async (emailOrUsername, password, role) => {
    // Frontend-only mode mock login
    const dummyUser = DUMMY_USERS.find(u => u.username === emailOrUsername && u.password === password);
    
    if (!dummyUser) {
      throw new Error("Invalid username or password");
    }
    
    const newToken = "dummy-token-" + dummyUser.id;
    localStorage.setItem('jsk_token', newToken);
    localStorage.setItem('jsk_user', JSON.stringify(dummyUser));
    setToken(newToken);
    setUser(dummyUser);
    return dummyUser;

    // Uncomment below to use actual backend:
    // const res = await api.post('/auth/login', { email: emailOrUsername, password, role });
    // const { token: newToken, user: userData } = res.data;
    // localStorage.setItem('jsk_token', newToken);
    // setToken(newToken);
    // setUser(userData);
    // return userData;
  };

  const logout = () => {
    localStorage.removeItem('jsk_token');
    localStorage.removeItem('jsk_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
