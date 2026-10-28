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
- CORS
- dotenv
- Morgan
- PostgreSQL + Docker Compose (planificado)

## Estructura del Backend

```text
backend/
├── src/
│   ├── config/          # Configuraciones
│   ├── controllers/     # Controladores HTTP
│   ├── middlewares/     # Middlewares
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de la API
│   └── app.js           # Configuración de Express
│
├── index.js             # Inicio del servidor
├── .env.example         # Variables de entorno de ejemplo
├── .gitignore
├── package.json
└── package-lock.json
```

## Instalación y ejecución

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
```

### 5. Ejecutar el servidor

**Modo desarrollo:**

```bash
npm run dev
```

Utiliza `node --watch` para reiniciar automáticamente el servidor cuando se modifican los archivos.

**Modo normal:**

```bash
npm start
```

Servidor local:

http://localhost:3000

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

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto de ejecución del servidor |
| `NODE_ENV` | Entorno de ejecución |

El archivo `.env` no debe subirse al repositorio.

## Estado del desarrollo

**Implementado:**
- Estructura inicial del Backend.
- Configuración de Express.
- Middlewares CORS, JSON y Morgan.
- Variables de entorno.
- Endpoint de verificación `/health`.

**Pendiente:**
- Configuración de PostgreSQL con Docker Compose.
- Diagrama entidad-relación (DER).
- Modelos y relaciones de datos.
- Autenticación y autorización.
- Endpoints de restaurantes, excedentes y reservas.
- Cálculo de kilogramos de comida rescatada.
- Pruebas y documentación completa de la API.
- Deploy.

## Responsable

**M.Daniela Rios Valencia**  
Backend Developer — Node.js

Proyecto colaborativo impulsado por **Talently Lab**.