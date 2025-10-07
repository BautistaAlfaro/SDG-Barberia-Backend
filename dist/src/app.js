"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orm_1 = require("./config/orm");
const user_entity_1 = require("./entities/user.entity");
const user_schema_js_1 = require("./entities/user.schema.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function run() {
    const em = orm_1.orm.em.fork();
    // Datos de prueba
    const newUserData = {
        dni: "12345678",
        firstName: "Juan",
        lastName: "Perez",
        userType: "Client",
        email: "juan@test.com",
        password: "123456",
        phoneNumber: "34431987",
        address: { street: "Calle Falsa 123", city: "Rosario", zip: "2000" }
    };
    // Validación con Zod
    const validation = user_schema_js_1.userSchema.safeParse(newUserData);
    if (!validation.success) {
        console.log("Error de validación:", validation.error.format());
        return;
    }
    // Hash de contraseña
    const hashedPassword = await bcrypt_1.default.hash(newUserData.password, 10);
    // Crear entidad User
    const user = em.create(user_entity_1.User, {
        ...newUserData,
        userType: newUserData.userType,
        password: hashedPassword,
        createdAt: new Date()
    });
    // Guardar en DB
    await em.persistAndFlush(user);
    console.log("Usuario insertado con éxito:", user);
}
run().catch(console.error);
