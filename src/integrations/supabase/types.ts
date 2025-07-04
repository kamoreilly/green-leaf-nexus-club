export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cash_ups: {
        Row: {
          card_sales: number
          cash_difference: number | null
          cashier_id: string
          closing_cash: number
          created_at: string
          date: string
          digital_sales: number
          expected_cash: number
          id: string
          notes: string | null
          opening_cash: number
          status: string | null
          store_id: string
          total_sales: number
        }
        Insert: {
          card_sales?: number
          cash_difference?: number | null
          cashier_id: string
          closing_cash: number
          created_at?: string
          date: string
          digital_sales?: number
          expected_cash: number
          id?: string
          notes?: string | null
          opening_cash?: number
          status?: string | null
          store_id: string
          total_sales?: number
        }
        Update: {
          card_sales?: number
          cash_difference?: number | null
          cashier_id?: string
          closing_cash?: number
          created_at?: string
          date?: string
          digital_sales?: number
          expected_cash?: number
          id?: string
          notes?: string | null
          opening_cash?: number
          status?: string | null
          store_id?: string
          total_sales?: number
        }
        Relationships: [
          {
            foreignKeyName: "cash_ups_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_ups_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          last_updated_by: string | null
          product_id: string
          quantity: number
          reorder_level: number | null
          reserved_quantity: number
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated_by?: string | null
          product_id: string
          quantity?: number
          reorder_level?: number | null
          reserved_quantity?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_updated_by?: string | null
          product_id?: string
          quantity?: number
          reorder_level?: number | null
          reserved_quantity?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          cbd_percentage: number | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number | null
          sku: string | null
          thc_percentage: number | null
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          cbd_percentage?: number | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price?: number | null
          sku?: string | null
          thc_percentage?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          cbd_percentage?: number | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number | null
          sku?: string | null
          thc_percentage?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          discount_amount: number
          id: string
          product_id: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          discount_amount?: number
          id?: string
          product_id: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          discount_amount?: number
          id?: string
          product_id?: string
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cashier_id: string | null
          created_at: string
          customer_id: string | null
          discount_amount: number
          id: string
          notes: string | null
          payment_method: string | null
          status: string | null
          store_id: string
          tax_amount: number
          total_amount: number
        }
        Insert: {
          cashier_id?: string | null
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          store_id: string
          tax_amount?: number
          total_amount: number
        }
        Update: {
          cashier_id?: string | null
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          store_id?: string
          tax_amount?: number
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_warehouse: boolean | null
          manager_id: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_warehouse?: boolean | null
          manager_id?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_warehouse?: boolean | null
          manager_id?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_items: {
        Row: {
          id: string
          notes: string | null
          product_id: string
          quantity_received: number | null
          quantity_sent: number
          transfer_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          product_id: string
          quantity_received?: number | null
          quantity_sent: number
          transfer_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          product_id?: string
          quantity_received?: number | null
          quantity_sent?: number
          transfer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_items_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          from_store_id: string
          id: string
          initiated_at: string
          initiated_by: string
          notes: string | null
          received_at: string | null
          received_by: string | null
          status: string | null
          to_store_id: string
        }
        Insert: {
          from_store_id: string
          id?: string
          initiated_at?: string
          initiated_by: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          status?: string | null
          to_store_id: string
        }
        Update: {
          from_store_id?: string
          id?: string
          initiated_at?: string
          initiated_by?: string
          notes?: string | null
          received_at?: string | null
          received_by?: string | null
          status?: string | null
          to_store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfers_from_store_id_fkey"
            columns: ["from_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_store_id_fkey"
            columns: ["to_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
