// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axiosInstance from "../api/axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "OWNER";
} | null;

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData: User) => {
    setUser(userData);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);

    const checkVerify = async () => {
      try {
        const res = await axiosInstance.get(`/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };
    checkVerify();
  }, []);

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
