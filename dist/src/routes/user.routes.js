import express from "express";
import { add, findAll, findOne, update, remove, login } from "../controllers/user.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
export const userRouter = express.Router();
userRouter.post("/register", add);
userRouter.post("/login", login);
userRouter.get("/", authenticateToken, isAdmin, findAll);
userRouter.get("/:id", authenticateToken, findOne);
userRouter.put("/:id", authenticateToken, update);
userRouter.delete("/:id", authenticateToken, isAdmin, remove);
//# sourceMappingURL=user.routes.js.map