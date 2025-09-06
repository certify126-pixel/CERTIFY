
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { loginUser, LoginUserInput } from "@/ai/flows/login-user-flow";
import { registerUser, RegisterUserInput } from "@/ai/flows/register-user-flow";

export type UserRole = "Super Admin" | "User" | "Institution";

type User = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  viewAsRole: UserRole | null;
  setViewAsRole: (role: UserRole) => void;
  login: (credentials: LoginUserInput) => Promise<{ success: boolean; message: string, user?: { role: string } }>;
  register: (details: RegisterUserInput) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  viewAsRole: null,
  setViewAsRole: () => {},
  login: async () => ({ success: false, message: "Not implemented" }),
  register: async () => ({ success: false, message: "Not implemented" }),
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewAsRole, setViewAsRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("q_certify_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setViewAsRole(parsedUser.role);
      } catch (e) {
        localStorage.removeItem("q_certify_user");
      }
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
      if (user) {
          setViewAsRole(user.role);
      } else {
          setViewAsRole(null);
      }
  }, [user]);

  const login = async (credentials: LoginUserInput) => {
    setLoading(true);
    try {
      const result = await loginUser(credentials);
      if (result.success && result.user) {
        const userData = {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role as UserRole,
        };
        setUser(userData);
        setViewAsRole(userData.role);
        localStorage.setItem("q_certify_user", JSON.stringify(userData));
        return { success: true, message: result.message, user: { role: result.user.role } };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    } finally {
      setLoading(false);
    }
  };

  const register = async (details: RegisterUserInput) => {
    setLoading(true);
    try {
        const result = await registerUser(details);
        return result;
    } catch (error: any) {
        return { success: false, message: error.message || "An unexpected error occurred." };
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setViewAsRole(null);
    localStorage.removeItem("q_certify_user");
  };
  
  const handleSetViewAsRole = (role: UserRole) => {
      if (user?.role === 'Super Admin') {
          setViewAsRole(role);
      }
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, loading, login, register, logout, viewAsRole, setViewAsRole: handleSetViewAsRole }}>
      {loading && !user ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
