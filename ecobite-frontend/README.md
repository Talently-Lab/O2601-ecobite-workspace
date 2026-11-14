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
- Axios
- CSS nativo (Variables CSS y diseño responsive con BEM)
- FontAwesome (vía CDN)
- Google Fonts (Plus Jakarta Sans)

## Estructura del Frontend

```
ecobite-frontend/
├── public/
├── src/
│   ├── assets/                 # Imágenes, isotipos y fondos SVG
│   │   └── backgrounds/
│   ├── components/
│   │   ├── layout/             # Layout principal, Header y Footer
│   │   │   └── header/         # Header y Navbar responsive con menú mobile
│   │   ├── sections/           # Secciones compuestas de vistas (Hero, Dashboard)
│   │   │   └── hero/
│   │   └── ui/                 # Componentes reutilizables (Cards, Badges, Logos)
│   ├── constants/              # Textos y constantes de marketing
│   ├── pages/                  # Vistas principales de navegación
│   ├── services/               # Clientes de API y peticiones HTTP (Axios)
│   ├── styles/                 # Estilos globales y variables de diseño
│   ├── App.jsx                 # Rutas y configuración de vistas
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── .env
└── package.json
```

## Instalación y ejecución

### Requisitos

- Node.js (versión 20 o superior recomendada)
- npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/Talently-Lab/O2601-ecobite-workspace.git
```

### 2. Ingresar a la carpeta del Frontend

```bash
cd ecobite-frontend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz de `ecobite-frontend/` con la URL base del Backend:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en el navegador (por defecto en `http://localhost:5173`).

---

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con recarga rápida (HMR).
- `npm run build`: Genera la compilación optimizada para producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza localmente el build de producción.
- `npm run lint`: Ejecuta el análisis de código con ESLint.
