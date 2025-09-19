import { Button } from "@/components/ui/button"

type CosmeticHeaderProps = {
  isEditMode: boolean
  onCancel: () => void
}

export function CosmeticHeader({ isEditMode, onCancel }: CosmeticHeaderProps) {
  return (
    <div className="border-b bg-white shadow-sm">
      <div className="px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Chỉnh sửa mỹ phẩm" : "Thêm mỹ phẩm"}
          </h1>
          <p className="text-sm text-gray-500">
            Nhập thông tin sản phẩm cá nhân để theo dõi hạn dùng và gợi ý nhắc nhở.
          </p>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </div>
  )
}
