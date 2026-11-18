# EcoBite — Backend API

API REST del proyecto **EcoBite**, desarrollada con Node.js y Express, en el marco del proyecto colaborativo de Talently Lab.

## Descripción

EcoBite es una plataforma web orientada al rescate de excedentes alimentarios.

Permite que los usuarios consulten ofertas de comida a precio reducido, realicen reservas y retiren sus pedidos en los establecimientos mediante un código.

**Modalidad:** Rescate de excedentes (sin delivery).

**Métrica principal:** Kilogramos de comida rescatada.

## Tecnologías

- Node.js
- Express 5
- JavaScript (ES Modules)
- PostgreSQL 17
- Docker Compose
- Prisma ORM 7
- CORS
- dotenv
- Morgan
- Joi (validación de datos)
- bcryptjs (hash de contraseñas)
- jsonwebtoken (autenticación JWT y autorización por roles)

## Estructura del Backend

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   └── health.controller.js
│   ├── middlewares/
│   │   ├── validateData.js
│   │   ├── auth.middleware.js
│   │   └── authorize.middleware.js
│   ├── modules/
│   │   ├── restaurants/
│   │   │   ├── restaurant.routes.js
│   │   │   ├── restaurant.controller.js
│   │   │   └── restaurant.service.js
│   │   ├── surpluses/
│   │   │   ├── surplus.routes.js
│   │   │   ├── surplus.controller.js
│   │   │   └── surplus.service.js
│   │   └── users/
│   │       ├── user.routes.js
│   │       ├── user.controller.js
│   │       ├── user.service.js
│   │       └── user.schema.js
│   ├── routes/
│   │   └── health.routes.js
│   ├── utils/
│   │   └── responseHelper.js
│   ├── api.routes.js
│   └── app.js
├── index.js
├── docker-compose.yml
├── prisma7.config.ts
├── .env.example
└── package.json
```

## Instalación y ejecución

### Requisitos

- Node.js 22 compatible con Prisma 7
- npm
- Docker Desktop

### 1. Clonar el repositorio

```bash
git clone https://github.com/Talently-Lab/O2601-ecobite-workspace.git
```

### 2. Ingresar al Backend

```bash
cd O2601-ecobite-workspace/backend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` dentro de `backend/`, tomando como referencia `.env.example`.

```env
PORT=3000
NODE_ENV=development

POSTGRES_PASSWORD=tu_password_local
DATABASE_URL="postgresql://ecobite:tu_password_local@localhost:5432/ecobite_db?schema=public"

JWT_SECRET="reemplazar_por_clave_aleatoria_segura"
JWT_EXPIRES_IN="1h"

ADMIN_NAME="Administrador EcoBite"
ADMIN_EMAIL="admin@ecobite.com"
ADMIN_PASSWORD="reemplazar_por_password_segura"
```

La contraseña de `DATABASE_URL` debe coincidir con `POSTGRES_PASSWORD`.

**Importante:** El archivo `.env` contiene credenciales locales y no debe subirse al repositorio.

Generar `JWT_SECRET` mediante:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Utilizar una contraseña robusta para el administrador, preferentemente de al menos 12 caracteres.

### 5. Levantar PostgreSQL con Docker

Iniciar Docker Desktop y ejecutar:

```bash
docker compose up -d
```

Verificar que el contenedor esté funcionando:

```bash
docker compose ps
```

### 6. Aplicar migraciones de Prisma

```bash
npx prisma migrate deploy
```

Este comando aplica las migraciones existentes y crea las tablas en PostgreSQL.

### 7. Generar Prisma Client

```bash
npx prisma generate
```

### 8. Cargar datos iniciales y crear el administrador

Con PostgreSQL funcionando y las migraciones aplicadas:

```bash
node prisma/seed.js
```

El seed:

- Crea el administrador inicial utilizando `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
- Hashea la contraseña mediante bcryptjs.
- Asigna el rol `ADMIN`.
- Carga los datos de prueba del restaurante y excedente.
- Evita duplicar al administrador si ya existe.
- No modifica automáticamente su contraseña al volver a ejecutarse.

No se permite crear administradores desde el registro público.

### 9. Ejecutar el servidor

**Modo desarrollo:**

```bash
npm run dev
```

Utiliza `node --watch` para reiniciar automáticamente el servidor cuando se modifican los archivos.

**Modo normal:**

```bash
npm start
```

Servidor local: http://localhost:3000

---

## Endpoints disponibles

### Resumen

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado de la API |
| GET | `/health/db` | Público | Conexión a PostgreSQL |
| GET | `/api/restaurants` | Público | Listar restaurantes |
| GET | `/api/surpluses` | Público | Listar excedentes |
| POST | `/api/users/register` | Público | Registrar cliente |
| POST | `/api/users/login` | Público | Iniciar sesión |
| GET | `/api/users/me` | Autenticado | Obtener perfil |
| GET | `/api/users` | ADMIN | Listar clientes |

### GET /health

Verifica que la API esté funcionando correctamente.

```http
GET http://localhost:3000/health
```

**Respuesta exitosa — 200 OK:**

```json
{
  "status": "ok",
  "message": "EcoBite API funcionando"
}
```

### GET /health/db

Verifica la conexión entre el backend y PostgreSQL mediante Prisma.

```http
GET http://localhost:3000/health/db
```

**Respuesta exitosa — 200 OK:**

```json
{
  "status": "ok",
  "database": "connected"
}
```

Si la base de datos no responde, devuelve `503 Service Unavailable`.

### GET /api/restaurants

Obtiene el listado de restaurantes activos registrados en EcoBite, ordenados alfabéticamente.

```http
GET http://localhost:3000/api/restaurants
```

**Respuesta exitosa — 200 OK:**

```json
{
  "success": true,
  "message": "Restaurantes obtenidos correctamente",
  "data": []
}
```

Si no existen restaurantes activos, devuelve un arreglo vacío.

### GET /api/surpluses

Lista los excedentes alimentarios disponibles para consultar desde el catálogo.

```http
GET http://localhost:3000/api/surpluses
```

**Acceso:** Público, no requiere token.

**Respuesta exitosa:** `200 OK`, utilizando la estructura de respuestas estándar de la API.

---

## Autenticación y usuarios

### POST /api/users/register

Permite registrar nuevos usuarios con rol `CLIENTE`.

```http
POST http://localhost:3000/api/users/register
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "name": "Usuario Prueba",
  "email": "prueba@ecobite.com",
  "password": "Prueba1234"
}
```

**Validaciones:**

- `name`: obligatorio, entre 2 y 100 caracteres.
- `email`: obligatorio, formato válido y único.
- `password`: obligatoria, entre 8 y 72 caracteres.

Las contraseñas se almacenan hasheadas mediante bcryptjs.

**Respuesta exitosa — 201 Created (ejemplo):**

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "id": "6d827568-8550-4a1d-a3cf-5eea4e6a99c3",
    "name": "Usuario Prueba",
    "email": "prueba@ecobite.com",
    "role": "CLIENTE",
    "createdAt": "2026-11-12T15:28:56.384Z"
  }
}
```

**Errores posibles:**

| Código | Descripción |
|---|---|
| 400 | Datos faltantes o inválidos |
| 409 | Email ya registrado |
| 500 | Error inesperado del servidor |

**Importante:** Los usuarios registrados públicamente siempre reciben el rol `CLIENTE`. No pueden asignarse `ADMIN`.

### POST /api/users/login

Autentica clientes y administradores utilizando el mismo endpoint.

```http
POST http://localhost:3000/api/users/login
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "prueba@ecobite.com",
  "password": "Prueba1234"
}
```

**Respuesta exitosa — 200 OK:**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "<JWT_FIRMADO>",
    "user": {
      "id": "6d827568-8550-4a1d-a3cf-5eea4e6a99c3",
      "name": "Usuario Prueba",
      "email": "prueba@ecobite.com",
      "role": "CLIENTE"
    }
  }
}
```

**Funcionamiento:**

1. Valida el email y la contraseña.
2. Busca el usuario en PostgreSQL.
3. Compara la contraseña mediante bcryptjs.
4. Genera un JWT firmado.
5. Devuelve el token y los datos públicos del usuario.

El JWT contiene el identificador (`id`), el rol (`role`), la fecha de emisión (`iat`) y la expiración (`exp`).

**Errores:**

- `400 Bad Request`: datos inválidos.
- `401 Unauthorized`: credenciales incorrectas.

### GET /api/users/me

Devuelve los datos actuales del usuario autenticado consultando PostgreSQL.

```http
GET http://localhost:3000/api/users/me
Authorization: Bearer <JWT>
```

**Acceso:** CLIENTE y ADMIN autenticados.

**Respuesta exitosa — 200 OK:**

```json
{
  "success": true,
  "message": "Datos del usuario obtenidos correctamente",
  "data": {
    "id": "6d827568-8550-4a1d-a3cf-5eea4e6a99c3",
    "name": "Usuario Prueba",
    "email": "prueba@ecobite.com",
    "role": "CLIENTE",
    "createdAt": "2026-11-12T15:28:56.384Z"
  }
}
```

La información proviene de PostgreSQL, no únicamente del contenido del JWT.

No devuelve contraseñas, `iat` ni `exp`.

**Errores:**

- `401 Unauthorized`: token ausente, inválido o expirado.

### GET /api/users

Obtiene el listado de usuarios registrados con rol `CLIENTE`.

**Acceso exclusivo:** ADMIN.

```http
GET http://localhost:3000/api/users
Authorization: Bearer <JWT_ADMIN>
```

**Respuesta exitosa — 200 OK:**

```json
{
  "success": true,
  "message": "Clientes obtenidos correctamente",
  "data": [
    {
      "id": "6d827568-8550-4a1d-a3cf-5eea4e6a99c3",
      "name": "Usuario Prueba",
      "email": "prueba@ecobite.com",
      "role": "CLIENTE",
      "createdAt": "2026-11-12T15:28:56.384Z"
    }
  ]
}
```

**Consideraciones:**

- Solo devuelve usuarios con rol `CLIENTE`.
- El administrador no aparece en el listado.
- No expone contraseñas.
- Los clientes se ordenan por fecha de creación descendente.

**Errores:**

| Código | Descripción |
|---|---|
| 401 | Token ausente, inválido o expirado |
| 403 | Usuario sin permisos de administrador |
| 500 | Error inesperado del servidor |

---

## Autenticación y autorización por roles

El backend implementa autenticación mediante JSON Web Tokens (JWT) y autorización basada en roles (RBAC).

### Roles disponibles

| Rol | Descripción |
|---|---|
| CLIENTE | Usuario que consulta y reserva excedentes |
| ADMIN | Administrador responsable de gestionar la plataforma |

### Permisos

| Operación | Público | CLIENTE | ADMIN |
|---|---|---|---|
| Registro | Sí | Sí | Sí |
| Login | Sí | Sí | Sí |
| Consultar restaurantes | Sí | Sí | Sí |
| Consultar excedentes | Sí | Sí | Sí |
| Consultar perfil `/me` | No | Sí | Sí |
| Listar clientes | No | No | Sí |

### Middleware authenticate

Archivo: `src/middlewares/auth.middleware.js`

Responsabilidades:

- Extraer el token del header `Authorization`.
- Validar la firma del JWT.
- Verificar su vigencia.
- Guardar el payload autenticado en `req.user`.
- Rechazar solicitudes con tokens inválidos o expirados.

### Middleware authorize

Archivo: `src/middlewares/authorize.middleware.js`

Comprueba que el usuario autenticado tenga uno de los roles permitidos.

Ejemplo:

```javascript
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getClients
);
```

El acceso se valida en el backend, independientemente de las restricciones de navegación del frontend.

---

## Administrador inicial

EcoBite utiliza un único administrador inicial para el MVP.

Este usuario es responsable de administrar restaurantes, sus excedentes y consultar información de la plataforma.

### Creación del administrador

El administrador se crea mediante el archivo:

`prisma/seed.js`

Las credenciales iniciales se configuran en `.env`:

```env
ADMIN_NAME="Administrador EcoBite"
ADMIN_EMAIL="admin@ecobite.com"
ADMIN_PASSWORD="reemplazar_por_password_segura"
```

Se ejecuta mediante:

```bash
node prisma/seed.js
```

### Consideraciones de seguridad

- No existe un endpoint público para crear administradores.
- El registro público asigna únicamente `CLIENTE`.
- La contraseña del administrador se almacena hasheada.
- El seed comprueba si ya existe un administrador antes de crear uno.
- Las credenciales no deben almacenarse en el repositorio.
- La contraseña no se actualiza automáticamente al volver a ejecutar el seed.
- El seed evita duplicados durante su ejecución normal, aunque no existe una restricción de unicidad del rol ADMIN a nivel de PostgreSQL.

### Login del administrador

El administrador utiliza el mismo endpoint que los clientes:

```http
POST /api/users/login
```

Body de ejemplo:

```json
{
  "email": "admin@ecobite.com",
  "password": "TU_PASSWORD_DEL_ENV"
}
```

El backend devuelve un JWT y un usuario con rol `ADMIN`.

Frontend podrá utilizar ese rol para mostrar el panel administrativo.

---

## Pruebas con Postman — Semana 4

Se realizaron pruebas de autenticación y autorización utilizando Postman.

| Prueba | Resultado |
|---|---|
| Login con credenciales válidas | 200 OK |
| Login con contraseña incorrecta | 401 Unauthorized |
| GET `/api/users/me` con JWT válido | 200 OK |
| GET `/api/users/me` con token inválido | 401 Unauthorized |
| GET `/api/users/me` con administrador | 200 OK |
| GET `/api/users` con ADMIN | 200 OK |
| GET `/api/users` con CLIENTE | 403 Forbidden |
| GET `/api/users` con token inválido | 401 Unauthorized |

### Configurar JWT en Postman

1. Realizar el login.
2. Copiar `data.token` de la respuesta.
3. Seleccionar **Authorization → Bearer Token**.
4. Pegar el JWT.
5. Ejecutar la solicitud protegida.

---

## Validaciones y manejo de respuestas

La API utiliza componentes reutilizables para mantener una estructura consistente.

- `responseHelper.js`: centraliza las respuestas HTTP y sus códigos.
- `validateData.js`: middleware de validación utilizando Joi.
- `user.schema.js`: validaciones de registro y login.
- `auth.middleware.js`: autenticación JWT.
- `authorize.middleware.js`: autorización por roles.

Las validaciones se ejecutan antes de los controladores para evitar procesar solicitudes inválidas.

## Base de datos

El backend utiliza PostgreSQL mediante Docker Compose y Prisma ORM para administrar los modelos y relaciones.

### Modelos implementados

| Modelo | Descripción |
|---|---|
| User | Clientes y administrador |
| Restaurant | Restaurantes registrados |
| Surplus | Excedentes alimentarios |
| Reservation | Reservas y retiros de comida |

### Relaciones

- User → Reservation (1:N)
- Restaurant → Surplus (1:N)
- Surplus → Reservation (1:N)

### Migraciones

Las migraciones se encuentran versionadas en `prisma/migrations`.

Para crear una migración durante el desarrollo:

```bash
npx prisma migrate dev --name nombre_migracion
```

Para aplicar migraciones existentes:

```bash
npx prisma migrate deploy
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor |
| NODE_ENV | Entorno de ejecución |
| POSTGRES_PASSWORD | Contraseña local de PostgreSQL |
| DATABASE_URL | Conexión a la base de datos |
| JWT_SECRET | Clave para firmar y verificar JWT |
| JWT_EXPIRES_IN | Tiempo de expiración del JWT |
| ADMIN_NAME | Nombre del administrador |
| ADMIN_EMAIL | Email del administrador |
| ADMIN_PASSWORD | Contraseña inicial del administrador |

## Estado del desarrollo

### Semana 2 — Configuración y base de datos

- Configuración inicial de Node.js y Express.
- PostgreSQL mediante Docker Compose.
- Prisma ORM y migración inicial.
- Modelos User, Restaurant, Surplus y Reservation.
- Endpoints de salud `/health` y `/health/db`.

### Semana 3 — Primeros endpoints

- Arquitectura modular con separación de rutas, controladores y servicios.
- `GET /api/restaurants`: listado de restaurantes.
- `GET /api/surpluses`: listado de excedentes.
- `POST /api/users/register`: registro de clientes.
- Validación de datos mediante Joi.
- Hash de contraseñas con bcryptjs.
- Manejo centralizado de respuestas HTTP.
- Pruebas funcionales con Postman.

### Semana 4 — Autenticación y seguridad

- Implementación de login mediante JWT.
- Validación de contraseñas con bcryptjs.
- Middleware de autenticación JWT.
- Endpoint protegido `/api/users/me`.
- Consulta de datos reales del usuario desde PostgreSQL.
- Middleware de autorización por roles.
- Creación del administrador inicial mediante Prisma Seed.
- Endpoint `GET /api/users` exclusivo para ADMIN.
- Restricción del listado a usuarios con rol CLIENTE.
- Pruebas de autenticación y permisos en Postman.

## Responsable

**M. Daniela Rios Valencia**  
Backend Developer — Node.js

Proyecto colaborativo impulsado por **Talently Lab**.
