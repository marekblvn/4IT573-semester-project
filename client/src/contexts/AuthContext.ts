import { createContext } from "react";

export interface JwtPayload {
  userId: string;
  username: string;
  exp: number;
}

export interface AuthUser {
  token: string;
  username: string;
  userId: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
