# SDG Barbería - Backend

Backend desarrollado con Node.js, Express, TypeScript, MongoDB y MikroORM para el sistema de gestión de barbería.

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- MongoDB (local o MongoDB Atlas)

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

1. Copia el archivo `.env.example` a `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Configura las variables de entorno en `.env`:
\`\`\`env
MONGO_URI=tu_conexion_mongodb
MONGO_DB=PeluqueriaDB
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=24h
PORT=3000
FRONTEND_URL=http://localhost:4200
\`\`\`

## Ejecución

### Desarrollo
\`\`\`bash
npm run dev
\`\`\`

### Producción
\`\`\`bash
npm run build
npm start
\`\`\`

## Endpoints Disponibles

### Autenticación (Públicos)
- `POST /api/users/register` - Registrar nuevo usuario
- `POST /api/users/login` - Iniciar sesión

### Usuarios (Requieren autenticación)
- `GET /api/users` - Obtener todos los usuarios (solo Admin)
- `GET /api/users/:id` - Obtener un usuario específico
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (solo Admin)

## Ejemplo de Uso

### Registrar Usuario
\`\`\`bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "userType": "Client",
    "phoneNumber": "1234567890"
  }'
\`\`\`

### Login
\`\`\`bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
\`\`\`

### Peticiones Autenticadas
\`\`\`bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
\`\`\`

## Estructura del Proyecto

\`\`\`
src/
├── config/
│   └── orm.ts              # Configuración de MikroORM
├── controllers/
│   └── user.controller.ts  # Controladores de usuario
├── entities/
│   ├── user.entity.ts      # Entidad User
│   └── user.schema.ts      # Validaciones con Zod
├── middlewares/
│   └── authMiddleware.ts   # Middleware de autenticación
├── routes/
│   └── user.routes.ts      # Rutas de usuario
├── shared/
│   └── baseEntity.ts       # Entidad base
└── app.ts                  # Punto de entrada
\`\`\`

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **MikroORM** - ORM para TypeScript
- **JWT** - Autenticación con tokens
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación de esquemas

## Solución de Problemas

### Error: "ORM not initialized"
Asegúrate de que MongoDB esté corriendo y la conexión sea correcta.

### Error de tipos en JWT
Ya está solucionado con type assertions. Si persiste, reinstala:
\`\`\`bash
npm install --save-dev @types/jsonwebtoken
\`\`\`

### Error: "Cannot find module"
Verifica que los imports tengan extensión `.js`:
\`\`\`typescript
import { User } from "../entities/user.entity.js"  // ✅
\`\`\`

## Documentación Adicional

- Ver `SETUP.md` para guía detallada de configuración
- Ver `.env.example` para variables de entorno requeridas

## Próximos Pasos

- [ ] Implementar entidades de Services
- [ ] Implementar entidades de Appointments
- [ ] Implementar entidades de Payments
- [ ] Conectar con frontend Angular
- [ ] Agregar tests unitarios

## Licencia

ISC
