import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useCategories } from "@/hooks/use-categories"
import { useCosmeticReminders } from "@/hooks/use-cosmetic-reminders"
import {
  calculateCosmeticDisposeDate,
  deriveCosmeticStatus,
  useCosmetics,
} from "@/hooks/use-cosmetics"
import { useUnits } from "@/hooks/use-units"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"

import {
  CosmeticDetailsCard,
  CosmeticHeader,
  LifecycleSummaryCard,
  ReminderSettingsCard,
} from "./components"
import type { CosmeticFormValues, CosmeticInsert } from "./types"
import { computeReminderTimestamp, parseNumber } from "./utils"

export default function CosmeticEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const { items, isLoading, isError, error, addItem, updateItem, refetch } =
    useCosmetics()
  const { categories } = useCategories()
  const { units } = useUnits()
  const { createReminder, updateReminder, deleteReminder } =
    useCosmeticReminders()

  const [initializing, setInitializing] = useState(true)

  const form = useForm<CosmeticFormValues>({
    defaultValues: {
      name: "",
      brand: "",
      category_id: "",
      size: "",
      unit: "",
      batch_code: "",
      purchase_date: "",
      opened_at: "",
      expiry_date: "",
      pao_months: "",
      notes: "",
      image_url: "",
      status: "active",
      reminder_enabled: true,
      reminder_lead_days: 14,
    },
  })

  const watchValues = form.watch()

  const computedDisposeAt = useMemo(
    () =>
      calculateCosmeticDisposeDate(
        watchValues.opened_at || null,
        parseNumber(watchValues.pao_months),
        watchValues.expiry_date || null,
      ),
    [watchValues.opened_at, watchValues.pao_months, watchValues.expiry_date],
  )

  const computedStatus = useMemo(
    () =>
      deriveCosmeticStatus(
        computedDisposeAt,
        watchValues.expiry_date || null,
        watchValues.status,
      ),
    [computedDisposeAt, watchValues.expiry_date, watchValues.status],
  )

  const currentCosmetic = useMemo(
    () => (isEditMode ? items.find((item) => item.id === id) ?? null : null),
    [id, isEditMode, items],
  )

  useEffect(() => {
    if (isEditMode) {
      if (currentCosmetic) {
        form.reset({
          name: currentCosmetic.name,
          brand: currentCosmetic.brand ?? "",
          category_id: currentCosmetic.category_id ?? "",
          size: currentCosmetic.size?.toString() ?? "",
          unit: currentCosmetic.unit ?? "",
          batch_code: currentCosmetic.batch_code ?? "",
          purchase_date: currentCosmetic.purchase_date ?? "",
          opened_at: currentCosmetic.opened_at ?? "",
          expiry_date: currentCosmetic.expiry_date ?? "",
          pao_months: currentCosmetic.pao_months?.toString() ?? "",
          notes: currentCosmetic.notes ?? "",
          image_url: currentCosmetic.image_url ?? "",
          status: currentCosmetic.status,
          reminder_enabled: Boolean(
            currentCosmetic.reminders?.some(
              (reminder) =>
                reminder.status === "pending" || reminder.status === "snoozed",
            ),
          ),
          reminder_lead_days: 14,
        })
        setInitializing(false)
      } else {
        refetch().finally(() => setInitializing(false))
      }
    } else {
      const raw = window.sessionStorage.getItem("cosmetic:duplicate")
      if (raw) {
        try {
          const duplicate = JSON.parse(raw) as CosmeticInsert
          form.reset({
            name: duplicate.name,
            brand: duplicate.brand ?? "",
            category_id: duplicate.category_id ?? "",
            size: duplicate.size?.toString() ?? "",
            unit: duplicate.unit ?? "",
            batch_code: duplicate.batch_code ?? "",
            purchase_date: duplicate.purchase_date ?? "",
            opened_at: "",
            expiry_date: duplicate.expiry_date ?? "",
            pao_months: duplicate.pao_months?.toString() ?? "",
            notes: duplicate.notes ?? "",
            image_url: duplicate.image_url ?? "",
            status: "active",
            reminder_enabled: true,
            reminder_lead_days: 14,
          })
        } catch (dupError) {
          console.error("Failed to parse duplicate payload", dupError)
        } finally {
          window.sessionStorage.removeItem("cosmetic:duplicate")
        }
      }
      setInitializing(false)
    }
  }, [currentCosmetic, form, isEditMode, refetch])

  const onSubmit = async (values: CosmeticFormValues) => {
    const payload: Omit<CosmeticInsert, "user_id"> = {
      name: values.name.trim(),
      brand: values.brand.trim() || null,
      category_id: values.category_id || null,
      size: parseNumber(values.size),
      unit: values.unit || null,
      batch_code: values.batch_code.trim() || null,
      purchase_date: values.purchase_date || null,
      opened_at: values.opened_at || null,
      expiry_date: values.expiry_date || null,
      pao_months: parseNumber(values.pao_months),
      notes: values.notes.trim() || null,
      image_url: values.image_url.trim() || null,
      status: values.status,
      dispose_at: computedDisposeAt,
    }

    try {
      if (isEditMode && id) {
        await updateItem({ id, updates: payload })

        const existingReminder = currentCosmetic?.reminders?.find(
          (reminder) =>
            reminder.status === "pending" || reminder.status === "snoozed",
        )

        if (values.reminder_enabled) {
          const reminderAt = computeReminderTimestamp(
            computedDisposeAt,
            values.reminder_lead_days,
          )
          if (reminderAt) {
            if (existingReminder) {
              await updateReminder({
                id: existingReminder.id,
                updates: {
                  remind_at: reminderAt,
                  status: "pending",
                  snoozed_until: null,
                },
              })
            } else {
              await createReminder({
                cosmetic_id: id,
                remind_at: reminderAt,
                status: "pending",
                metadata: {
                  note: "Scheduled on edit",
                },
              })
            }
          }
        } else if (existingReminder) {
          await deleteReminder(existingReminder.id)
        }
      } else {
        const created = await addItem(payload)
        if (values.reminder_enabled) {
          const reminderAt = computeReminderTimestamp(
            computedDisposeAt,
            values.reminder_lead_days,
          )
          if (reminderAt && created?.id) {
            await createReminder({
              cosmetic_id: created.id,
              remind_at: reminderAt,
              status: "pending",
              metadata: {
                note: "Auto-scheduled from intake",
              },
            })
          }
        }
      }

      navigate("/inventory/cosmetics")
    } catch (submitError) {
      console.error("Failed to save cosmetic", submitError)
      alert("Không thể lưu mỹ phẩm. Vui lòng thử lại.")
    }
  }

  if (isLoading || initializing) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Đang tải dữ liệu mỹ phẩm...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Không thể tải dữ liệu mỹ phẩm: {error?.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const reminderEnabled = form.watch("reminder_enabled")

  return (
    <div className="min-h-screen bg-gray-50">
      <CosmeticHeader
        isEditMode={isEditMode}
        onCancel={() => navigate("/inventory/cosmetics")}
      />

      <div className="px-4 py-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 lg:grid-cols-[2fr_1fr]"
          >
            <div className="space-y-6">
              <CosmeticDetailsCard
                form={form}
                categories={categories}
                units={units}
              />
            </div>

            <div className="space-y-6">
              <LifecycleSummaryCard disposeAt={computedDisposeAt} status={computedStatus} />
              <ReminderSettingsCard form={form} reminderEnabled={reminderEnabled} />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </Button>
                <Button type="submit" className="flex-1">
                  {isEditMode ? "Lưu thay đổi" : "Thêm mỹ phẩm"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
