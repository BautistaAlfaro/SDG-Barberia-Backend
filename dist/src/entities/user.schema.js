import { z } from "zod";
export const userSchema = z.object({
    firstName: z.string().min(1, "Nombre es requerido"),
    lastName: z.string().min(1, "Apellido es requerido"),
    userType: z.enum(["Admin", "Client", "Employee"]),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    phoneNumber: z.string().min(10, "Número de teléfono inválido").max(15, "Número de teléfono inválido").optional(),
    createdAt: z.date().optional(),
});
export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Contraseña es requerida"),
});
export function validateUser(data) {
    return userSchema.safeParse(data);
}
export function validateLogin(data) {
    return loginSchema.safeParse(data);
}
//# sourceMappingURL=user.schema.js.map