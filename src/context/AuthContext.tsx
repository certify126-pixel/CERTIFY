
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import { loginUser, LoginUserInput } from "@/ai/flows/login-user-flow";
import { registerUser, RegisterUserInput } from "@/ai/flows/register-user-flow";

type UserRole = "Super Admin" | "User" | "Institution";

type User = {
  id: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (credentials: LoginUserInput) => Promise<{ success: boolean; message: string }>;
  register: (details: RegisterUserInput) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  login: async () => ({ success: false, message: "Not implemented" }),
  register: async () => ({ success: false, message: "Not implemented" }),
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("q_certify_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("q_certify_user");
      }
    }
    setLoading(false);
  }, []);

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
        localStorage.setItem("q_certify_user", JSON.stringify(userData));
        return { success: true, message: result.message };
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
    localStorage.removeItem("q_certify_user");
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, loading, login, register, logout }}>
      {loading && !user ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
