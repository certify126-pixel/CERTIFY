
"use client";

import React,
{
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type UserRole = "Super Admin" | "User";

type AuthContextType = {
  user: User | null;
  role: UserRole;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "User",
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // For now, let's simulate a logged-in user to bypass authentication checks
      // In a real scenario, you'd fetch the user's role from your database.
      if (!user) {
          const mockUser = {
              uid: 'mock-user-uid',
              email: 'super.admin@certicheck.dev',
              displayName: 'Super Admin',
          } as User;
          setUser(mockUser);
          if (mockUser.email === 'super.admin@certicheck.dev') {
            setRole("Super Admin");
          } else {
            setRole("User");
          }
      } else {
        setUser(user);
        // This is where you would fetch the user's role from Firestore
        if (user.email === 'super.admin@certicheck.dev') {
            setRole("Super Admin");
        } else {
            setRole("User");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {loading ? (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
