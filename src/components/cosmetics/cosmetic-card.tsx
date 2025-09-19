import { Badge } from "@/components/ui/badge"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCosmeticDate, type Cosmetic } from "@/hooks/use-cosmetics"
import { cn } from "@/lib/utils"
import { CalendarClock, CalendarDays, Copy, Edit, RefreshCw, Trash2 } from "lucide-react"
import type { ReactNode } from "react"

const STATUS_LABELS: Record<Cosmetic["status"], { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Đang dùng", variant: "default" },
  warning: { label: "Sắp hết hạn", variant: "secondary" },
  expired: { label: "Hết hạn", variant: "destructive" },
  discarded: { label: "Đã bỏ", variant: "outline" },
  archived: { label: "Lưu trữ", variant: "outline" },
}

type CosmeticCardAction = {
  label: string
  icon: ReactNode
  onClick: () => void
  variant?: ButtonProps["variant"]
  disabled?: boolean
}

type CosmeticCardProps = {
  cosmetic: Cosmetic
  actions?: CosmeticCardAction[]
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

function daysUntil(date: string | null | undefined) {
  if (!date) return null
  const now = new Date()
  const target = new Date(`${date}T00:00:00.000Z`)
  const diff = target.getTime() - now.setHours(0, 0, 0, 0)
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export function CosmeticCard({
  cosmetic,
  actions,
  onEdit,
  onDelete,
  onDuplicate,
}: Readonly<CosmeticCardProps>) {
  const statusMeta = STATUS_LABELS[cosmetic.status]
  const disposeIn = daysUntil(cosmetic.dispose_at ?? cosmetic.expiry_date)

  const nextReminder = cosmetic.reminders?.find((reminder) => reminder.status === "pending" || reminder.status === "snoozed")

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-500">{cosmetic.brand || "Không thương hiệu"}</p>
                <h3 className="font-semibold text-lg text-gray-900 truncate" title={cosmetic.name}>
                  {cosmetic.name}
                </h3>
              </div>
              <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-600">
              <div className="flex flex-wrap items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span>Mở nắp: {formatCosmeticDate(cosmetic.opened_at) ?? "Chưa mở"}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CalendarClock className={cn("w-4 h-4", disposeIn != null && disposeIn < 0 ? "text-red-500" : "text-gray-400")} />
                <span>
                  Bỏ trước: {formatCosmeticDate(cosmetic.dispose_at ?? cosmetic.expiry_date) ?? "Không xác định"}
                  {disposeIn != null && (
                    <>
                      {" "}
                      <Badge variant={disposeIn < 0 ? "destructive" : disposeIn <= 14 ? "secondary" : "outline"}>
                        {disposeIn < 0 ? `${Math.abs(disposeIn)} ngày trễ` : `Còn ${disposeIn} ngày`}
                      </Badge>
                    </>
                  )}
                </span>
              </div>

              {cosmetic.notes ? (
                <p className="text-sm text-gray-500 line-clamp-3">{cosmetic.notes}</p>
              ) : null}
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>Danh mục:</span>
          <Badge variant="outline">{cosmetic.category?.display_name ?? "Chưa phân loại"}</Badge>
          {cosmetic.pao_months ? <Badge variant="outline">PAO: {cosmetic.pao_months} tháng</Badge> : null}
          {cosmetic.unit && cosmetic.size != null ? (
            <Badge variant="outline">
              {cosmetic.size} {cosmetic.unit}
            </Badge>
          ) : null}
        </div>

        {nextReminder ? (
          <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700 flex items-center justify-between">
            <span>
              Nhắc nhở vào {formatCosmeticDate(nextReminder.remind_at)} ({nextReminder.status === "snoozed" ? "Đã hoãn" : "Đang chờ"})
            </span>
            <RefreshCw className="w-3 h-3" />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {onEdit ? (
            <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Sửa
            </Button>
          ) : null}
          {onDuplicate ? (
            <Button variant="outline" size="sm" onClick={onDuplicate} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Nhân bản
            </Button>
          ) : null}
          {actions?.map(({ label, icon, onClick, variant, disabled }) => (
            <Button
              key={label}
              variant={variant ?? "secondary"}
              size="sm"
              onClick={onClick}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              {icon}
              {label}
            </Button>
          ))}
          {onDelete ? (
            <Button variant="destructive" size="sm" onClick={onDelete} className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Xóa
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
