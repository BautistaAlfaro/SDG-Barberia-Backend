import express from "express"
import { add, findAll, findOne, update, remove } from "../controllers/service.controller.js"
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js"
import { fr } from "zod/v4/locales"

export const serviceRouter = express.Router()

// Crear servicio (solo admin)
serviceRouter.post("/", authenticateToken, isAdmin, add)

// Obtener todos los servicios (acceso libre o según necesidad)
serviceRouter.get("/", findAll)

// Obtener servicio por ID
serviceRouter.get("/:id", findOne)

// Actualizar servicio (solo admin)
serviceRouter.put("/:id", authenticateToken, isAdmin, update)

// Eliminar servicio (solo admin)
serviceRouter.delete("/:id", authenticateToken, isAdmin, remove)
