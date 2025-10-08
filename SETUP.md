# Guía de Configuración - Backend Barbería SDG

## Problemas Comunes y Soluciones

### 1. Error de tipos en JWT

**Problema:** TypeScript no reconoce correctamente los tipos de `jwt.sign()`

**Solución:** Ya está implementada en `src/controllers/user.controller.ts` con type assertions:

\`\`\`typescript
const token = jwt.sign(
  { id: user.id, userType: user.userType } as object,
  process.env.JWT_SECRET as string,
  { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } as jwt.SignOptions,
)
\`\`\`

### 2. Versiones de dependencias incorrectas

**Problema en tu package.json local:**
- `bcrypt: ^6.0.0` - Esta versión no existe (última estable es 5.1.1)
- `zod: ^4.1.12` - Esta versión no existe (última estable es 3.23.8)
- `express: ^5.1.0` - Versión beta, mejor usar 4.19.2

**Solución:** Elimina `node_modules` y reinstala:

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### 3. Configuración de TypeScript

Tu `tsconfig.json` debe tener estas configuraciones clave:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
\`\`\`

### 4. Variables de entorno requeridas

Crea un archivo `.env` en la raíz del proyecto:

\`\`\`env
# MongoDB
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/
MONGO_DB=PeluqueriaDB

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiala
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:4200
\`\`\`

## Pasos para iniciar el proyecto

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa los valores:

\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Iniciar en modo desarrollo

\`\`\`bash
npm run dev
\`\`\`

El servidor debería iniciar en `http://localhost:3000`

### 4. Verificar que funciona

Abre tu navegador o Postman y prueba:

\`\`\`
GET http://localhost:3000/
\`\`\`

Deberías ver:
\`\`\`json
{
  "message": "API de Barbería SDG funcionando correctamente",
  "version": "1.0.0"
}
\`\`\`

## Endpoints disponibles

### Públicos (sin autenticación)

- `POST /api/users/register` - Registrar nuevo usuario
- `POST /api/users/login` - Iniciar sesión

### Protegidos (requieren token)

- `GET /api/users` - Listar todos los usuarios (solo Admin)
- `GET /api/users/:id` - Obtener un usuario (Admin o el mismo usuario)
- `PUT /api/users/:id` - Actualizar usuario (Admin o el mismo usuario)
- `DELETE /api/users/:id` - Eliminar usuario (solo Admin)

## Ejemplo de uso

### Registrar usuario

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

Respuesta:
\`\`\`json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "userType": "Client"
  },
  "expiresIn": "24h"
}
\`\`\`

### Usar el token en peticiones protegidas

\`\`\`bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
\`\`\`

## Estructura del proyecto

\`\`\`
src/
├── config/
│   └── orm.ts              # Configuración de MikroORM
├── controllers/
│   └── user.controller.ts  # Lógica de negocio de usuarios
├── entities/
│   ├── user.entity.ts      # Modelo de datos de usuario
│   └── user.schema.ts      # Validaciones con Zod
├── middlewares/
│   └── authMiddleware.ts   # Autenticación y autorización
├── routes/
│   └── user.routes.ts      # Rutas de la API
├── shared/
│   └── baseEntity.ts       # Entidad base para MongoDB
└── app.ts                  # Punto de entrada de la aplicación
\`\`\`

## Solución de problemas

### Error: "ORM not initialized"

Asegúrate de que `initORM()` se llama antes de usar cualquier repositorio.

### Error: "Cannot find module"

Verifica que todos los imports tengan la extensión `.js`:

\`\`\`typescript
import { User } from "../entities/user.entity.js"  // ✅ Correcto
import { User } from "../entities/user.entity"     // ❌ Incorrecto
\`\`\`

### Error de conexión a MongoDB

Verifica que tu `MONGO_URI` sea correcta y que tu IP esté en la whitelist de MongoDB Atlas.

### Error de tipos en JWT

Ya está solucionado con type assertions en el código. Si persiste, reinstala las dependencias:

\`\`\`bash
npm install --save-dev @types/jsonwebtoken
\`\`\`

## Próximos pasos

1. ✅ Configuración básica de usuarios
2. 🔄 Agregar entidades de Services, Appointments, Payments
3. 🔄 Implementar endpoints para servicios
4. 🔄 Implementar endpoints para turnos
5. 🔄 Implementar endpoints para pagos
6. 🔄 Conectar con el frontend Angular

## Notas importantes

- **Seguridad:** Cambia el `JWT_SECRET` en producción
- **MongoDB:** No subas credenciales al repositorio
- **CORS:** Ajusta `FRONTEND_URL` según tu configuración
- **Validaciones:** Todas las entradas se validan con Zod
- **Contraseñas:** Se hashean con bcrypt antes de guardar
\`\`\`
