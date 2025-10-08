import { orm } from "../config/orm.js";
import { User } from "../entities/user.entity.js";
import { validateUser, validateLogin } from "../entities/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const em = orm.em;
// 🧠 Helper para firmar tokens
function generateToken(user) {
    return jwt.sign({ id: user.id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
}
// 🟡 LOGIN
async function login(req, res) {
    try {
        const validationResult = validateLogin(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Datos inválidos",
                errors: validationResult.error?.errors ?? [],
            });
        }
        const user = await findUserByEmail(req.body.email);
        if (!user)
            return res.status(401).json({ message: "Credenciales inválidas" });
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid)
            return res.status(401).json({ message: "Credenciales inválidas" });
        const token = generateToken(user);
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
// 🔍 Helper
async function findUserByEmail(email) {
    return await em.findOne(User, { email });
}
// 🟢 REGISTRO
async function add(req, res) {
    try {
        const validationResult = validateUser(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Datos inválidos",
                errors: validationResult.error?.errors ?? [],
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = { ...req.body, password: hashedPassword };
        const user = em.create(User, userData);
        await em.flush();
        const token = generateToken(user);
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
// 🧑‍💻 GET ALL
async function findAll(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Authentication required" });
        if (req.user.userType !== "Admin")
            return res.status(403).json({ message: "Admin privileges required" });
        const users = await em.find(User, {});
        res.status(200).json({ message: "found all users", data: users });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// 🧑 GET ONE
async function findOne(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Authentication required" });
        if (req.user.userType !== "Admin" && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await em.findOneOrFail(User, { id: req.params.id });
        res.status(200).json({ message: "found user", data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// ✍️ UPDATE
async function update(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Authentication required" });
        if (req.user.userType !== "Admin" && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await em.findOneOrFail(User, { id: req.params.id });
        em.assign(user, req.body);
        await em.flush();
        res.status(200).json({ message: "user updated", data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// 🗑️ DELETE
async function remove(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Authentication required" });
        if (req.user.userType !== "Admin")
            return res.status(403).json({ message: "Admin privileges required" });
        const user = await em.findOneOrFail(User, { id: req.params.id });
        await em.removeAndFlush(user);
        res.status(200).json({ message: "user removed", data: user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { add, findAll, findOne, update, remove, login };
//# sourceMappingURL=user.controller.js.map