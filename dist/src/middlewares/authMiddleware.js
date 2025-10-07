"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.roleMiddleware = exports.authenticateToken = void 0;
exports.initORM = initORM;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_entity_1 = require("../entities/user.entity");
const core_1 = require("@mikro-orm/core");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            userType: decoded.userType,
        };
        next();
    }
    catch (err) {
        if (err && typeof err === "object" && "name" in err && err.name === "TokenExpiredError") {
            return res.status(401).json({ code: "TOKEN_EXPIRED", message: "Token has expired" });
        }
        return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid token" });
    }
};
exports.authenticateToken = authenticateToken;
const roleMiddleware = (roles = []) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ code: "MISSING_TOKEN", message: "Authentication token is required" });
        }
        if (roles.length && !roles.includes(user.userType)) {
            return res.status(403).json({ code: "FORBIDDEN", message: "Access denied: insufficient permissions" });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
async function initORM() {
    const orm = await core_1.MikroORM.init({
        entities: [user_entity_1.User],
        dbName: process.env.MONGO_DB,
        clientUrl: process.env.MONGO_URI,
    });
    return orm;
}
exports.isAdmin = (0, exports.roleMiddleware)(["Admin"]);
