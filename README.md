# Proyecto 1 — Sistema de Gestión de Productos e Inventario

**Frontend** | UTN — Ingeniería y Calidad de Software 2026

---

## Descripción

Interfaz web del Sistema de Gestión de Productos e Inventario. Permite gestionar productos (marca, línea, denominación, costo y precio), controlar stock, detectar alertas de stock bajo y generar listados de precios agrupados por línea.

El precio de venta se calcula automáticamente aplicando un margen de ganancia sobre el costo (15% por defecto). El sistema detecta productos por debajo del stock mínimo y registra movimientos de stock con motivo obligatorio.

---

## URLs

| Entorno | URL |
|---|---|
| Producción (frontend) | https://proyecto1-frontend.onrender.com |
| Producción (backend) | https://proyecto1-backend.onrender.com/api |
| Swagger / Docs | https://proyecto1-backend.onrender.com/api |
| Local | http://localhost:5173 |

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.0 | Framework de UI |
| Vite | 6.1 | Bundler y servidor de desarrollo |
| TypeScript | 5.7 | Tipado estático |
| Tailwind CSS | 3.4 | Estilos utilitarios |
| Radix UI | — | Componentes accesibles |
| AG Grid | 33.3 | Tablas de datos |
| React Router DOM | 7.2 | Navegación SPA |
| React Hook Form | 7.54 | Manejo de formularios |
| Axios | 1.8 | Cliente HTTP |
| Jotai | 2.15 | Estado global |
| Recharts | 2.15 | Gráficos |
| Framer Motion | 12.4 | Animaciones |

---

## Repositorios relacionados

| Repositorio | URL |
|---|---|
| Frontend (este repo) | https://github.com/utnfrvmtrabajo-collab/Proyecto1_Front.git |
| Backend | https://github.com/utnfrvmtrabajo-collab/Proyecto1_Back.git |

---

## Requisitos previos

Antes de instalar el frontend, asegurarse de tener instalado:

- **Node.js 20 LTS** — [nodejs.org](https://nodejs.org)
- **Yarn 1.22+** — `npm install -g yarn`
- **Git**
- El **backend corriendo** (local o en producción) — ver [Proyecto1_Back](https://github.com/utnfrvmtrabajo-collab/Proyecto1_Back.git)

---

## Levantar el proyecto localmente

### 1) Clonar el repositorio

```bash
git clone https://github.com/utnfrvmtrabajo-collab/Proyecto1_Front.git
cd Proyecto1_Front
```

### 2) Instalar dependencias

```bash
yarn install
```

### 3) Configurar variables de entorno

El archivo `.env.development` ya viene configurado para desarrollo local:

```env
VITE_API_URL="http://localhost:3000/api"
```

Si el backend corre en un puerto o host diferente, editarlo antes de continuar.

### 4) Iniciar el servidor de desarrollo

```bash
yarn dev
```

El frontend queda disponible en **http://localhost:5173**

> El backend debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend. Ver las instrucciones en el repositorio del backend.

---

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `yarn dev` | Inicia el servidor de desarrollo con hot reload en http://localhost:5173 |
| `yarn build` | Compila el proyecto para producción en la carpeta `dist/` |
| `yarn preview` | Previsualiza el build de producción localmente |
| `yarn lint` | Ejecuta ESLint sobre todo el código fuente |

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3000/api` |

> Las variables de Vite deben comenzar con `VITE_` para ser accesibles en el código. Se configuran en `.env.development` para desarrollo y en `.env.production` para producción.

### Archivos de entorno

| Archivo | Entorno | Descripción |
|---|---|---|
| `.env.development` | Local | Apunta al backend en `localhost:3000` |
| `.env.production` | Producción | Apunta al backend desplegado en Render |

---

## Estructura del proyecto

```
Proyecto1_Front/
├── public/                    # Archivos estáticos públicos
├── src/
│   ├── componentes/           # Componentes organizados por dominio
│   │   ├── gestion-producto/  # ABM de productos, stock, precios
│   │   ├── gestion-organizacion/ # Usuarios, roles, organización
│   │   ├── gestion-usuario/   # Login, perfil, autenticación
│   │   ├── herramientas/      # Componentes reutilizables
│   │   ├── menu/              # Navegación y sidebar
│   │   ├── sistema/           # Configuración del sistema
│   │   └── ui/                # Componentes base (shadcn/ui)
│   ├── utils/
│   │   └── axiosConfig.ts     # Configuración del cliente HTTP
│   ├── App.tsx                # Componente raíz
│   └── main.tsx               # Punto de entrada
├── .env.development           # Variables de entorno para desarrollo
├── .env.production            # Variables de entorno para producción
├── vercel.json                # Configuración de rewrites para SPA
├── vite.config.ts             # Configuración de Vite
├── tailwind.config.js         # Configuración de Tailwind CSS
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias y scripts
```

---

## Deploy en Render (Static Site)

El frontend se despliega como **Static Site** en Render.

### Configuración del servicio

| Campo | Valor |
|---|---|
| Runtime | Static Site |
| Branch | `main` |
| Build Command | `yarn build` |
| Publish Directory | `dist` |

### Variable de entorno en Render

```
VITE_API_URL = https://proyecto1-backend.onrender.com/api
```

### Rewrite para React Router

En Render → Settings → Redirects/Rewrites, agregar:

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

Esto permite que React Router maneje las rutas del lado del cliente sin que Render devuelva 404 al recargar una página.

> El archivo `vercel.json` incluido en el repositorio cumple la misma función para deploys en Vercel.

---

## Errores conocidos y deuda técnica

Durante la revisión del código fuente en la Entrega 1 se identificaron los siguientes problemas:

| # | Problema | Severidad | Archivo |
|---|---|---|---|
| 1 | Catches vacíos que silencian errores del servidor | 🟡 Deuda | `registrar-actualizar-usuario.tsx` |
| 2 | `.env.production` apunta a `localhost` por defecto | 🟡 Deuda | `.env.production` |
| 3 | Alerta de stock bajo no se muestra en la UI aunque el backend la detecta | 🟠 Importante | Componentes de producto |

Estos problemas están documentados y planificados para resolverse en la Entrega 2.

---

## Solución de problemas frecuentes

**El frontend carga pero no muestra datos**
- Verificar que el backend esté corriendo en `http://localhost:3000`
- Revisar que `VITE_API_URL` en `.env.development` sea correcta
- Abrir las DevTools del navegador (F12) → pestaña Network → buscar errores 404 o CORS

**Error de CORS al llamar al backend**
- El backend debe tener `app.enableCors()` configurado
- En producción, verificar que `VITE_API_URL` apunte a la URL correcta de Render

**Página en blanco al recargar una ruta**
- En desarrollo: no ocurre (Vite lo maneja)
- En producción en Render: verificar que el rewrite `/* → /index.html` esté configurado

**`yarn install` falla con error de Node**
- Verificar que la versión de Node sea 20 LTS: `node --version`
- Si es anterior, descargar desde [nodejs.org](https://nodejs.org)
