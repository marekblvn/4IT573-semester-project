import { jwtDecode } from "jwt-decode";
import AuthContext, {
  type AuthUser,
  type JwtPayload,
} from "../contexts/AuthContext";
import { useCallback, useMemo, useState, type PropsWithChildren } from "react";

const initializeUserFromToken = (): AuthUser | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return { token, username: decoded.username, userId: decoded.userId };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export const AuthProvider = ({ children }: Readonly<PropsWithChildren>) => {
  const [user, setUser] = useState<AuthUser | null>(initializeUserFromToken);
  const [isLoading] = useState(false);

  const login = useCallback((token: string, username: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<JwtPayload>(token);
    setUser({ token, username, userId: decoded.userId });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, isLoading }),
    [isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
