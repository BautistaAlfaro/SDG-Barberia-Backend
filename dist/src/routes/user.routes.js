"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_js_1 = require("../controllers/user.controller.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/register", user_controller_js_1.add);
exports.userRouter.post("/login", user_controller_js_1.login);
exports.userRouter.get("/", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, user_controller_js_1.findAll);
exports.userRouter.get("/:id", authMiddleware_js_1.authenticateToken, user_controller_js_1.findOne);
exports.userRouter.put("/:id", authMiddleware_js_1.authenticateToken, user_controller_js_1.update);
exports.userRouter.delete("/:id", authMiddleware_js_1.authenticateToken, authMiddleware_js_1.isAdmin, user_controller_js_1.remove);
