import type { Cosmetic } from "@/hooks/use-cosmetics"

export const STATUS_FILTERS: { value: Cosmetic["status"] | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang dùng" },
  { value: "warning", label: "Sắp hết hạn" },
  { value: "expired", label: "Hết hạn" },
  { value: "discarded", label: "Đã bỏ" },
]
