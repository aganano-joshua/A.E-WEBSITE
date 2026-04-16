import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredAuth = (): { user: User | null; token: string | null } => {
  const savedUser = localStorage.getItem("ae_user");
  const savedToken = localStorage.getItem("ae_token");

  if (!savedUser || !savedToken) {
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(savedUser) as User, token: savedToken };
  } catch (error) {
    console.error("Failed to parse saved user from localStorage:", error);
    localStorage.removeItem("ae_user");
    localStorage.removeItem("ae_token");
    return { user: null, token: null };
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedAuth = getStoredAuth();
  const [user, setUser] = useState<User | null>(storedAuth.user);
  const [token, setToken] = useState<string | null>(storedAuth.token);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("ae_user", JSON.stringify(newUser));
    localStorage.setItem("ae_token", newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ae_user");
    localStorage.removeItem("ae_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading: false,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
