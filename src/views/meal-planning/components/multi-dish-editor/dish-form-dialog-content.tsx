import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import type { Database } from '@/lib/supabase';
import type { MealDish, MealSource } from '@/types/meal-planning';
import { ChefHat, Target } from 'lucide-react';
import type { DiningDishFormData, FormErrors, HomeDishFormData } from './form-state';

interface DishFormDialogContentProps {
  mode: MealSource;
  isMobile: boolean;
  homeForm: HomeDishFormData;
  diningForm: DiningDishFormData;
  errors: FormErrors;
  recipes: Recipe[];
  editingDish: MealDish | null;
  onCancel: () => void;
  onSubmit: () => void;
  onUpdateHome: (updates: Partial<HomeDishFormData>) => void;
  onUpdateDining: (updates: Partial<DiningDishFormData>) => void;
}

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  image_url: string | null;
};

export function DishFormDialogContent({
  mode,
  isMobile,
  homeForm,
  diningForm,
  errors,
  recipes,
  editingDish,
  onCancel,
  onSubmit,
  onUpdateHome,
  onUpdateDining,
}: DishFormDialogContentProps) {
  const isHomeMode = mode === 'home';

  return (
    <DialogContent className={isMobile ? 'max-w-[95vw]' : 'sm:max-w-[500px]'}>
      <DialogHeader>
        <DialogTitle>
          {editingDish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
        </DialogTitle>
        <DialogDescription>
          {isHomeMode
            ? 'Chọn công thức và số khẩu phần cho món ăn tự nấu.'
            : 'Nhập thông tin cho món ăn tại nhà hàng.'}
        </DialogDescription>
      </DialogHeader>

      <div className='space-y-4'>
        {isHomeMode ? (
          <>
            <div className='space-y-2'>
              <Label htmlFor='recipe'>Công thức *</Label>
              <Select
                value={homeForm.recipeId}
                onValueChange={(value) => onUpdateHome({ recipeId: value })}
              >
                <SelectTrigger className={errors.recipeId ? 'border-destructive' : ''}>
                  <SelectValue placeholder='Chọn công thức nấu ăn' />
                </SelectTrigger>
                <SelectContent>
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      <div className='flex items-center gap-2'>
                        <ChefHat className='w-4 h-4' />
                        {recipe.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.recipeId && (
                <p className='text-sm text-destructive'>{errors.recipeId}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='servings'>Số khẩu phần *</Label>
              <Input
                id='servings'
                type='number'
                min='0.5'
                step='0.5'
                value={homeForm.servings}
                onChange={(e) => onUpdateHome({ servings: e.target.value })}
                className={errors.servings ? 'border-destructive' : ''}
                placeholder='1'
              />
              {errors.servings && (
                <p className='text-sm text-destructive'>{errors.servings}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className='space-y-2'>
              <Label htmlFor='name'>Tên món ăn *</Label>
              <Input
                id='name'
                value={diningForm.name}
                onChange={(e) => onUpdateDining({ name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
                placeholder='Ví dụ: Phở bò, Bún riêu...'
              />
              {errors.name && (
                <p className='text-sm text-destructive'>{errors.name}</p>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='price'>Giá (₫)</Label>
                <Input
                  id='price'
                  type='number'
                  min='0'
                  value={diningForm.price}
                  onChange={(e) => onUpdateDining({ price: e.target.value })}
                  className={errors.price ? 'border-destructive' : ''}
                  placeholder='0'
                />
                {errors.price && (
                  <p className='text-sm text-destructive'>{errors.price}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='quantity'>Số lượng</Label>
                <Input
                  id='quantity'
                  type='number'
                  min='0.1'
                  step='0.1'
                  value={diningForm.quantity}
                  onChange={(e) => onUpdateDining({ quantity: e.target.value })}
                  className={errors.quantity ? 'border-destructive' : ''}
                  placeholder='1'
                />
                {errors.quantity && (
                  <p className='text-sm text-destructive'>{errors.quantity}</p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <Label className='text-sm font-medium'>
                  Thông tin dinh dưỡng (tùy chọn)
                </Label>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='kcal'>Calo (kcal)</Label>
                  <Input
                    id='kcal'
                    type='number'
                    min='0'
                    value={diningForm.kcal}
                    onChange={(e) => onUpdateDining({ kcal: e.target.value })}
                    placeholder='0'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='protein'>Protein (g)</Label>
                  <Input
                    id='protein'
                    type='number'
                    min='0'
                    step='0.1'
                    value={diningForm.protein}
                    onChange={(e) => onUpdateDining({ protein: e.target.value })}
                    placeholder='0'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='carbs'>Carbs (g)</Label>
                  <Input
                    id='carbs'
                    type='number'
                    min='0'
                    step='0.1'
                    value={diningForm.carbs}
                    onChange={(e) => onUpdateDining({ carbs: e.target.value })}
                    placeholder='0'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='fat'>Chất béo (g)</Label>
                  <Input
                    id='fat'
                    type='number'
                    min='0'
                    step='0.1'
                    value={diningForm.fat}
                    onChange={(e) => onUpdateDining({ fat: e.target.value })}
                    placeholder='0'
                  />
                </div>
              </div>

              <p className='text-xs text-muted-foreground'>
                Nhập thông tin dinh dưỡng để theo dõi tổng calo và chất dinh dưỡng.
                Bạn có thể để trống nếu không biết chính xác.
              </p>
            </div>
          </>
        )}

        <div className='space-y-2'>
          <Label htmlFor='notes'>Ghi chú</Label>
          <Textarea
            id='notes'
            value={isHomeMode ? homeForm.notes : diningForm.notes}
            onChange={(e) =>
              isHomeMode
                ? onUpdateHome({ notes: e.target.value })
                : onUpdateDining({ notes: e.target.value })
            }
            placeholder='Thêm ghi chú cho món ăn...'
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={onSubmit}>
          {editingDish ? 'Cập nhật' : 'Thêm món'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
