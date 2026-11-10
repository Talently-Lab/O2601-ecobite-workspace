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

## Estructura del Backend

```text
backend/
├── prisma/
│   ├── migrations/        # Migraciones de la base de datos
│   └── schema.prisma      # Modelos y relaciones
├── src/
│   ├── config/
│   │   └── prisma.js      # Cliente Prisma
│   ├── controllers/       # Controladores HTTP
│   ├── middlewares/       # Middlewares
│   ├── models/            # Carpeta para lógica de modelos
│   ├── routes/            # Rutas de la API
│   └── app.js             # Configuración de Express
├── index.js               # Inicio del servidor
├── docker-compose.yml     # Contenedor PostgreSQL
├── prisma7.config.ts      # Configuración de Prisma
├── .env.example           # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── package-lock.json
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

- Estructura inicial del backend.
- Configuración de Express.
- Middlewares CORS, JSON y Morgan.
- Variables de entorno.
- PostgreSQL configurado mediante Docker Compose.
- Prisma ORM configurado.
- Modelos User, Restaurant, Surplus y Reservation.
- Relaciones y migración inicial de base de datos.
- Conexión de Prisma Client con PostgreSQL.
- Endpoints `/health` y `/health/db`.

### Pendiente

- Autenticación y autorización.
- Endpoints de restaurantes, excedentes y reservas.
- Validaciones de negocio y restricciones de integridad pendientes.
- Cálculo de kilogramos de comida rescatada.
- Pruebas y documentación completa de la API.
- Deploy.

## Responsable

**M. Daniela Rios Valencia**  
Backend Developer — Node.js

Proyecto colaborativo impulsado por **Talently Lab**.