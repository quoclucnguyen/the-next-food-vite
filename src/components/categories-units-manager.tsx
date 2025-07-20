

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, Trash2, Edit2, Save, X, Tags, Loader2, Edit3 } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { useUnits } from "@/hooks/use-units"
import { useIsMobile } from "@/hooks/use-mobile"

interface EditingItem {
  id: string
  name: string
  display_name: string
}

export function CategoriesUnitsManager() {
  const { categories, isLoading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useCategories()
  const { units, isLoading: unitsLoading, addUnit, updateUnit, deleteUnit } = useUnits()
  const isMobile = useIsMobile()

  const [newCategory, setNewCategory] = useState({ name: "", display_name: "" })
  const [newUnit, setNewUnit] = useState({ name: "", display_name: "" })
  const [editingCategory, setEditingCategory] = useState<EditingItem | null>(null)
  const [editingUnit, setEditingUnit] = useState<EditingItem | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingUnit, setIsAddingUnit] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper functions for click-to-edit functionality
  const handleCategoryClick = (category: { id: string; name: string; display_name: string }) => {
    if (editingCategory?.id !== category.id) {
      setEditingCategory({
        id: category.id,
        name: category.name,
        display_name: category.display_name,
      })
    }
  }

  const handleUnitClick = (unit: { id: string; name: string; display_name: string }) => {
    if (editingUnit?.id !== unit.id) {
      setEditingUnit({
        id: unit.id,
        name: unit.name,
        display_name: unit.display_name,
      })
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.display_name.trim()) {
      setError("Cả tên và tên hiển thị đều là bắt buộc")
      return
    }

    try {
      setError(null)
      await addCategory({
        name: newCategory.name.toLowerCase().trim(),
        display_name: newCategory.display_name.trim(),
      })
      setNewCategory({ name: "", display_name: "" })
      setIsAddingCategory(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể thêm danh mục")
    }
  }

  const handleAddUnit = async () => {
    if (!newUnit.name.trim() || !newUnit.display_name.trim()) {
      setError("Cả tên và tên hiển thị đều là bắt buộc")
      return
    }

    try {
      setError(null)
      await addUnit({
        name: newUnit.name.toLowerCase().trim(),
        display_name: newUnit.display_name.trim(),
      })
      setNewUnit({ name: "", display_name: "" })
      setIsAddingUnit(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể thêm đơn vị")
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim() || !editingCategory.display_name.trim()) {
      setError("Cả tên và tên hiển thị đều là bắt buộc")
      return
    }

    try {
      setError(null)
      await updateCategory({
        id: editingCategory.id,
        updates: {
          name: editingCategory.name.toLowerCase().trim(),
          display_name: editingCategory.display_name.trim(),
        },
      })
      setEditingCategory(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật danh mục")
    }
  }

  const handleUpdateUnit = async () => {
    if (!editingUnit || !editingUnit.name.trim() || !editingUnit.display_name.trim()) {
      setError("Cả tên và tên hiển thị đều là bắt buộc")
      return
    }

    try {
      setError(null)
      await updateUnit({
        id: editingUnit.id,
        updates: {
          name: editingUnit.name.toLowerCase().trim(),
          display_name: editingUnit.display_name.trim(),
        },
      })
      setEditingUnit(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật đơn vị")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        setError(null)
        await deleteCategory(id)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Không thể xóa danh mục")
      }
    }
  }

  const handleDeleteUnit = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn vị này?")) {
      try {
        setError(null)
        await deleteUnit(id)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Không thể xóa đơn vị")
      }
    }
  }

  if (categoriesLoading || unitsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="w-5 h-5" />
            Danh mục & Đơn vị
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className={isMobile ? "mx-0" : ""}>
        <CardHeader className={isMobile ? "px-4 py-4" : ""}>
          <CardTitle className="flex items-center gap-2">
            <Tags className="w-5 h-5" />
            Danh mục & Đơn vị
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "px-4 pb-4 space-y-6" : "space-y-6"}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Danh mục</h3>
            <Button
              size={isMobile ? "default" : "sm"}
              onClick={() => setIsAddingCategory(true)}
              disabled={isAddingCategory}
              className={isMobile ? "h-10 px-4" : ""}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </Button>
          </div>

          {isAddingCategory && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className={isMobile ? "space-y-3" : "grid grid-cols-2 gap-3"}>
                <div>
                  <Label htmlFor="new-category-name" className="text-sm font-medium">Tên nội bộ</Label>
                  <Input
                    id="new-category-name"
                    placeholder="ví dụ: trai-cay"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="new-category-display" className="text-sm font-medium">Tên hiển thị</Label>
                  <Input
                    id="new-category-display"
                    placeholder="ví dụ: Trái cây"
                    value={newCategory.display_name}
                    onChange={(e) => setNewCategory({ ...newCategory, display_name: e.target.value })}
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </div>
              </div>
              <div className={isMobile ? "flex flex-col gap-2" : "flex gap-2"}>
                <Button
                  size={isMobile ? "default" : "sm"}
                  onClick={handleAddCategory}
                  className={isMobile ? "h-12" : ""}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu
                </Button>
                <Button
                  size={isMobile ? "default" : "sm"}
                  variant="outline"
                  onClick={() => {
                    setIsAddingCategory(false)
                    setNewCategory({ name: "", display_name: "" })
                  }}
                  className={isMobile ? "h-12" : ""}
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </div>
          )}

          {isMobile ? (
            // Mobile: Vertical list layout
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id}>
                  {editingCategory?.id === category.id ? (
                    <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Internal Name</Label>
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="h-12 text-base"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Display Name</Label>
                        <Input
                          value={editingCategory.display_name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, display_name: e.target.value })}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button onClick={handleUpdateCategory} className="h-12">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingCategory(null)} className="h-12">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer group relative"
                         onClick={() => handleCategoryClick(category)}
                         role="button"
                         tabIndex={0}
                         aria-label={`Edit category ${category.display_name}. Click to edit or use the edit button.`}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' || e.key === ' ') {
                             e.preventDefault()
                             handleCategoryClick(category)
                           }
                         }}
                    >
                      <div className="flex-1 pointer-events-none">
                        <div className="font-medium flex items-center gap-2">
                          {category.display_name}
                          <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          {category.name}
                          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">• Tap to edit</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pointer-events-auto">
                        <Button
                          size="default"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingCategory({
                              id: category.id,
                              name: category.name,
                              display_name: category.display_name,
                            })
                          }}
                          className="h-10 w-10 p-0"
                          aria-label={`Edit category ${category.display_name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="default"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCategory(category.id)
                          }}
                          className="h-10 w-10 p-0 text-red-500 hover:text-red-600"
                          aria-label={`Delete category ${category.display_name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Desktop: Original flex-wrap layout
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-1">
                  {editingCategory?.id === category.id ? (
                    <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-20"
                      />
                      <Input
                        value={editingCategory.display_name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, display_name: e.target.value })}
                        className="w-24"
                      />
                      <Button size="sm" onClick={handleUpdateCategory}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingCategory(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative group">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors pr-8"
                            onClick={() => handleCategoryClick(category)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Edit category ${category.display_name}. Click to edit or use the edit button.`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleCategoryClick(category)
                              }
                            }}
                          >
                            {category.display_name}
                            <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to edit &quot;{category.display_name}&quot;</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingCategory({
                              id: category.id,
                              name: category.name,
                              display_name: category.display_name,
                            })
                          }}
                          aria-label={`Edit category ${category.display_name}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCategory(category.id)
                          }}
                          aria-label={`Delete category ${category.display_name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Units Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Units</h3>
            <Button
              size={isMobile ? "default" : "sm"}
              onClick={() => setIsAddingUnit(true)}
              disabled={isAddingUnit}
              className={isMobile ? "h-10 px-4" : ""}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Unit
            </Button>
          </div>

          {isAddingUnit && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50 space-y-4">
              <div className={isMobile ? "space-y-3" : "grid grid-cols-2 gap-3"}>
                <div>
                  <Label htmlFor="new-unit-name" className="text-sm font-medium">Internal Name</Label>
                  <Input
                    id="new-unit-name"
                    placeholder="e.g., kg"
                    value={newUnit.name}
                    onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="new-unit-display" className="text-sm font-medium">Display Name</Label>
                  <Input
                    id="new-unit-display"
                    placeholder="e.g., Kg"
                    value={newUnit.display_name}
                    onChange={(e) => setNewUnit({ ...newUnit, display_name: e.target.value })}
                    className={isMobile ? "h-12 text-base" : ""}
                  />
                </div>
              </div>
              <div className={isMobile ? "flex flex-col gap-2" : "flex gap-2"}>
                <Button
                  size={isMobile ? "default" : "sm"}
                  onClick={handleAddUnit}
                  className={isMobile ? "h-12" : ""}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  size={isMobile ? "default" : "sm"}
                  variant="outline"
                  onClick={() => {
                    setIsAddingUnit(false)
                    setNewUnit({ name: "", display_name: "" })
                  }}
                  className={isMobile ? "h-12" : ""}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {isMobile ? (
            // Mobile: Vertical list layout
            <div className="space-y-2">
              {units.map((unit) => (
                <div key={unit.id}>
                  {editingUnit?.id === unit.id ? (
                    <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Internal Name</Label>
                        <Input
                          value={editingUnit.name}
                          onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                          className="h-12 text-base"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Display Name</Label>
                        <Input
                          value={editingUnit.display_name}
                          onChange={(e) => setEditingUnit({ ...editingUnit, display_name: e.target.value })}
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button onClick={handleUpdateUnit} className="h-12">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingUnit(null)} className="h-12">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer group relative"
                         onClick={() => handleUnitClick(unit)}
                         role="button"
                         tabIndex={0}
                         aria-label={`Edit unit ${unit.display_name}. Click to edit or use the edit button.`}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter' || e.key === ' ') {
                             e.preventDefault()
                             handleUnitClick(unit)
                           }
                         }}
                    >
                      <div className="flex-1 pointer-events-none">
                        <div className="font-medium flex items-center gap-2">
                          {unit.display_name}
                          <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          {unit.name}
                          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">• Tap to edit</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pointer-events-auto">
                        <Button
                          size="default"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingUnit({
                              id: unit.id,
                              name: unit.name,
                              display_name: unit.display_name,
                            })
                          }}
                          className="h-10 w-10 p-0"
                          aria-label={`Edit unit ${unit.display_name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="default"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteUnit(unit.id)
                          }}
                          className="h-10 w-10 p-0 text-red-500 hover:text-red-600"
                          aria-label={`Delete unit ${unit.display_name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Desktop: Original flex-wrap layout
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <div key={unit.id} className="flex items-center gap-1">
                  {editingUnit?.id === unit.id ? (
                    <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                      <Input
                        value={editingUnit.name}
                        onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                        className="w-20"
                      />
                      <Input
                        value={editingUnit.display_name}
                        onChange={(e) => setEditingUnit({ ...editingUnit, display_name: e.target.value })}
                        className="w-24"
                      />
                      <Button size="sm" onClick={handleUpdateUnit}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingUnit(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative group">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors pr-8"
                            onClick={() => handleUnitClick(unit)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Edit unit ${unit.display_name}. Click to edit or use the edit button.`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handleUnitClick(unit)
                              }
                            }}
                          >
                            {unit.display_name}
                            <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to edit &quot;{unit.display_name}&quot;</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingUnit({
                              id: unit.id,
                              name: unit.name,
                              display_name: unit.display_name,
                            })
                          }}
                          aria-label={`Edit unit ${unit.display_name}`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteUnit(unit.id)
                          }}
                          aria-label={`Delete unit ${unit.display_name}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  )
}
