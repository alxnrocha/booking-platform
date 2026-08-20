# Blueprint — Projeto 15: Plataforma de Reservas Multiusuário (StayHub)

- **Nicho:** Aluguel por Temporada & Hospitalidade Multi-Tenant (Estilo Airbnb / Luxury Vacation Rentals).
- **Repositório GitHub:** `https://github.com/alxnrocha/booking-platform` · **Pasta Local:** `15-booking-platform/`
- **Marco Técnico:** Multi-tenant com RBAC (Guest vs Host vs Admin), prevenção de double booking, modelo relacional com Prisma 6 / PostgreSQL 17, dashboard analítico do anfitrião com Recharts e suíte de testes com Vitest.

---

## 🏛️ 1. Arquitetura & Estrutura de Pastas

```text
15-booking-platform/
├── src/
│   ├── components/
│   │   ├── layout/                 # Navbar (Floating Search Bar, Role Switcher), Footer
│   │   ├── marketplace/            # CategoryFilterBar, PropertyCard, PropertyGrid, FilterModal
│   │   ├── property/               # PropertyGallery, HostInfoCard, BedroomCards, AmenitiesGrid, BookingPolicy
│   │   ├── booking/                # BookingWidget, ReservationModal, BookingConfirmationVoucher
│   │   ├── host/                   # HostDashboard, HostKpiCards, RevenueChart, AvailabilityCalendar, ListingManager
│   │   ├── trips/                  # MyTripsView, ReservationCard, CancelReservationModal
│   │   └── ui/                     # Button, Badge, Card, Modal, Input, DatePicker, Select
│   ├── data/                       # Mock data determinístico (Properties, Hosts, Bookings, Reviews)
│   ├── hooks/                      # useBooking, useProperties, useHostAnalytics, useAuth
│   ├── stores/                     # Zustand stores (useAuthStore, useBookingStore, useFilterStore)
│   ├── types/                      # Interfaces TypeScript (Property, Reservation, User, RBAC, Amenity)
│   ├── utils/                      # formatters.ts, dateUtils.ts, pricingCalculator.ts, validation.ts
│   ├── App.tsx                     # Roteamento de telas e controle de visualização
│   ├── main.tsx
│   └── index.css                   # Tailwind CSS v4 + Design Tokens
├── prisma/
│   ├── schema.prisma               # Schema relacional PostgreSQL 17
│   └── seed.ts                     # População inicial de dados
├── database/
│   ├── schema.sql                  # DDL PostgreSQL 17
│   ├── seed.sql                    # Massa de dados SQL
│   └── README.md                   # DER em Mermaid + Dicionário de Dados
├── design/
│   ├── PROMPTS.md                  # Prompts canônicos para IA visual
│   └── mockup_completo.png         # Referência visual de alta fidelidade
├── compose.yaml                    # Docker Compose (PostgreSQL 17)
├── .env.example
├── .github/workflows/ci.yml        # CI automatizado (Lint + Tests + Build)
├── BLUEPRINT.md
├── DECISIONS.md
├── README.md                       # Documentação técnica em Espanhol
└── STATUS_PROGRESSO.md             # Controle local (privado)
```

---

## 🗄️ 2. Modelo de Dados Relacional (Prisma 6 + PostgreSQL 17)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  GUEST
  HOST
  ADMIN
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model User {
  id              String         @id @default(cuid())
  name            String
  email           String         @unique
  avatarUrl       String
  role            Role           @default(GUEST)
  isSuperhost     Boolean        @default(false)
  yearsHosting    Int            @default(0)
  createdAt       DateTime       @default(now())
  properties      Property[]
  reservations    Reservation[]
  reviews         Review[]
}

model Property {
  id              String         @id @default(cuid())
  hostId          String
  host            User           @relation(fields: [hostId], references: [id], onDelete: Cascade)
  title           String
  subtitle        String
  description     String
  location        String
  country         String
  category        String         // Beachfront, Cabins, Luxury, Infinity Pools, etc.
  pricePerNight   Decimal        @db.Decimal(10, 2)
  cleaningFee     Decimal        @db.Decimal(10, 2)
  serviceFeeRate  Decimal        @db.Decimal(5, 4) @default(0.1145)
  rating          Decimal        @db.Decimal(3, 2) @default(5.0)
  reviewCount     Int            @default(0)
  isSuperhost     Boolean        @default(false)
  maxGuests       Int            @default(4)
  bedrooms        Int            @default(2)
  beds            Int            @default(3)
  baths           Int            @default(2)
  images          String[]
  amenities       String[]
  sleepingDetails Json
  cancellationDays Int           @default(30)
  instantBooking  Boolean        @default(true)
  createdAt       DateTime       @default(now())
  reservations    Reservation[]
  reviews         Review[]
}

model Reservation {
  id               String            @id @default(cuid())
  propertyId       String
  property         Property          @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  guestId          String
  guest            User              @relation(fields: [guestId], references: [id], onDelete: Cascade)
  checkIn          DateTime
  checkOut         DateTime
  nights           Int
  guestsCount      Int
  basePrice        Decimal           @db.Decimal(10, 2)
  cleaningFee      Decimal           @db.Decimal(10, 2)
  serviceFee       Decimal           @db.Decimal(10, 2)
  totalPrice       Decimal           @db.Decimal(10, 2)
  status           ReservationStatus @default(CONFIRMED)
  confirmationCode String            @unique
  createdAt        DateTime          @default(now())
}

model Review {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  authorId   String
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  rating     Int
  comment    String
  createdAt  DateTime @default(now())
}
```

---

## 🗺️ 3. Fluxo Completo do Usuário (End-to-End)

```text
[ 1. Navegação & Descoberta ] ──► Barra de busca (Destino/Datas/Hóspedes) + Filtro de Categorias
              │
              ▼
[ 2. Seleção de Imóvel ]      ──► Grade de imóveis com carrossel de fotos, preços e avaliações
              │
              ▼
[ 3. Detalhes & Galeria ]     ──► Galeria 5-fotos masonry, dados do anfitrião, quartos e comodidades
              │
              ▼
[ 4. Reserva & Checkout ]     ──► Seleção de datas no calendário, cálculo dinâmico e "Reserve Now"
              │
              ▼
[ 5. Confirmação & Voucher ]  ──► Código de reserva único, política de cancelamento e "Minhas Viagens"
              │
              ▼
[ 6. Portal do Anfitrião ]    ──► Alternância RBAC, KPIs de faturamento, taxa de ocupação e gestão de imóveis
```

---

## 📋 4. Roadmap de Issues (4 Milestones FORGE-DEV)

### 🪵 Milestone 1 — Foundation, Models & Docker
- **Issue #1:** Scaffold do projeto (React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Oxlint + Vitest + CI GitHub Actions).
- **Issue #2:** Modelagem SQL / Prisma (`schema.prisma`, `database/schema.sql`, `database/seed.sql`, `compose.yaml` com PostgreSQL 17 e fixtures determinísticas).

### 🪵 Milestone 2 — Marketplace Discovery & Navigation
- **Issue #3:** Shell da Aplicação & Navbar com barra de busca flutuante e seletor RBAC (Hóspede / Anfitrião).
- **Issue #4:** Barra de Categorias e Grade de Imóveis (Cards com carrossel de fotos, favoritos e badges).

### ⚙️ Milestone 3 — Property Details, Booking Engine & Host Portal
- **Issue #5:** Página de Detalhes do Imóvel (Galeria masonry 5-fotos, Anfitrião, Quartos, Comodidades e Políticas).
- **Issue #6:** Motor de Reservas & Checkout Dinâmico (Cálculo de taxas, prevenção de overlap de datas e modal de confirmação).
- **Issue #7:** Portal do Anfitrião (Dashboard com 4 KPIs, Gráfico de Faturamento e Calendário de Disponibilidade).

### 🛡️ Milestone 4 — Quality, Testing & Release
- **Issue #8:** Suíte de Testes Unitários e de Integração com Vitest (Cálculos de diárias, regras de negócio e validação Zod).
- **Issue #9:** Auditoria de Acessibilidade ARIA, Navegação por Teclado e Responsividade Mobile.
- **Issue #10:** Documentação Técnica Oficial em Espanhol (`README.md`), DER em Mermaid e `LICENSE` (MIT).
