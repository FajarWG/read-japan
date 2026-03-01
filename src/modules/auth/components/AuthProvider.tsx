"use client";

import { createContext, useContext } from "react";

export type SessionUser = {
  id: number;
  username: string;
  name: string;
  role: "USER" | "ADMIN";
};

type AuthContextType = {
  user: SessionUser | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
