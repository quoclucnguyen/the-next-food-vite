import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCategories } from '@/hooks/use-categories';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUnits } from '@/hooks/use-units';
import {
  Edit2,
  Edit3,
  Loader2,
  Plus,
  Save,
  Tags,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface EditingItem {
  id: string;
  name: string;
  display_name: string;
}

export function CategoriesUnitsManager() {
  const {
    categories,
    isLoading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const {
    units,
    isLoading: unitsLoading,
    addUnit,
    updateUnit,
    deleteUnit,
  } = useUnits();
  const isMobile = useIsMobile();

  const [newCategory, setNewCategory] = useState({
    name: '',
    display_name: '',
  });
  const [newUnit, setNewUnit] = useState({ name: '', display_name: '' });
  const [editingCategory, setEditingCategory] = useState<EditingItem | null>(
    null
  );
  const [editingUnit, setEditingUnit] = useState<EditingItem | null>(null);

  // Dialog/Drawer states
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Helper functions for opening modals
  const handleCategoryEdit = (category: {
    id: string;
    name: string;
    display_name: string;
  }) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      display_name: category.display_name,
    });
    setEditCategoryOpen(true);
  };

  const handleUnitEdit = (unit: {
    id: string;
    name: string;
    display_name: string;
  }) => {
    setEditingUnit({
      id: unit.id,
      name: unit.name,
      display_name: unit.display_name,
    });
    setEditUnitOpen(true);
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim() || !newCategory.display_name.trim()) {
      setError('Cả tên và tên hiển thị đều là bắt buộc');
      return;
    }

    try {
      setError(null);
      await addCategory({
        name: newCategory.name.toLowerCase().trim(),
        display_name: newCategory.display_name.trim(),
      });
      setNewCategory({ name: '', display_name: '' });
      setAddCategoryOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể thêm danh mục');
    }
  };

  const handleAddUnit = async () => {
    if (!newUnit.name.trim() || !newUnit.display_name.trim()) {
      setError('Cả tên và tên hiển thị đều là bắt buộc');
      return;
    }

    try {
      setError(null);
      await addUnit({
        name: newUnit.name.toLowerCase().trim(),
        display_name: newUnit.display_name.trim(),
      });
      setNewUnit({ name: '', display_name: '' });
      setAddUnitOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể thêm đơn vị');
    }
  };

  const handleUpdateCategory = async () => {
    if (
      !editingCategory ||
      !editingCategory.name.trim() ||
      !editingCategory.display_name.trim()
    ) {
      setError('Cả tên và tên hiển thị đều là bắt buộc');
      return;
    }

    try {
      setError(null);
      await updateCategory({
        id: editingCategory.id,
        updates: {
          name: editingCategory.name.toLowerCase().trim(),
          display_name: editingCategory.display_name.trim(),
        },
      });
      setEditingCategory(null);
      setEditCategoryOpen(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Không thể cập nhật danh mục'
      );
    }
  };

  const handleUpdateUnit = async () => {
    if (
      !editingUnit ||
      !editingUnit.name.trim() ||
      !editingUnit.display_name.trim()
    ) {
      setError('Cả tên và tên hiển thị đều là bắt buộc');
      return;
    }

    try {
      setError(null);
      await updateUnit({
        id: editingUnit.id,
        updates: {
          name: editingUnit.name.toLowerCase().trim(),
          display_name: editingUnit.display_name.trim(),
        },
      });
      setEditingUnit(null);
      setEditUnitOpen(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Không thể cập nhật đơn vị'
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        setError(null);
        await deleteCategory(id);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Không thể xóa danh mục');
      }
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
      try {
        setError(null);
        await deleteUnit(id);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Không thể xóa đơn vị');
      }
    }
  };

  // Form components
  const CategoryForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className='space-y-4'>
      <div className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-3'}>
        <div>
          <Label htmlFor='category-name' className='text-sm font-medium'>
            Tên nội bộ
          </Label>
          <Input
            id='category-name'
            placeholder='ví dụ: trai-cay'
            value={isEdit ? editingCategory?.name || '' : newCategory.name}
            onChange={(e) =>
              isEdit
                ? setEditingCategory((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                : setNewCategory({ ...newCategory, name: e.target.value })
            }
            className={isMobile ? 'h-12 text-base' : ''}
          />
        </div>
        <div>
          <Label htmlFor='category-display' className='text-sm font-medium'>
            Tên hiển thị
          </Label>
          <Input
            id='category-display'
            placeholder='ví dụ: Trái cây'
            value={
              isEdit
                ? editingCategory?.display_name || ''
                : newCategory.display_name
            }
            onChange={(e) =>
              isEdit
                ? setEditingCategory((prev) =>
                    prev ? { ...prev, display_name: e.target.value } : null
                  )
                : setNewCategory({
                    ...newCategory,
                    display_name: e.target.value,
                  })
            }
            className={isMobile ? 'h-12 text-base' : ''}
          />
        </div>
      </div>
    </div>
  );

  const UnitForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className='space-y-4'>
      <div className={isMobile ? 'space-y-3' : 'grid grid-cols-2 gap-3'}>
        <div>
          <Label htmlFor='unit-name' className='text-sm font-medium'>
            Tên nội bộ
          </Label>
          <Input
            id='unit-name'
            placeholder='ví dụ: kg'
            value={isEdit ? editingUnit?.name || '' : newUnit.name}
            onChange={(e) =>
              isEdit
                ? setEditingUnit((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                : setNewUnit({ ...newUnit, name: e.target.value })
            }
            className={isMobile ? 'h-12 text-base' : ''}
          />
        </div>
        <div>
          <Label htmlFor='unit-display' className='text-sm font-medium'>
            Tên hiển thị
          </Label>
          <Input
            id='unit-display'
            placeholder='ví dụ: Kg'
            value={
              isEdit ? editingUnit?.display_name || '' : newUnit.display_name
            }
            onChange={(e) =>
              isEdit
                ? setEditingUnit((prev) =>
                    prev ? { ...prev, display_name: e.target.value } : null
                  )
                : setNewUnit({ ...newUnit, display_name: e.target.value })
            }
            className={isMobile ? 'h-12 text-base' : ''}
          />
        </div>
      </div>
    </div>
  );

  if (categoriesLoading || unitsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Tags className='w-5 h-5' />
            Danh mục & Đơn vị
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-6 h-6 animate-spin mr-2' />
            <span>Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className={isMobile ? 'mx-0' : ''}>
        <CardHeader className={isMobile ? 'px-4 py-4' : ''}>
          <CardTitle className='flex items-center gap-2'>
            <Tags className='w-5 h-5' />
            Danh mục & Đơn vị
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'px-4 pb-4 space-y-6' : 'space-y-6'}>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Categories Section */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium'>Danh mục</h3>
              <Button
                size={isMobile ? 'default' : 'sm'}
                onClick={() => setAddCategoryOpen(true)}
                className={isMobile ? 'h-10 px-4' : ''}
              >
                <Plus className='w-4 h-4 mr-2' />
                Thêm danh mục
              </Button>
            </div>

            {isMobile ? (
              // Mobile: Vertical list layout
              <div className='space-y-2'>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className='flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer group'
                    onClick={() => handleCategoryEdit(category)}
                    role='button'
                    tabIndex={0}
                    aria-label={`Edit category ${category.display_name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategoryEdit(category);
                      }
                    }}
                  >
                    <div className='flex-1'>
                      <div className='font-medium flex items-center gap-2'>
                        {category.display_name}
                        <Edit3 className='w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                      </div>
                      <div className='text-sm text-gray-500 flex items-center gap-1'>
                        {category.name}
                        <span className='text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                          • Tap to edit
                        </span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='default'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryEdit(category);
                        }}
                        className='h-10 w-10 p-0'
                        aria-label={`Edit category ${category.display_name}`}
                      >
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button
                        size='default'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        className='h-10 w-10 p-0 text-red-500 hover:text-red-600'
                        aria-label={`Delete category ${category.display_name}`}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop: Badge layout
              <div className='flex flex-wrap gap-2'>
                {categories.map((category) => (
                  <div key={category.id} className='relative group'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant='secondary'
                          className='flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors pr-8'
                          onClick={() => handleCategoryEdit(category)}
                          role='button'
                          tabIndex={0}
                          aria-label={`Edit category ${category.display_name}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleCategoryEdit(category);
                            }
                          }}
                        >
                          {category.display_name}
                          <Edit3 className='w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1' />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to edit "{category.display_name}"</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-4 w-4 p-0 hover:bg-transparent'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryEdit(category);
                        }}
                        aria-label={`Edit category ${category.display_name}`}
                      >
                        <Edit2 className='w-3 h-3' />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-4 w-4 p-0 hover:bg-transparent text-red-500'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        aria-label={`Delete category ${category.display_name}`}
                      >
                        <Trash2 className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Units Section */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium'>Đơn vị</h3>
              <Button
                size={isMobile ? 'default' : 'sm'}
                onClick={() => setAddUnitOpen(true)}
                className={isMobile ? 'h-10 px-4' : ''}
              >
                <Plus className='w-4 h-4 mr-2' />
                Thêm đơn vị
              </Button>
            </div>

            {isMobile ? (
              // Mobile: Vertical list layout
              <div className='space-y-2'>
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className='flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer group'
                    onClick={() => handleUnitEdit(unit)}
                    role='button'
                    tabIndex={0}
                    aria-label={`Edit unit ${unit.display_name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleUnitEdit(unit);
                      }
                    }}
                  >
                    <div className='flex-1'>
                      <div className='font-medium flex items-center gap-2'>
                        {unit.display_name}
                        <Edit3 className='w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                      </div>
                      <div className='text-sm text-gray-500 flex items-center gap-1'>
                        {unit.name}
                        <span className='text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                          • Tap to edit
                        </span>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='default'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnitEdit(unit);
                        }}
                        className='h-10 w-10 p-0'
                        aria-label={`Edit unit ${unit.display_name}`}
                      >
                        <Edit2 className='w-4 h-4' />
                      </Button>
                      <Button
                        size='default'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUnit(unit.id);
                        }}
                        className='h-10 w-10 p-0 text-red-500 hover:text-red-600'
                        aria-label={`Delete unit ${unit.display_name}`}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop: Badge layout
              <div className='flex flex-wrap gap-2'>
                {units.map((unit) => (
                  <div key={unit.id} className='relative group'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant='secondary'
                          className='flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors pr-8'
                          onClick={() => handleUnitEdit(unit)}
                          role='button'
                          tabIndex={0}
                          aria-label={`Edit unit ${unit.display_name}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleUnitEdit(unit);
                            }
                          }}
                        >
                          {unit.display_name}
                          <Edit3 className='w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1' />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to edit "{unit.display_name}"</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className='absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-4 w-4 p-0 hover:bg-transparent'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnitEdit(unit);
                        }}
                        aria-label={`Edit unit ${unit.display_name}`}
                      >
                        <Edit2 className='w-3 h-3' />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='h-4 w-4 p-0 hover:bg-transparent text-red-500'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUnit(unit.id);
                        }}
                        aria-label={`Delete unit ${unit.display_name}`}
                      >
                        <Trash2 className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Thêm danh mục mới</DrawerTitle>
            </DrawerHeader>
            <div className='px-4'>
              <CategoryForm />
            </div>
            <DrawerFooter>
              <Button onClick={handleAddCategory} className='h-12'>
                <Save className='w-4 h-4 mr-2' />
                Lưu
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setAddCategoryOpen(false);
                  setNewCategory({ name: '', display_name: '' });
                }}
                className='h-12'
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
            </DialogHeader>
            <CategoryForm />
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setAddCategoryOpen(false);
                  setNewCategory({ name: '', display_name: '' });
                }}
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
              <Button onClick={handleAddCategory}>
                <Save className='w-4 h-4 mr-2' />
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Category Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Chỉnh sửa danh mục</DrawerTitle>
            </DrawerHeader>
            <div className='px-4'>
              <CategoryForm isEdit />
            </div>
            <DrawerFooter>
              <Button onClick={handleUpdateCategory} className='h-12'>
                <Save className='w-4 h-4 mr-2' />
                Lưu thay đổi
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setEditCategoryOpen(false);
                  setEditingCategory(null);
                }}
                className='h-12'
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            </DialogHeader>
            <CategoryForm isEdit />
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setEditCategoryOpen(false);
                  setEditingCategory(null);
                }}
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
              <Button onClick={handleUpdateCategory}>
                <Save className='w-4 h-4 mr-2' />
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Unit Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={addUnitOpen} onOpenChange={setAddUnitOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Thêm đơn vị mới</DrawerTitle>
            </DrawerHeader>
            <div className='px-4'>
              <UnitForm />
            </div>
            <DrawerFooter>
              <Button onClick={handleAddUnit} className='h-12'>
                <Save className='w-4 h-4 mr-2' />
                Lưu
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setAddUnitOpen(false);
                  setNewUnit({ name: '', display_name: '' });
                }}
                className='h-12'
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={addUnitOpen} onOpenChange={setAddUnitOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm đơn vị mới</DialogTitle>
            </DialogHeader>
            <UnitForm />
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setAddUnitOpen(false);
                  setNewUnit({ name: '', display_name: '' });
                }}
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
              <Button onClick={handleAddUnit}>
                <Save className='w-4 h-4 mr-2' />
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Unit Dialog/Drawer */}
      {isMobile ? (
        <Drawer open={editUnitOpen} onOpenChange={setEditUnitOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Chỉnh sửa đơn vị</DrawerTitle>
            </DrawerHeader>
            <div className='px-4'>
              <UnitForm isEdit />
            </div>
            <DrawerFooter>
              <Button onClick={handleUpdateUnit} className='h-12'>
                <Save className='w-4 h-4 mr-2' />
                Lưu thay đổi
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setEditUnitOpen(false);
                  setEditingUnit(null);
                }}
                className='h-12'
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={editUnitOpen} onOpenChange={setEditUnitOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa đơn vị</DialogTitle>
            </DialogHeader>
            <UnitForm isEdit />
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setEditUnitOpen(false);
                  setEditingUnit(null);
                }}
              >
                <X className='w-4 h-4 mr-2' />
                Hủy
              </Button>
              <Button onClick={handleUpdateUnit}>
                <Save className='w-4 h-4 mr-2' />
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  );
}
