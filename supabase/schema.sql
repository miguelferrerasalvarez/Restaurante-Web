-- ═══════════════════════════════════════════════════════════════════════════
-- ESQUEMA DE BASE DE DATOS — Casa Bellver (Sistema de Reservas)
-- Ejecuta este archivo en Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

CREATE TYPE restaurant_zone AS ENUM ('interior', 'terraza');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'reminder_sent');

CREATE TABLE bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name   TEXT NOT NULL,
  customer_email  TEXT,
  customer_phone  TEXT,
  booking_date    DATE NOT NULL,
  booking_time    TIME NOT NULL,
  party_size      INT  NOT NULL CHECK (party_size BETWEEN 1 AND 20),
  zone            restaurant_zone NOT NULL,
  status          booking_status NOT NULL DEFAULT 'confirmed',
  cancel_token    UUID NOT NULL DEFAULT uuid_generate_v4(),
  reminder_sent   BOOLEAN NOT NULL DEFAULT FALSE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_date       ON bookings (booking_date);
CREATE INDEX idx_bookings_date_time  ON bookings (booking_date, booking_time, zone);
CREATE INDEX idx_bookings_status     ON bookings (status);
CREATE INDEX idx_bookings_cancel_tok ON bookings (cancel_token);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE VIEW slot_occupancy AS
SELECT booking_date, booking_time, zone, SUM(party_size) AS occupied_seats
FROM bookings
WHERE status = 'confirmed'
GROUP BY booking_date, booking_time, zone;

-- Función principal de reserva con bloqueo anti-race-condition
CREATE OR REPLACE FUNCTION create_booking(
  p_name        TEXT,
  p_email       TEXT,
  p_phone       TEXT,
  p_date        DATE,
  p_time        TIME,
  p_party_size  INT,
  p_zone        restaurant_zone,
  p_notes       TEXT DEFAULT NULL
)
RETURNS TABLE (
  success       BOOLEAN,
  booking_id    UUID,
  cancel_token  UUID,
  error_msg     TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
  v_max_capacity  INT;
  v_occupied      INT;
  v_available     INT;
  v_booking_id    UUID;
  v_cancel_token  UUID;
  v_adj_before    TIME;
  v_adj_after     TIME;
BEGIN
  v_adj_before := p_time - INTERVAL '1 hour';
  v_adj_after  := p_time + INTERVAL '1 hour';

  v_max_capacity := CASE p_zone
    WHEN 'interior' THEN 40
    WHEN 'terraza'  THEN 40
  END;

  -- Bloqueo de fila: suma aforo de franja + franjas contiguas (±1h)
  SELECT COALESCE(SUM(party_size), 0)
  INTO v_occupied
  FROM bookings
  WHERE booking_date = p_date
    AND zone         = p_zone
    AND status       = 'confirmed'
    AND (
      booking_time = p_time
      OR booking_time = v_adj_before
      OR booking_time = v_adj_after
    )
  FOR UPDATE;

  v_available := v_max_capacity - v_occupied;

  IF v_available < p_party_size THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID,
      FORMAT('Solo quedan %s plazas disponibles en esa franja.', v_available);
    RETURN;
  END IF;

  INSERT INTO bookings (
    customer_name, customer_email, customer_phone,
    booking_date, booking_time, party_size, zone, notes
  ) VALUES (
    p_name, p_email, p_phone,
    p_date, p_time, p_party_size, p_zone, p_notes
  )
  RETURNING bookings.id, bookings.cancel_token
  INTO v_booking_id, v_cancel_token;

  RETURN QUERY SELECT TRUE, v_booking_id, v_cancel_token, NULL::TEXT;
END;
$$;

-- Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON bookings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users full access" ON bookings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

GRANT EXECUTE ON FUNCTION create_booking TO anon;
