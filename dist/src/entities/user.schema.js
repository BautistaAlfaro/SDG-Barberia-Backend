"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userSchema = void 0;
exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
const zod_1 = require("zod");
// User validation schema
exports.userSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "Nombre es requerido"),
    lastName: zod_1.z.string().min(1, "Apellido es requerido"),
    userType: zod_1.z.enum(["Admin", "Client", "Employee"]),
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    phoneNumber: zod_1.z.string().min(10, "Número de teléfono inválido").max(15, "Número de teléfono inválido"),
    createdAt: zod_1.z.date().optional()
});
// Login validation schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(1, "Contraseña es requerida"),
});
// Validation functions
function validateUser(data) {
    return exports.userSchema.safeParse(data);
}
function validateLogin(data) {
    return exports.loginSchema.safeParse(data);
}
