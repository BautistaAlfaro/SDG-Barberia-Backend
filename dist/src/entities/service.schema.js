import { z } from "zod";
export const serviceSchema = z.object({
    name: z.string().min(1, "El nombre del servicio es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    price: z.string().min(1, "El precio es requerido"),
    duracion: z.string().min(1, "La duración es requerida"),
    activo: z.string().optional(),
    createdAt: z.date().optional(),
});
// Validación para creación de servicios
export function validateService(data) {
    return serviceSchema.safeParse(data);
}
//# sourceMappingURL=service.schema.js.map