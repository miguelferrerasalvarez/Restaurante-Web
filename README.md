# Sistema de Reservas — Casa Bellver

Aplicación web completa de reservas para restaurante construida con **Next.js 14 (App Router)**, **Supabase** y **Resend**.

---

## Arquitectura

```
src/
├── app/
│   ├── page.tsx                   # Web pública (hero, reservas, carta, historia...)
│   ├── cancelar/[token]/          # Página de cancelación por enlace
│   ├── admin/
│   │   ├── login/                 # Login del panel interno
│   │   └── dashboard/             # Panel de reservas (día/semana)
│   └── api/
│       ├── bookings/              # POST — crear reserva pública
│       ├── availability/          # GET  — franjas disponibles en tiempo real
│       ├── cancel/[token]/        # GET/POST — ver y ejecutar cancelación
│       ├── cron/reminders/        # GET  — enviar recordatorios (cron)
│       └── admin/bookings/        # CRUD protegido para el panel interno
├── components/
│   ├── ui/                        # Button, Input, Select, Toast
│   ├── booking/                   # BookingForm, RestaurantMap, TimeSlotPicker
│   ├── public/                    # Hero, Menu, About, Reviews, Location, Footer
│   └── admin/                     # AdminDashboardClient, BookingModal
├── lib/
│   ├── config.ts                  # ← CONFIGURACIÓN CENTRAL DEL RESTAURANTE
│   ├── availability.ts            # Lógica de disponibilidad por franjas
│   ├── email.ts                   # Envío de emails con Resend
│   ├── validations.ts             # Esquemas Zod
│   └── supabase/                  # Clientes server/browser
└── types/database.ts              # Tipos TypeScript del esquema
```

---

## Esquema de base de datos

### Tabla `bookings`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Clave primaria |
| `customer_name` | TEXT | Nombre del cliente |
| `customer_email` | TEXT? | Email (opcional) |
| `customer_phone` | TEXT? | Teléfono (opcional) |
| `booking_date` | DATE | Fecha de la reserva |
| `booking_time` | TIME | Hora: `13:00`, `14:00`, `15:00`, `19:00`, `20:00`, `21:00` |
| `party_size` | INT | Número de personas (1–20) |
| `zone` | ENUM | `interior` o `terraza` |
| `status` | ENUM | `confirmed`, `cancelled`, `reminder_sent` |
| `cancel_token` | UUID | Token único para cancelar desde el email |
| `reminder_sent` | BOOLEAN | Si ya se envió el recordatorio de 2h |
| `notes` | TEXT? | Notas internas del personal |

### Vista `slot_occupancy`

Agrega asientos confirmados por fecha/hora/zona. Permite calcular disponibilidad sin exponer datos personales.

### Función `create_booking()`

Función PL/pgSQL con `SELECT FOR UPDATE` que evita race conditions al reservar simultáneamente.

---

## Instalación paso a paso

### 1. Cuentas necesarias

| Servicio | Gratuito | Para qué |
|---|---|---|
| [Supabase](https://supabase.com) | ✅ tier free | Base de datos + Auth |
| [Resend](https://resend.com) | ✅ 3000 emails/mes | Emails transaccionales |
| [Vercel](https://vercel.com) | ✅ hobby plan | Deploy + Cron jobs |

### 2. Clonar e instalar

```bash
git clone <repo>
cd <repo>
npm install
```

### 3. Variables de entorno

```bash
cp .env.example .env.local
# Edita .env.local con tus valores
```

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Dominio verificado en Resend |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` en local |
| `CRON_SECRET` | `openssl rand -hex 32` |

### 4. Crear el esquema en Supabase

1. Supabase Dashboard → **SQL Editor**
2. Pega el contenido de `supabase/schema.sql`
3. Ejecuta

### 5. Crear usuario del panel interno

1. Supabase → **Authentication → Users → Add user**
2. Email y contraseña del restaurante
3. Ú salos en `/admin/login`

### 6. Verificar dominio en Resend

1. Resend → **Domains → Add Domain**
2. Añade los registros DNS indicados
3. Pon el email verificado en `RESEND_FROM_EMAIL`

### 7. Arrancar en local

```bash
npm run dev
```

- Web pública: **http://localhost:3000**
- Panel interno: **http://localhost:3000/admin/login**

---

## Personalización del restaurante

**Edita un único fichero: `src/lib/config.ts`**

Puedes cambiar sin tocar más código:
- Nombre, tagline y descripción
- Dirección y embed de Google Maps
- Horarios de apertura visibles
- Teléfono, email y redes sociales

Los platos de la carta están en `src/components/public/Menu.tsx`.

---

## Deploy en Vercel

```bash
npm i -g vercel
vercel
```

Añade todas las variables de `.env.example` en Vercel → **Settings → Environment Variables**.

El cron de recordatorios se activa solo cada 15 minutos gracias a `vercel.json`.

---

## Lógica de disponibilidad

**Regla de franjas contiguas:** una mesa reservada a las 13:00 NO puede reservarse a las 14:00, pero SÍ a las 15:00 (diferencia mínima de 2h para reutilizar aforo).

Implementada en la función `create_booking()` de PostgreSQL con `SELECT FOR UPDATE` para garantizar atomicidad y evitar race conditions.

**Aforo:** 40 personas por zona (interior/terraza) por franja horaria efectiva.

---

## Recordatorios automáticos

El endpoint `/api/cron/reminders` se llama cada 15 minutos (Vercel Cron en producción):

1. Calcula ventana: `ahora+2h` a `ahora+2h15min`
2. Busca reservas confirmadas en esa ventana sin recordatorio enviado
3. Envía email de recordatorio con enlace de cancelación
4. Marca `reminder_sent = true`

Test manual en local:
```bash
curl -H "Authorization: Bearer TU_CRON_SECRET" http://localhost:3000/api/cron/reminders
```
