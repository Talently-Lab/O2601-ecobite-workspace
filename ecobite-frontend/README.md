# EcoBite — Frontend

Aplicación web del proyecto **EcoBite**, desarrollada con React 19 y Vite, en el marco del proyecto colaborativo de Talently Lab.

## Descripción

EcoBite es una plataforma web orientada al rescate de excedentes alimentarios.

Permite a los usuarios explorar restaurantes asociados, descubrir productos a precios reducidos, gestionar reservas y consultar información clave sobre el impacto ambiental del rescate de comida.

**Modalidad:** Rescate de excedentes en local.  
**Métrica principal:** Kilogramos de comida rescatada.

## Tecnologías

- React 19
- Vite 8
- React Router 7
- Zustand (gestión de estado global y persistencia de sesión)
- Axios (cliente HTTP)
- CSS nativo (Variables CSS y diseño responsive con BEM)
- FontAwesome (vía CDN)
- Google Fonts (Plus Jakarta Sans)

## Estructura del Frontend

```
ecobite-frontend/
├── public/
├── src/
│   ├── assets/                 # Imágenes, isotipos y fondos SVG
│   ├── components/
│   │   ├── layout/             # Layout principal, Header y Footer
│   │   ├── sections/           # Secciones compuestas de vistas (Hero, Dashboard)
│   │   └── ui/                 # Componentes reutilizables (Cards, Badges, Logos)
│   ├── constants/              # Textos y constantes de marketing
│   ├── pages/                  # Vistas principales de navegación
│   ├── services/               # Clientes de API y peticiones HTTP (Axios)
│   ├── stores/                 # Estados globales con Zustand (auth, carrito, etc.)
│   ├── styles/                 # Estilos globales y variables de diseño
│   ├── App.jsx                 # Rutas y configuración de vistas
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── .env.example
├── .env
└── package.json
```

## Instalación y ejecución local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

### Requisitos previos

- **Node.js** (versión 20 o superior recomendada)
- **npm** (incluido con Node.js)
- Tener el **Backend** en ejecución (por defecto en `http://localhost:3000`) para que las funciones de autenticación y datos operen con normalidad.

---

### Paso a paso:

#### 1. Clonar el repositorio
```bash
git clone https://github.com/Talently-Lab/O2601-ecobite-workspace.git
```

#### 2. Entrar a la carpeta del Frontend
```bash
cd O2601-ecobite-workspace/ecobite-frontend
```

#### 3. Instalar las dependencias
```bash
npm install
```

#### 4. Configurar las variables de entorno (`.env`)
Crea tu archivo `.env` en la raíz de `ecobite-frontend/` (puedes copiar el archivo de ejemplo):

```bash
# En Windows PowerShell:
Copy-Item .env.example .env

# En bash / macOS / Linux:
cp .env.example .env
```

Asegúrate de que contenga la URL hacia la API local de tu backend:
```env
VITE_API_URL=http://localhost:3000/api
```

#### 5. Iniciar la aplicación en modo desarrollo
```bash
npm run dev
```

La aplicación quedará disponible en tu navegador en:
👉 `http://localhost:5173`

---

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con recarga rápida (HMR).
- `npm run build`: Genera la compilación optimizada para producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza localmente el build de producción.
- `npm run lint`: Ejecuta el análisis de código con ESLint.
