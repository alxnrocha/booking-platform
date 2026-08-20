# Modelo de Datos Relacional — StayHub Platform

Documentación técnica del modelo relacional implementado en **PostgreSQL 17** y **Prisma 6**.

---

## 📊 Diagrama Entidad-Relación (Mermaid ERD)

```mermaid
erDiagram
    USERS ||--o{ PROPERTIES : "hosts"
    USERS ||--o{ RESERVATIONS : "books"
    USERS ||--o{ REVIEWS : "writes"
    PROPERTIES ||--o{ RESERVATIONS : "receives"
    PROPERTIES ||--o{ REVIEWS : "collects"

    USERS {
        string id PK "cuid / varchar"
        string name "Nombre completo"
        string email UK "Correo único"
        string avatar_url "URL avatar"
        enum role "GUEST | HOST | ADMIN"
        boolean is_superhost "Distintivo superanfitrión"
        int years_hosting "Años en plataforma"
        datetime created_at
        datetime updated_at
    }

    PROPERTIES {
        string id PK "cuid / varchar"
        string host_id FK "Referencia a USERS"
        string title "Título del inmueble"
        string subtitle "Destacado visual"
        string description "Descripción completa"
        string location "Ciudad o región"
        string country "País"
        string category "Categoría del filtro"
        decimal price_per_night "Tarifa por noche (EUR)"
        decimal cleaning_fee "Tasa de limpieza"
        decimal service_fee_rate "Porcentaje servicio (11.45%)"
        decimal rating "Nota media (1.00 - 5.00)"
        int review_count "Total de valoraciones"
        boolean is_superhost "Superhost badge"
        int max_guests "Capacidad máxima"
        int bedrooms "Número de dormitorios"
        int beds "Número de camas"
        int baths "Número de baños"
        jsonb images "Array de fotos"
        jsonb amenities "Array de comodidades"
        jsonb sleeping_details "Desglose de habitaciones"
        int cancellation_days "Días cancelación gratuita"
        boolean instant_booking "Reserva instantánea"
        datetime created_at
        datetime updated_at
    }

    RESERVATIONS {
        string id PK "cuid / varchar"
        string property_id FK "Referencia a PROPERTIES"
        string guest_id FK "Referencia a USERS"
        date check_in "Fecha de entrada"
        date check_out "Fecha de salida"
        int nights "Noches de estancia"
        int guests_count "Número de huéspedes"
        decimal base_price "Precio base total"
        decimal cleaning_fee "Tasa de limpieza aplicada"
        decimal service_fee "Comisión de servicio calculada"
        decimal total_price "Importe total reserva"
        enum status "PENDING | CONFIRMED | CANCELLED | COMPLETED"
        string confirmation_code UK "Código único de voucher"
        datetime created_at
        datetime updated_at
    }

    REVIEWS {
        string id PK "cuid / varchar"
        string property_id FK "Referencia a PROPERTIES"
        string author_id FK "Referencia a USERS"
        int rating "Puntuación (1-5)"
        text comment "Comentario del huésped"
        datetime created_at
    }
```

---

## 🛡️ Reglas de Concurrencia e Índices

1. **Prevención de Doble Reserva (Double Booking):**
   - Índice compuesto en `reservations(property_id, check_in, check_out)`.
   - Consulta transaccional que valida no solapamiento:
   ```sql
   SELECT COUNT(*) FROM reservations 
   WHERE property_id = $1 
     AND status = 'CONFIRMED'
     AND NOT (check_out <= $checkIn OR check_in >= $checkOut);
   ```

2. **Búsquedas de Alto Rendimiento:**
   - Índice en `properties(category)` para filtros de carrusel.
   - Índice en `properties(location)` para barra de búsqueda de destino.
