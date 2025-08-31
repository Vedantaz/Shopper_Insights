// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "OWNER";
} | null;

type AuthContextType = {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  loading:boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading,setLoading] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
  };

  useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    if(storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [])

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
