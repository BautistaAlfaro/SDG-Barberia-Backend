"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = add;
exports.findAll = findAll;
exports.findOne = findOne;
exports.update = update;
exports.remove = remove;
exports.login = login;
const orm_js_1 = require("../config/orm.js");
const user_entity_js_1 = require("../entities/user.entity.js");
const user_schema_js_1 = require("../entities/user.schema.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const em = orm_js_1.orm.em;
async function login(req, res) {
    try {
        const validationResult = (0, user_schema_js_1.validateLogin)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Datos inválidos", errors: validationResult.error?.errors ?? [] });
        }
        const user = await findUserByEmail(req.body.email);
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        // Genera JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });
        // Devuelve el token y los datos del usuario
        res.status(200).json({
            message: "Login exitoso",
            token,
            id: user.id,
            userType: user.userType,
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Funcion helper para encontrar un usuario por email 
async function findUserByEmail(email) {
    return await em.findOne(user_entity_js_1.User, { email });
}
async function findUserByDni(dni) {
    return await em.findOne(user_entity_js_1.User, { dni });
}
async function add(req, res) {
    try {
        const validationResult = (0, user_schema_js_1.validateUser)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Datos inválidos", errors: validationResult.error?.errors ?? [] });
        }
        const userWithSameDni = await findUserByDni(req.body.dni);
        if (userWithSameDni) {
            return res.status(409).json({ message: "DNI ya registrado" });
        }
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        const userData = { ...req.body, password: hashedPassword };
        const user = em.create(user_entity_js_1.User, userData);
        await em.flush();
        const token = jsonwebtoken_1.default.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });
        res.status(201).json({
            message: "Usuario registrado",
            token,
            id: user.id,
            userType: user.userType,
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findAll(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        // Check if user is admin
        if (req.user.userType !== "Admin") {
            return res.status(403).json({ message: "Admin privileges required" });
        }
        const users = await em.find(user_entity_js_1.User, {});
        res.status(200).json({ message: "found all users", data: users });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (req.user.userType !== "Admin" && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await em.findOneOrFail(user_entity_js_1.User, { id: req.params.id });
        res.status(200).json({ message: "found user", data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (req.user.userType !== "Admin" && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await em.findOneOrFail(user_entity_js_1.User, { id: req.params.id });
        em.assign(user, req.body);
        await em.flush();
        res.status(200).json({ message: "user updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (req.user.userType !== "Admin") {
            return res.status(403).json({ message: "Admin privileges required" });
        }
        const user = await em.findOneOrFail(user_entity_js_1.User, { id: req.params.id });
        await em.removeAndFlush(user);
        res.status(200).json({ message: "user removed", data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
