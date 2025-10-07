import { Request, Response } from "express";
import { orm } from "../config/orm.js";
import { User } from "../entities/user.entity.js";
import { validateUser, validateLogin } from "../entities/user.schema.js";   
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { AuthenticatedRequest }     from "../middlewares/authMiddleware.js";

const em = orm.em;

async function login(req: Request, res: Response) {
  try {
    const validationResult = validateLogin(req.body)
    if (!validationResult.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: validationResult.error?.issues ?? [] })
    }
    const user = await findUserByEmail(req.body.email)
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Genera JWT token
    const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })

    // Devuelve el token y los datos del usuario
    res.status(200).json({
      message: "Login exitoso",
      token,
      id: user.id,
      userType: user.userType,
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Funcion helper para encontrar un usuario por email 
async function findUserByEmail(email: string) {
  return await em.findOne(User, { email });
}

async function add(req: AuthenticatedRequest, res: Response) {
  try {
    const validationResult = validateUser(req.body)
    if (!validationResult.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: validationResult.error?.issues ?? [] })
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userData = { ...req.body, password: hashedPassword }
    const user = em.create(User, userData)
    await em.flush()

    const token = jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })

    res.status(201).json({
      message: "Usuario registrado",
      token,
      id: user.id,
      userType: user.userType,
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAll(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Check if user is admin
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Admin privileges required" })
    }

    const users = await em.find(User, {})
    res.status(200).json({ message: "found all users", data: users })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }
    if (req.user.userType !== "Admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" })
    }

    const user = await em.findOneOrFail(User, { id: req.params.id })
    res.status(200).json({ message: "found user", data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (req.user.userType !== "Admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" })
    }

    const user = await em.findOneOrFail(User, { id: req.params.id })
    em.assign(user, req.body)
    await em.flush()
    res.status(200).json({ message: "user updated", data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }
    if (req.user.userType !== "Admin") {
      return res.status(403).json({ message: "Admin privileges required" })
    }

    const user = await em.findOneOrFail(User, { id: req.params.id })
    await em.removeAndFlush(user)
    res.status(200).json({ message: "user removed", data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { add, findAll, findOne, update, remove,login}