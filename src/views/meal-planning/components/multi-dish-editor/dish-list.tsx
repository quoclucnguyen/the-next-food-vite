import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { MealDish, MealSource } from '@/types/meal-planning';
import { isDiningDish, isHomeDish } from '@/types/meal-planning';
import {
  ChefHat,
  DollarSign,
  Edit,
  Flame,
  Target,
  Trash2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

interface DishListProps {
  dishes: MealDish[];
  mode: MealSource;
  getRecipeDisplayName: (recipeId: string) => string;
  onEdit: (dish: MealDish) => void;
  onDelete: (dishId: string) => void;
  emptyState?: ReactNode;
}

export function DishList({
  dishes,
  mode,
  getRecipeDisplayName,
  onEdit,
  onDelete,
  emptyState,
}: DishListProps) {
  if (dishes.length === 0) {
    return emptyState ? (
      <>{emptyState}</>
    ) : (
      <Card>
        <CardContent className='text-center py-8'>
          <ChefHat className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-medium text-muted-foreground mb-2'>
            Chưa có món ăn nào
          </h3>
          <p className='text-sm text-muted-foreground'>
            {mode === 'home'
              ? 'Thêm món ăn tự nấu từ công thức của bạn.'
              : 'Thêm món ăn sẽ ăn tại nhà hàng.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-3'>
      {dishes.map((dish, index) => (
        <Card key={dish.id} className='relative'>
          <CardContent className='p-4'>
            <div className='flex items-start justify-between'>
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>{index + 1}</Badge>
                  <h4 className='font-medium'>
                    {isHomeDish(dish)
                      ? getRecipeDisplayName(dish.recipeId)
                      : dish.name}
                  </h4>
                </div>

                {isHomeDish(dish) && (
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Users className='w-3 h-3' />
                      {dish.servings} khẩu phần
                    </span>
                    {dish.nutrition && (
                      <div className='flex items-center gap-2'>
                        {dish.nutrition.kcal && (
                          <span className='flex items-center gap-1'>
                            <Flame className='w-3 h-3' />
                            {dish.nutrition.kcal * dish.servings}kcal
                          </span>
                        )}
                        {dish.nutrition.protein && (
                          <span className='flex items-center gap-1'>
                            <Target className='w-3 h-3' />
                            {dish.nutrition.protein * dish.servings}g
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {isDiningDish(dish) && (
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    {dish.price && (
                      <span className='flex items-center gap-1'>
                        <DollarSign className='w-3 h-3' />
                        {dish.price.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                    {dish.quantity && dish.quantity !== 1 && (
                      <span className='flex items-center gap-1'>
                        <Users className='w-3 h-3' />
                        {dish.quantity}x
                      </span>
                    )}
                    {dish.price && dish.quantity && (
                      <span className='font-medium text-foreground'>
                        Tổng:{' '}
                        {(dish.price * dish.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    )}

                    {dish.nutrition && (
                      <div className='flex items-center gap-2'>
                        {dish.nutrition.kcal && (
                          <span className='flex items-center gap-1'>
                            <Flame className='w-3 h-3' />
                            {dish.nutrition.kcal * (dish.quantity || 1)}kcal
                          </span>
                        )}
                        {dish.nutrition.protein && (
                          <span className='flex items-center gap-1'>
                            <Target className='w-3 h-3' />
                            {dish.nutrition.protein * (dish.quantity || 1)}g
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {dish.notes && (
                  <p className='text-sm text-muted-foreground italic'>
                    {dish.notes}
                  </p>
                )}
              </div>

              <div className='flex items-center gap-1'>
                <Button size='sm' variant='ghost' onClick={() => onEdit(dish)}>
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onDelete(dish.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
