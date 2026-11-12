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

## Estructura del Backend

```
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   └── health.controller.js
│   ├── middlewares/
│   │   └── validateData.js
│   ├── modules/
│   │   ├── restaurants/
│   │   │   ├── restaurant.routes.js
│   │   │   ├── restaurant.controller.js
│   │   │   └── restaurant.service.js
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
```

La contraseña de `DATABASE_URL` debe coincidir con `POSTGRES_PASSWORD`.

**Importante:** El archivo `.env` contiene credenciales locales y no debe subirse al repositorio.

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

### 8. Ejecutar el servidor

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

## Endpoints disponibles

### GET /health

Verifica que la API esté funcionando correctamente.

**URL:**

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

**URL:**

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

**URL:**

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

**Errores posibles:**

- `500 Internal Server Error`: error inesperado al consultar la base de datos.

---

### POST /api/users/register

Permite registrar un nuevo usuario con rol `CLIENTE` en la plataforma.

**URL:**

```http
POST http://localhost:3000/api/users/register
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
- `email`: obligatorio y con formato válido.
- `password`: obligatoria, entre 8 y 72 caracteres.
- El correo electrónico debe ser único.

La contraseña se almacena hasheada mediante `bcryptjs`. No se devuelve en la respuesta de la API.

**Respuesta exitosa — 201 Created:**

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

*Los valores de `id` y `createdAt` son ilustrativos y se generan automáticamente.*

**Errores posibles:**

| Código HTTP | Descripción |
|---|---|
| `400 Bad Request` | Datos faltantes o inválidos. |
| `409 Conflict` | El email ya se encuentra registrado. |
| `500 Internal Server Error` | Error inesperado del servidor. |

**Ejemplo — 400 Bad Request:**

```json
{
  "success": false,
  "message": "Error de validación en los datos ingresados",
  "errors": [
    {
      "field": "password",
      "message": "La contraseña debe tener al menos 8 caracteres"
    }
  ]
}
```

**Ejemplo — 409 Conflict:**

```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

---

### Validaciones y manejo de respuestas

La API utiliza componentes reutilizables para mantener una estructura consistente:

- `responseHelper.js`: centraliza las respuestas HTTP y sus códigos de estado.
- `validateData.js`: middleware de validación utilizando Joi.
- `user.schema.js`: define las reglas de validación del registro de usuarios.

La validación se ejecuta antes del controlador para evitar procesar solicitudes con datos incorrectos.

## Base de datos

El backend utiliza **PostgreSQL ejecutado mediante Docker Compose** y **Prisma ORM** para administrar los modelos, las relaciones y las migraciones.

### Modelos implementados

| Modelo | Descripción |
|---|---|
| User | Clientes y administrador |
| Restaurant | Restaurantes registrados |
| Surplus | Excedentes alimentarios disponibles |
| Reservation | Reservas y retiros de comida |

### Relaciones

- User → Reservation (1:N)
- Restaurant → Surplus (1:N)
- Surplus → Reservation (1:N)

### Migraciones

Las migraciones se encuentran versionadas en `prisma/migrations`.

Para crear una nueva migración durante el desarrollo, después de modificar `schema.prisma`:

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
| `PORT` | Puerto del servidor |
| `NODE_ENV` | Entorno de ejecución |
| `POSTGRES_PASSWORD` | Contraseña local de PostgreSQL |
| `DATABASE_URL` | Cadena de conexión utilizada por Prisma |

## Estado del desarrollo

### Implementado

**Semana 2 — Configuración y base de datos**

- Configuración inicial de Node.js y Express.
- PostgreSQL mediante Docker Compose.
- Prisma ORM y migración inicial.
- Modelos User, Restaurant, Surplus y Reservation.
- Endpoints de salud `/health` y `/health/db`.

**Semana 3 — Primeros endpoints**

- Arquitectura modular con separación de rutas, controladores y servicios.
- `GET /api/restaurants`: listado de restaurantes activos.
- `POST /api/users/register`: registro de clientes.
- Validación de datos mediante Joi.
- Hash de contraseñas con bcryptjs.
- Manejo centralizado de respuestas y códigos HTTP.
- Pruebas funcionales con Postman.
- Verificación de persistencia de usuarios en PostgreSQL mediante DBeaver.

### Pendiente

- Login y autenticación mediante JWT.
- Autorización por roles (CLIENTE y ADMIN).
- Gestión de restaurantes y excedentes.
- Creación y gestión de reservas.
- Generación y validación de códigos de retiro.
- Cálculo de kilogramos de comida rescatada.
- Documentación completa de la API.
- Pruebas de integración y deploy.

## Responsable

**M. Daniela Rios Valencia**  
Backend Developer — Node.js

Proyecto colaborativo impulsado por **Talently Lab**.