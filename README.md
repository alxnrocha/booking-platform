# StayHub — Plataforma de Reservas de Lujo y Alquiler Vacacional Multi-Tenant con RBAC

<div align="center">

![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-4338CA?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-2.15-22C55E?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-22C55E?style=for-the-badge&logo=github&logoColor=white)

**Plataforma Multi-Tenant de alquiler vacacional y gestión de reservas de alta gama (estilo Airbnb Luxury) con control RBAC (Guest / Host / Admin), selector de doble mes, prevención atómica de doble reserva y portal para anfitriones.**

[🚀 Demo en Vivo](https://alxnrocha.github.io/booking-platform/) • [📂 Repositorio en GitHub](https://github.com/alxnrocha/booking-platform)

</div>

---

## 🏛️ Arquitectura y Modelo de Datos

```mermaid
erDiagram
    USERS ||--o{ PROPERTIES : "hosts"
    USERS ||--o{ RESERVATIONS : "books"
    USERS ||--o{ REVIEWS : "writes"
    PROPERTIES ||--o{ RESERVATIONS : "receives"
    PROPERTIES ||--o{ REVIEWS : "collects"

    USERS {
        varchar id PK
        varchar name
        varchar email UK
        enum role "GUEST | HOST | ADMIN"
        boolean is_superhost
        timestamp created_at
    }
    PROPERTIES {
        varchar id PK
        varchar host_id FK
        varchar title
        varchar location
        varchar country
        numeric price_per_night
        numeric rating
        jsonb images
        jsonb amenities
    }
    RESERVATIONS {
        varchar id PK
        varchar property_id FK
        varchar guest_id FK
        date check_in
        date check_out
        numeric total_price
        enum status
        varchar confirmation_code UK
    }
    REVIEWS {
        varchar id PK
        varchar property_id FK
        varchar author_id FK
        int rating
        text comment
    }
```

---

## ✨ Características Principales

1. **🎨 Diseño Dark Luxury & Experiencia de Usuario:**
   - Paleta cromática refinada con fondo Dark Slate (`#0A0F1D`), tarjetas con microbordes (`#1E293B`) y acentos en Rose Coral (`#FF385C`), Esmeralda (`#10B981`) y Oro (`#F59E0B`).
   - Contenedores panorámicos (`max-w-[1720px]`) optimizados para pantallas ultra-anchas y dispositivos móviles.

2. **🔍 Barra de Búsqueda Flotante & Selector de Doble Mes (Dual-Month):**
   - Popovers integrados para Destino, Rango de Fechas (dos meses continuos) y contador dinámico de Huéspedes.
   - Conmutador de roles en tiempo real (**Guest Mode**, **Host / Superhost** y **Platform Admin**).

3. **📱 Experiencia Móvil 100% Optimizada (< 520px):**
   - Modal de búsqueda móvil a pantalla completa y barra inferior fija de navegación (*Bottom Nav*).

4. **📸 Página de Detalles & Galería Masonry 5-Fotos:**
   - Cuadrícula fotográfica tipo masonry (1 foto principal + 4 secundarias) con modal lightbox interactivo.

5. **💳 Motor de Reservas & Prevención de Doble Reserva:**
   - Widget flotante con recálculo dinámico de tarifas, validación de fechas ocupadas y generación de voucher estilo *Boarding Pass* con código QR.

6. **📊 Portal del Anfitrión (Host Hub):**
   - Métricas clave (€18.450/mes, 88% ocupación), gráfico de ingresos con Recharts y matriz de disponibilidad con bloqueo de fechas.

---

## 🗂️ Estructura del Proyecto

```text
15-booking-platform/
├── database/
│   ├── schema.sql                     # DDL relacional PostgreSQL 17
│   └── seed.sql                       # Datos determinísticos de demostración
├── prisma/
│   └── schema.prisma                  # Esquema Prisma 6 con modelos e índices
├── src/
│   ├── components/
│   │   ├── booking/                   # BookingConfirmationModal, BookingWidget
│   │   ├── host/                      # AvailabilityCalendar, HostDashboard, RevenueChart
│   │   ├── layout/                    # AppShell, Navbar, Footer, MobileBottomNav
│   │   ├── marketplace/               # CategoryFilterBar, PropertyCard, PropertyGrid
│   │   └── property/                  # PropertyDetailView, PropertyGalleryModal
│   ├── stores/                        # useAuthStore, useBookingStore, useFilterStore
│   ├── types/                         # Tipos TypeScript
│   ├── App.tsx
│   └── main.tsx
├── tests/                             # 25 pruebas unitarias con Vitest
├── compose.yaml                       # Docker Compose PostgreSQL 17
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`
- Docker & Docker Compose (opcional para PostgreSQL 17)

### Ejecución Local
```bash
# 1. Clonar el repositorio
git clone https://github.com/alxnrocha/booking-platform.git
cd booking-platform

# 2. Instalar dependencias
npm install

# 3. Iniciar contenedor de base de datos (opcional)
docker compose up -d

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Ejecutar suite de pruebas unitarias (25 tests)
npm test

# 6. Compilar para producción
npm run build
```

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Aspectos Clave |
|---|---|---|
| **Framework** | React 19 | RBAC multi-tenant, selector de fechas dual-month |
| **Lenguaje** | TypeScript 5.8 | Tipado estricto para entidades de reserva y propiedades |
| **Base de Datos** | PostgreSQL 17, Prisma 6 | Modelo relacional, índices B-Tree, volúmenes Docker |
| **Estado Global** | Zustand 5.0 | Gestión de sesión RBAC y filtros de búsqueda |
| **Visualización** | Recharts 2.15 | Curvas de ingresos de anfitrión y ocupación |
| **Testing** | Vitest | 25 pruebas unitarias de precios y colisiones |
| **Despliegue** | GitHub Pages | Despliegue estático continuo y optimizado |

---

<div align="center">
  <sub>Desarrollado con dedicación por <a href="https://github.com/alxnrocha">Alex Rocha</a> • Proyecto 15 del Portafolio Profesional Frontend.</sub>
</div>
