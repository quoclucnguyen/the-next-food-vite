import { Card, CardContent } from "@/components/ui/card"
import { formatCosmeticDate } from "@/hooks/use-cosmetics"
import { cn } from "@/lib/utils"

type LifecycleSummaryCardProps = {
  disposeAt: string | null
  status: "active" | "warning" | "expired" | "discarded" | "archived"
}

const STATUS_LABEL: Record<LifecycleSummaryCardProps["status"], string> = {
  active: "Đang dùng",
  warning: "Sắp hết hạn",
  expired: "Đã hết hạn",
  discarded: "Đã bỏ",
  archived: "Lưu trữ",
}

export function LifecycleSummaryCard({ disposeAt, status }: LifecycleSummaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Tổng quan vòng đời
        </h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 space-y-2">
          <div className="flex items-center justify-between">
            <span>Ngày bỏ dự kiến</span>
            <span className="font-medium text-gray-900">
              {formatCosmeticDate(disposeAt) ?? "Chưa xác định"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Trạng thái hệ thống</span>
            <span
              className={cn(
                "font-medium",
                status === "expired"
                  ? "text-red-600"
                  : status === "warning"
                  ? "text-orange-600"
                  : "text-emerald-600",
              )}
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
