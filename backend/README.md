# EcoBite — Backend API

API REST de EcoBite, proyecto colaborativo de Talently Lab orientado al rescate de excedentes alimentarios. Los clientes reservan comida a precio reducido y la retiran en el local mediante un código, sin delivery. La métrica principal es la cantidad de kg de comida rescatada.

## Tecnologías

Node.js 22 (compatible con Prisma 7), Express 5, JavaScript (ES Modules), PostgreSQL 17, Docker Compose, Prisma ORM 7, Joi, bcryptjs, JWT, CORS, dotenv y Morgan.

## Instalación y ejecución

Requisitos: Node.js, npm y Docker Desktop.

```bash
git clone https://github.com/Talently-Lab/O2601-ecobite-workspace.git
cd O2601-ecobite-workspace/backend
npm install
```

Crear `.env` a partir de `.env.example` y configurar:

```env
PORT=3000
NODE_ENV=development
POSTGRES_PASSWORD=tu_password_local
DATABASE_URL="postgresql://ecobite:tu_password_local@localhost:5432/ecobite_db?schema=public"
JWT_SECRET=tu_clave_aleatoria_segura
JWT_EXPIRES_IN=1h
ADMIN_NAME="Administrador EcoBite"
ADMIN_EMAIL=admin@ecobite.com
ADMIN_PASSWORD=tu_password_segura
```

La contraseña de PostgreSQL debe coincidir en ambas variables. No subir `.env` a GitHub. Para generar una clave JWT segura:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Con Docker Desktop iniciado, ejecutar:

```bash
docker compose up -d
npx prisma migrate deploy
npx prisma generate
node prisma/seed.js
npm run dev
```

El seed crea el administrador inicial y datos de prueba. Ejecutarlo solo cuando sea necesario: puede actualizar el excedente de prueba existente. El registro público crea únicamente clientes.

**URL local:** `http://localhost:3000`. Para iniciar sin modo watch: `npm start`.

## Endpoints disponibles

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado de la API |
| GET | `/health/db` | Público | Conexión a PostgreSQL |
| GET | `/api/restaurants` | Público | Listar restaurantes |
| GET | `/api/surpluses` | Público | Listar excedentes |
| POST | `/api/users/register` | Público | Registrar cliente |
| POST | `/api/users/login` | Público | Iniciar sesión y obtener JWT |
| GET | `/api/users/me` | Autenticado | Consultar perfil |
| GET | `/api/users` | ADMIN | Listar clientes |
| POST | `/api/surpluses` | ADMIN | Crear excedente |
| POST | `/api/orders` | CLIENTE | Crear reserva |
| PATCH | `/api/orders/:id/pickup` | ADMIN | Confirmar retiro |

### Autenticación

Registro: enviar `name`, `email` y `password` (8 a 72 caracteres). Login: enviar `email` y `password`.

Para endpoints protegidos, utilizar el token obtenido en el login:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Roles: `CLIENTE` y `ADMIN`. El MVP contempla un único administrador inicial.

## Semana 5 — Excedentes y reservas

Los siguientes ejemplos utilizan IDs ilustrativos: reemplazarlos por UUID reales y ajustar la fecha y el horario de retiro.

### POST /api/surpluses — Crear excedente (ADMIN)

```json
{
  "restaurantId": "UUID_DEL_RESTAURANTE",
  "name": "Pack de medialunas",
  "foodType": "Panadería",
  "quantityAvailable": 10,
  "weightKg": 0.5,
  "originalPrice": 5000,
  "discountPercentage": 20,
  "date": "2026-11-27",
  "pickupFrom": "09:00",
  "pickupUntil": "22:00",
  "imageUrls": []
}
```

- Descuentos permitidos: 10%, 20% o 30%. El backend calcula `rescuePrice`; no se envía en el body.
- Restaurante existente y activo, cantidad entera positiva, peso y precio positivos, fecha no pasada y horario inicial anterior al final.
- `foodType` e `imageUrls` son opcionales. Horarios locales de Argentina, formato `HH:mm`.
- Respuesta `201 Created`: excedente creado con su ID y precio calculado (en este ejemplo, $4.000).

### POST /api/orders — Crear reserva (CLIENTE)

```json
{
  "surplusId": "UUID_DEL_EXCEDENTE",
  "quantity": 2
}
```

- Una reserva corresponde a un único excedente y puede incluir varias unidades.
- El cliente se identifica mediante JWT. El precio y peso unitarios se obtienen de la base de datos.
- Se valida la existencia del excedente, restaurante activo, vencimiento y stock suficiente.
- Se descuenta stock y se crea la reserva dentro de una transacción con actualización condicional para evitar sobreventas.
- Respuesta `201 Created`: incluye `id` (reserva), `totalAmount`, `kgRescued`, `pickupCode` (único, 6 caracteres), `status: RESERVADA` y `quantityAvailable` actualizado.

### PATCH /api/orders/:id/pickup — Confirmar retiro (ADMIN)

Usar el ID de la reserva, no el del excedente.

```json
{
  "pickupCode": "ABC234"
}
```

- La reserva debe estar en estado `RESERVADA`, el código debe coincidir y el retiro debe realizarse dentro del horario establecido.
- Respuesta `200 OK`: cambia el estado a `RETIRADA`, registra `pickedUpAt` y devuelve los kg rescatados.
- No vuelve a descontar stock ni permite confirmar dos veces el mismo retiro.

### Cálculos de negocio

- `rescuePrice = originalPrice × (1 - discountPercentage / 100)` (redondeado a 2 decimales).
- `totalAmount = quantity × unitPrice`.
- `kgRescued = quantity × unitWeightKg`. En una reserva pendiente representa comida reservada; para el impacto ambiental solo se contabilizan reservas `RETIRADA`.

## Respuestas HTTP

Formato habitual: `{ "success": true, "message": "...", "data": {} }`. Los errores incluyen `success: false`, `message` y, en validaciones Joi, `errors`.

| Código | Significado |
|---|---|
| 200 / 201 | Operación exitosa / recurso creado |
| 400 | Datos inválidos o regla de negocio incumplida |
| 401 | Token ausente, inválido o expirado |
| 403 | Rol sin permisos |
| 404 | Recurso inexistente |
| 409 | Conflicto: stock insuficiente, estado incompatible o duplicado |
| 500 | Error interno |

## Arquitectura y base de datos

```text
backend/
├── prisma/           # Schema, migraciones y seed
├── src/
│   ├── config/       # Prisma
│   ├── controllers/  # Health
│   ├── middlewares/  # JWT, roles y Joi
│   ├── modules/      # users, restaurants, surpluses, orders
│   ├── routes/       # Health
│   ├── utils/        # ResponseHelper
│   ├── api.routes.js
│   └── app.js
├── index.js
└── docker-compose.yml
```

Modelos Prisma: `User`, `Restaurant`, `Surplus` y `Reservation`. Cada usuario puede tener varias reservas; cada restaurante, varios excedentes; cada excedente, varias reservas. El módulo Orders utiliza `Reservation`, sin agregar una tabla de pedidos.

## Estado del desarrollo

- Semanas 2–3: configuración, base de datos, catálogo y registro.
- Semana 4: autenticación JWT, roles y perfil de usuario.
- Semana 5: creación de excedentes, descuentos, reservas, control de stock y confirmación de retiro. Pruebas funcionales en Postman y DBeaver.

git 

## Responsable

**M. Daniela Rios Valencia** — Backend Developer (Node.js).  
Proyecto colaborativo impulsado por **Talently Lab**.
