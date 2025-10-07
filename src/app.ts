import { orm } from "./config/orm"
import { User } from "./entities/user.entity"
import { userSchema } from "./entities/user.schema.js"
import bcrypt from "bcrypt"

async function run() {
  const em = orm.em.fork()

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
  }

  // Validación con Zod
  const validation = userSchema.safeParse(newUserData)
  if (!validation.success) {
    console.log("Error de validación:", validation.error.format())
    return
  }

  // Hash de contraseña
  const hashedPassword = await bcrypt.hash(newUserData.password, 10)

  // Crear entidad User
  const user = em.create(User, {
    ...newUserData,
    userType: newUserData.userType as "Client" | "Admin" | "Employee",
    password: hashedPassword,
    createdAt: new Date()
  })

  // Guardar en DB
  await em.persistAndFlush(user)
  console.log("Usuario insertado con éxito:", user)
}

run().catch(console.error)
