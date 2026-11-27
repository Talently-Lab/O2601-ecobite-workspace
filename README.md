# EcoBite — Plataforma de Rescate de Alimentos

Proyecto colaborativo desarrollado en el marco de **Talently Lab**, mediante una simulación de desarrollo de software en equipo.

## Descripción

EcoBite es una plataforma web sustentable que busca reducir el desperdicio de alimentos, conectando usuarios con restaurantes y comercios que ofrecen excedentes de comida a precios reducidos.

Los usuarios podrán consultar las ofertas disponibles, reservar packs de comida y retirarlos directamente en el establecimiento mediante un código de reserva.

**Modalidad:** Rescate de excedentes (sin delivery).


**Métrica principal de impacto:** Kilogramos de comida rescatada.

## Objetivo del MVP

Desarrollar una plataforma web responsive que permita:

- Registro e inicio de sesión de usuarios.
- Visualización de restaurantes y packs de comida disponibles.
- Reserva de alimentos mediante un checkout simulado.
- Retiro de pedidos en el establecimiento mediante un código.
- Gestión de restaurantes y ofertas desde el rol administrador.
- Visualización de métricas de impacto ambiental.

## Stack tecnológico

| Área | Tecnologías |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Control de versiones | Git + GitHub |
| Gestión del proyecto | Trello |

*Las tecnologías y herramientas pueden actualizarse según las decisiones del equipo.*

## Estructura del repositorio

```text
O2601-ecobite-workspace/
│
├── ecobite-frontend/       # Aplicación web
│
├── backend/                # API REST
│   └── src/
│
├── docs/                   # Documentación
│   ├── api/                # Documentación de API
│   ├── pm/                 # Gestión del proyecto
│   └── qa/                 # Testing y calidad
│
├── product_y_growth/       # Producto y crecimiento
│   ├── data/               # Análisis de datos
│   ├── design/             # Diseño gráfico
│   └── marketing/          # Estrategia de marketing
│
├── .gitignore
└── README.md
```

## 👥 Equipo de desarrollo

| Integrante | Rol |
|---|---|
| Kaiane Jesabel Díaz Velázquez | Project Manager |
| Mireya Daniela Rios Valencia | Backend Developer — Node.js |
| Claudio Caicedo | Frontend Developer — React |
| Alberto Hueraman Mena | Diseñador UX/UI |
| Sofía Rozada | Diseñadora Gráfica |
| Juan Andres Burgos | Data Analyst |
| Mercado Diego | QA Tester Manual |
| Marina García | QA Tester Manual |

## Flujo de trabajo con Git

El repositorio utiliza las siguientes ramas:

- `main`: versión estable del proyecto.
- `dev`: rama de integración del desarrollo.
- `feat/*`: ramas destinadas al desarrollo de tareas o funcionalidades.

Los cambios se realizan en ramas independientes y se integran a `dev` mediante Pull Requests.

## 📚 Documentación

La documentación técnica y funcional del proyecto se organizará dentro de la carpeta `docs/`.

## 📄 Proyecto académico

Proyecto de simulación profesional impulsado por **Talently Lab**, orientado al aprendizaje colaborativo, el desarrollo de habilidades técnicas y la construcción de experiencia práctica.