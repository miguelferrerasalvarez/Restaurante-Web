export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          booking_date: string;
          booking_time: string;
          party_size: number;
          zone: "interior" | "terraza";
          status: "confirmed" | "cancelled" | "reminder_sent";
          cancel_token: string;
          reminder_sent: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          booking_date: string;
          booking_time: string;
          party_size: number;
          zone: "interior" | "terraza";
          status?: "confirmed" | "cancelled" | "reminder_sent";
          cancel_token?: string;
          reminder_sent?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          booking_date?: string;
          booking_time?: string;
          party_size?: number;
          zone?: "interior" | "terraza";
          status?: "confirmed" | "cancelled" | "reminder_sent";
          cancel_token?: string;
          reminder_sent?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      slot_occupancy: {
        Row: {
          booking_date: string;
          booking_time: string;
          zone: "interior" | "terraza";
          occupied_seats: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_booking: {
        Args: {
          p_name: string;
          p_email: string | null;
          p_phone: string | null;
          p_date: string;
          p_time: string;
          p_party_size: number;
          p_zone: "interior" | "terraza";
          p_notes?: string | null;
        };
        Returns: {
          success: boolean;
          booking_id: string;
          cancel_token: string;
          error_msg: string | null;
        }[];
      };
    };
    Enums: {
      restaurant_zone: "interior" | "terraza";
      booking_status: "confirmed" | "cancelled" | "reminder_sent";
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type SlotOccupancy = Database["public"]["Views"]["slot_occupancy"]["Row"];
