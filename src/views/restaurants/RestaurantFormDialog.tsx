import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

import type { Restaurant } from '@/types/meal-planning';

import type { RestaurantFormData } from './types';

interface RestaurantFormDialogProps {
  open: boolean;
  editingRestaurant: Restaurant | null;
  formData: RestaurantFormData;
  errors: Record<string, string>;
  tagInput: string;
  onOpenChange: (open: boolean) => void;
  onFormDataChange: (updates: Partial<RestaurantFormData>) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: () => void;
}

export function RestaurantFormDialog({
  open,
  editingRestaurant,
  formData,
  errors,
  tagInput,
  onOpenChange,
  onFormDataChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
}: RestaurantFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {editingRestaurant ? 'Chỉnh sửa nhà hàng' : 'Thêm nhà hàng mới'}
          </DialogTitle>
          <DialogDescription>
            {editingRestaurant
              ? 'Cập nhật thông tin nhà hàng'
              : 'Tạo nhà hàng mới để sử dụng trong kế hoạch ăn uống của bạn.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Tên nhà hàng *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => onFormDataChange({ name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
                placeholder='Ví dụ: Phở 10 Lý Quốc Sư, Bún Riêu Cố Đạo...'
              />
              {errors.name && (
                <p className='text-sm text-destructive'>{errors.name}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='cuisine'>Loại món ăn</Label>
              <Input
                id='cuisine'
                value={formData.cuisine}
                onChange={(e) => onFormDataChange({ cuisine: e.target.value })}
                placeholder='Ví dụ: Việt Nam, Nhật Bản, Ý...'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='address'>Địa chỉ</Label>
            <Input
              id='address'
              value={formData.address}
              onChange={(e) => onFormDataChange({ address: e.target.value })}
              placeholder='Ví dụ: 10 Lý Quốc Sư, Quận 1, TP.HCM'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Số điện thoại</Label>
              <Input
                id='phone'
                value={formData.phone}
                onChange={(e) => onFormDataChange({ phone: e.target.value })}
                className={errors.phone ? 'border-destructive' : ''}
                placeholder='Ví dụ: 0123 456 789'
              />
              {errors.phone && (
                <p className='text-sm text-destructive'>{errors.phone}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='rating'>Đánh giá (1-5)</Label>
              <Input
                id='rating'
                type='number'
                min='1'
                max='5'
                step='0.1'
                value={formData.rating}
                onChange={(e) => onFormDataChange({ rating: e.target.value })}
                className={errors.rating ? 'border-destructive' : ''}
                placeholder='Ví dụ: 4.5'
              />
              {errors.rating && (
                <p className='text-sm text-destructive'>{errors.rating}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tags'>Thẻ (tags)</Label>
            <div className='flex gap-2'>
              <Input
                id='tags'
                value={tagInput}
                onChange={(e) => onTagInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddTag();
                  }
                }}
                placeholder='Nhập thẻ và nhấn Enter...'
                className='flex-1'
              />
              <Button type='button' onClick={onAddTag} variant='outline'>
                Thêm
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className='flex flex-wrap gap-1 mt-2'>
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => onRemoveTag(tag)}
                      className='text-muted-foreground hover:text-foreground'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='notes'>Ghi chú</Label>
            <Textarea
              id='notes'
              value={formData.notes}
              onChange={(e) => onFormDataChange({ notes: e.target.value })}
              placeholder='Thêm ghi chú về nhà hàng...'
              rows={3}
            />
          </div>

          {errors.submit && (
            <p className='text-sm text-destructive'>{errors.submit}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>
            {editingRestaurant ? 'Cập nhật' : 'Tạo nhà hàng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
