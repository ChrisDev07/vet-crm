# 🐾 MEDIVET CRM — Sistema de Gestión de Oportunidades Veterinarias

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)

Sistema web de **CRM Clínico Veterinario** diseñado para el registro ágil, seguimiento activo y analítica cuantitativa de oportunidades de atención no concretadas en la recepción de clínicas veterinarias. 

Su propósito es evitar la pérdida de pacientes por dudas de precios, horarios o inasistencias, midiendo el impacto real de recuperación clínica a través de **7 KPIs automáticos** en PostgreSQL.

---

## ✨ Módulos y Funcionalidades

* **📝 Registro Rápido de Oportunidades (`/registro` — RF-01):**
  Formulario optimizado para recepción (< 1 minuto por captura) con registro relacional de **Tutor**, **Paciente**, **Especie** (`Canino`, `Felino`, `Otro`), **Teléfono**, **Servicio de Interés** (`Medicina General`, `Medicina Interna`), **Tipo de Oportunidad**, **Motivo**, **Observaciones** y **Fecha Propuesta de Seguimiento**.
* **📋 Gestión y Seguimiento (`/gestion` — RF-02):**
  Bandeja operativa interactiva con filtro prioritario **"Llamadas de Hoy"**, barra de búsqueda, pestañas por estado (`Pendiente`, `En Proceso`, `Cita Agendada`, `Consulta Concretada`, `Rechazado`) y bitácora de resultados de contacto.
* **📊 Tablero de Métricas Clínicas (`/dashboard` — RF-03):**
  Cálculo automático en tiempo real de los 7 indicadores clave mediante la vista SQL `vista_metricas_dashboard`:
  1. **Oportunidades Identificadas** (Total de casos registrados)
  2. **Oportunidades Gestionadas** (Casos con estado distinto a `Pendiente`)
  3. **Citas Generadas** (Casos con estado `Cita Agendada`)
  4. **Consultas Concretadas** (Pacientes que asistieron a consulta)
  5. **Pacientes Recuperados** (Consultas concretadas tras `Inasistencia`, `Cancelación` o `Sin nueva atención registrada`)
  6. **Consultas Medicina General**
  7. **Consultas Medicina Interna**
* **📥 Exportación a Excel / CSV (RF-04):**
  Descarga directa tanto de la base de oportunidades como del resumen de KPIs en formato `.csv` con codificación `UTF-8 BOM` lista para Microsoft Excel.
* **🛡️ Control de Turno / ShiftGuard (`/login` — RF-05):**
  Selección rápida de turno laboral (*Turno Mañana* / *Turno Tarde*) persistida en el navegador, visible en la barra lateral y en inicio, con protección de acceso a las rutas del panel clínico y navegación adaptable para PC y tablet.
* **🔎 Buscador Global tipo Spotlight (`Ctrl+K`):**
  Acceso rápido desde la barra superior para localizar tutores, pacientes o teléfonos en Supabase y saltar directamente a su seguimiento en `/gestion`.
* **🗄️ Persistencia Real en la Nube:**
  Conectado directamente a Supabase (PostgreSQL) sin datos ficticios ni de prueba; cada oportunidad registrada en `/registro` y cada cambio en `/gestion` se refleja al instante en las métricas y notificaciones.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | Next.js 16.4 (App Router + Turbopack) |
| **UI & Lenguaje** | React 19, TypeScript 5 |
| **Estilos & Animaciones** | Tailwind CSS v4, Framer Motion, Lucide React, Material Symbols |
| **Base de Datos** | Supabase (PostgreSQL + RLS + Vista de Métricas + Triggers) |
| **Contenerización** | Docker & Docker Compose (`node:20`) |

---

## 📁 Estructura del Proyecto

```text
vet-crm/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx   # Tablero de 7 KPIs y exportación de métricas
│   │   ├── gestion/page.tsx     # Bandeja de seguimiento, filtros y exportación CSV
│   │   ├── registro/page.tsx    # Vista de captura de oportunidades
│   │   ├── layout.tsx           # Layout con Sidebar, Topbar y ShiftGuard
│   │   └── page.tsx             # Pantalla de inicio y accesos rápidos
│   ├── login/page.tsx           # Selección de turno de recepción
│   ├── globals.css              # Design tokens y estilos Tailwind v4
│   └── layout.tsx               # Root layout y fuentes
├── components/
│   ├── DashboardShell.tsx       # Contenedor responsivo con drawer lateral y Topbar
│   ├── ShiftGuard.tsx           # Guardia de turno activo
│   ├── Sidebar.tsx              # Navegación lateral, turno activo y cierre de sesión
│   └── Topbar.tsx               # Buscador global Spotlight y notificaciones reales
├── lib/
│   ├── db.ts                    # Capa CRUD y consultas a Supabase
│   ├── shift.ts                 # Gestión reactiva del turno activo en localStorage
│   └── supabaseClient.ts        # Cliente Supabase y detector de configuración
├── supabase_schema.sql          # Esquema oficial PostgreSQL (tablas, índices, RLS y vista)
├── .env.local.example           # Plantilla de variables de entorno
├── Dockerfile                   # Imagen Docker de desarrollo/ejecución
└── docker-compose.yml           # Orquestación local en el puerto 3000
```

---

## 🗄️ Configuración de Base de Datos (Supabase)

1. Crea un proyecto gratuito en **[supabase.com](https://supabase.com)**.
2. Ve al **SQL Editor** dentro de tu proyecto y ejecuta el contenido completo del archivo [`supabase_schema.sql`](./supabase_schema.sql).
   * Esto creará las tablas limpias `pacientes` y `oportunidades`, los índices, el trigger de actualización, las políticas RLS y la vista `vista_metricas_dashboard`.
3. Ve a **Project Settings → API Keys** y copia tu **Project URL** y tu **Anon / Publishable Key**.

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar y configurar variables de entorno
```bash
git clone https://github.com/ChrisDev07/vet-crm.git
cd vet-crm
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` o `NEXT_PUBLIC_SUPABASE_ANON_KEY`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publishable-o-anon-aqui
```

### 2. Ejecutar con Node.js
```bash
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Ejecutar con Docker Compose (Opcional)
```bash
docker compose up -d --build
```

---

## 📜 Scripts Disponibles

* `npm run dev` — Inicia el servidor de desarrollo con recarga rápida.
* `npm run build` — Compila la aplicación optimizada para producción.
* `npm run start` — Inicia el servidor en modo producción.
* `npm run lint` — Ejecuta el análisis estático de ESLint.

---

## ☁️ Despliegue en Producción (Costo $0)

El proyecto está listo para desplegarse gratuitamente en **Vercel**:
1. Importa el repositorio `ChrisDev07/vet-crm` en [vercel.com](https://vercel.com).
2. Agrega las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (o `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en la configuración del proyecto.
3. Haz clic en **Deploy**.
