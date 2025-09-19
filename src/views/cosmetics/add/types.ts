import type { Database } from "@/lib/supabase"

export type CosmeticInsert = Database["public"]["Tables"]["cosmetics"]["Insert"]

export type CosmeticFormValues = {
  name: string
  brand: string
  category_id: string
  size: string
  unit: string
  batch_code: string
  purchase_date: string
  opened_at: string
  expiry_date: string
  pao_months: string
  notes: string
  image_url: string
  status: CosmeticInsert["status"]
  reminder_enabled: boolean
  reminder_lead_days: number
}
