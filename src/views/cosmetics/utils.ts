import type { Cosmetic } from "@/hooks/use-cosmetics"
import type { Database } from "@/lib/supabase"

export type CosmeticInsertPayload = Database["public"]["Tables"]["cosmetics"]["Insert"]
export type CosmeticUpdatePayload = Database["public"]["Tables"]["cosmetics"]["Update"]

type UpdateMutation = (args: { id: string; updates: Partial<CosmeticUpdatePayload> }) => Promise<unknown>
type DeleteMutation = (id: string) => Promise<unknown>

export type CosmeticWithMutators = Cosmetic & {
  update: (partial: Partial<CosmeticUpdatePayload>) => Promise<void>
  remove: () => Promise<void>
}

export function attachMutators(
  cosmetics: Cosmetic[],
  update: UpdateMutation,
  remove: DeleteMutation,
): CosmeticWithMutators[] {
  return cosmetics.map((item) => ({
    ...item,
    async update(partial) {
      await update({ id: item.id, updates: partial })
    },
    async remove() {
      await remove(item.id)
    },
  }))
}

export function buildDuplicateSnapshot(
  cosmetic: CosmeticWithMutators,
): Omit<CosmeticInsertPayload, "user_id"> {
  return {
    name: cosmetic.name,
    brand: cosmetic.brand ?? null,
    category_id: cosmetic.category_id ?? null,
    size: cosmetic.size ?? null,
    unit: cosmetic.unit ?? null,
    batch_code: cosmetic.batch_code ?? null,
    purchase_date: cosmetic.purchase_date ?? null,
    opened_at: null,
    expiry_date: cosmetic.expiry_date ?? null,
    pao_months: cosmetic.pao_months ?? null,
    notes: cosmetic.notes ?? null,
    image_url: cosmetic.image_url ?? null,
    status: "active",
    dispose_at: cosmetic.dispose_at ?? null,
  }
}
