import type { Database } from "@/lib/supabase"

export const STATUS_OPTIONS: Array<
  Database["public"]["Tables"]["cosmetics"]["Row"]["status"]
> = ["active", "warning", "expired", "discarded", "archived"]
