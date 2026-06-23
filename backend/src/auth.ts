import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
  };
}

export const generateToken = (username: string): string => {
  return jwt.sign({ username }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Express Middleware to authenticate API requests
export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ error: "Invalid token" });
      }
      req.user = { username: decoded.username };
      next();
    });
  } else {
    res
      .status(401)
      .json({ error: "Authorization header missing" });
  }
};

// Socket.io Middleware to authenticate socket connection
export const authenticateSocket = (
  socket: any,
  next: (err?: Error) => void,
) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication token required"));
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: any, decoded: any) => {
      if (err) {
        return next(new Error("Invalid token"));
      }
      socket.username = decoded.username;
      next();
    },
  );
};
