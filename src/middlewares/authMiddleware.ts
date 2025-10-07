import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction, RequestHandler } from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userType: string;
  };
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; userType: string };

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      userType: decoded.userType,
    };

    next();
  } catch (err) {
    if (err && typeof err === "object" && "name" in err && (err as any).name === "TokenExpiredError") {
      return res.status(401).json({ code: "TOKEN_EXPIRED", message: "Token has expired" });
    }
    return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid token" });
  }
};

export const roleMiddleware = (roles: string[] = []): RequestHandler => {
  return (req, res, next) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) {
      return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
    }

    if (roles.length && !roles.includes(user.userType)) {
      return res.status(403).json({ code: "FORBIDDEN", message: "Access denied: insufficient permissions" });
    }

    next();
  };
};

export const isAdmin = roleMiddleware(["Admin"]);
