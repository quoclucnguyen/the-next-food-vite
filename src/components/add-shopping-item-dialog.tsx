import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/use-categories';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUnits } from '@/hooks/use-units';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';

interface AddShoppingItemDialogProps {
  onAddItem: (item: {
    name: string;
    quantity: number;
    unit: string;
    category: string;
    completed: boolean;
    source: 'manual';
  }) => Promise<void>;
  trigger?: React.ReactNode;
}

interface FormData {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

interface FormErrors {
  name?: string;
  quantity?: string;
  unit?: string;
  category?: string;
}

export function AddShoppingItemDialog({
  onAddItem,
  trigger,
}: AddShoppingItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity: '1',
    unit: '',
    category: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { categories, isLoading: categoriesLoading } = useCategories();
  const { units, isLoading: unitsLoading } = useUnits();
  const isMobile = useIsMobile();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên mặt hàng là bắt buộc';
    }

    const quantity = Number.parseFloat(formData.quantity);
    if (!formData.quantity || Number.isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = 'Vui lòng nhập số lượng hợp lệ lớn hơn 0';
    }

    if (!formData.unit) {
      newErrors.unit = 'Vui lòng chọn đơn vị';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onAddItem({
        name: formData.name.trim(),
        quantity: Number.parseFloat(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        completed: false,
        source: 'manual',
      });

      // Reset form and close dialog
      setFormData({
        name: '',
        quantity: '1',
        unit: '',
        category: '',
      });
      setErrors({});
      setOpen(false);
    } catch (error) {
      console.error('Failed to add item:', error);
      // Error handling will be done by the parent component via toast
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setFormData({
          name: '',
          quantity: '1',
          unit: '',
          category: '',
        });
        setErrors({});
      }
    }
  };

  // Set default values when dialog opens and data is loaded
  const handleDialogOpen = () => {
    if (!formData.unit && units && units.length > 0) {
      const defaultUnit =
        units.find((unit) => unit.name === 'pieces') || units[0];
      setFormData((prev) => ({ ...prev, unit: defaultUnit.name }));
    }
    if (!formData.category && categories && categories.length > 0) {
      const defaultCategory =
        categories.find((cat) => cat.name === 'other') || categories[0];
      setFormData((prev) => ({ ...prev, category: defaultCategory.name }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={handleDialogOpen}>
        {trigger || (
          <Button
            size={isMobile ? 'default' : 'sm'}
            className={isMobile ? 'h-11 min-w-[44px]' : ''}
          >
            <Plus className='mr-2' />
            Thêm mặt hàng
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px] ${
          isMobile ? 'mx-4 max-w-[calc(100vw-2rem)] p-4' : ''
        }`}
      >
        <DialogHeader>
          <DialogTitle>Thêm mặt hàng mua sắm</DialogTitle>
          <DialogDescription>
            Thêm một mặt hàng mới vào danh sách mua sắm của bạn. Điền thông tin
            chi tiết bên dưới.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='item-name' className='text-sm font-medium'>
              Tên mặt hàng *
            </Label>
            <Input
              id='item-name'
              placeholder='ví dụ: Sữa, Bánh mì, Táo'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`${isMobile ? 'h-11 text-base' : ''} ${
                errors.name ? 'border-destructive' : ''
              }`}
              disabled={loading}
              autoFocus
            />
            {errors.name && (
              <p className='text-sm font-medium text-destructive'>
                {errors.name}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='quantity' className='text-sm font-medium'>
                Số lượng *
              </Label>
              <Input
                id='quantity'
                type='number'
                step='0.1'
                min='0.1'
                placeholder='1'
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className={`${isMobile ? 'h-11 text-base' : ''} ${
                  errors.quantity ? 'border-destructive' : ''
                }`}
                disabled={loading}
              />
              {errors.quantity && (
                <p className='text-sm font-medium text-destructive'>
                  {errors.quantity}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='unit' className='text-sm font-medium'>
                Đơn vị *
              </Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
                disabled={loading || unitsLoading}
              >
                <SelectTrigger
                  className={`${isMobile ? 'h-11' : ''} ${
                    errors.unit ? 'border-destructive' : ''
                  }`}
                >
                  <SelectValue
                    placeholder={unitsLoading ? 'Đang tải...' : 'Chọn đơn vị'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {units?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.name}>
                      {unit.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className='text-sm font-medium text-destructive'>
                  {errors.unit}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category' className='text-sm font-medium'>
              Danh mục *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              disabled={loading || categoriesLoading}
            >
              <SelectTrigger
                className={`${isMobile ? 'h-11' : ''} ${
                  errors.category ? 'border-destructive' : ''
                }`}
              >
                <SelectValue
                  placeholder={
                    categoriesLoading ? 'Đang tải...' : 'Chọn danh mục'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className='text-sm font-medium text-destructive'>
                {errors.category}
              </p>
            )}
          </div>

          <DialogFooter className={isMobile ? 'flex-col space-y-2' : ''}>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className={isMobile ? 'h-11 w-full' : ''}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={loading || categoriesLoading || unitsLoading}
              className={isMobile ? 'h-11 w-full' : ''}
            >
              {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Thêm mặt hàng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
