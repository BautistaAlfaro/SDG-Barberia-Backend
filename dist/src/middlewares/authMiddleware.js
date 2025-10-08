import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);
    if (!authHeader) {
        console.log("No Authorization header present");
        return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
    }
    try {
        const token = authHeader.split(" ")[1];
        console.log("Token extracted:", token);
        if (!token) {
            console.log("No token found after Bearer");
            return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        if (!decoded || typeof decoded !== "object" || !("id" in decoded) || !("userType" in decoded)) {
            console.log("Token missing required fields");
            return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid token format" });
        }
        req.user = {
            id: decoded.id,
            userType: decoded.userType,
        };
        console.log("User set in request:", req.user);
        next();
    }
    catch (err) {
        console.log("User set in request:", req.user);
        if (err && typeof err === "object" && "name" in err && err.name === "TokenExpiredError") {
            return res.status(401).json({ code: "TOKEN_EXPIRED", message: "Token has expired" });
        }
        return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid token" });
    }
};
export const roleMiddleware = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
        }
        const userRole = req.user.userType;
        if (roles.length && !roles.includes(userRole)) {
            return res.status(403).json({ code: "FORBIDDEN", message: "Access denied: insufficient permissions" });
        }
        next();
    };
};
export const isAdmin = roleMiddleware(["Admin"]);
//# sourceMappingURL=authMiddleware.js.map