import { Card, CardContent } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { CosmeticFormValues } from "../types"
import type { UseFormReturn } from "react-hook-form"

type ReminderSettingsCardProps = {
  form: UseFormReturn<CosmeticFormValues>
  reminderEnabled: boolean
}

export function ReminderSettingsCard({ form, reminderEnabled }: ReminderSettingsCardProps) {
  const { control } = form

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Nhắc nhở bỏ / thay mới</h2>
            <p className="text-xs text-gray-500">Tự động tạo nhắc nhở trước ngày bỏ dự kiến.</p>
          </div>
          <FormField
            control={control}
            name="reminder_enabled"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {reminderEnabled ? (
          <FormField
            control={control}
            name="reminder_lead_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhắc trước (ngày)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={60}
                    value={field.value}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
