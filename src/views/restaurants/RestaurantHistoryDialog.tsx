import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChefHat } from 'lucide-react';

import { formatVietnameseDateTime } from '@/lib/vietnamese-formatting';
import type { MealPlan, Restaurant } from '@/types/meal-planning';

interface RestaurantHistoryDialogProps {
  open: boolean;
  restaurant: Restaurant | null;
  onOpenChange: (open: boolean) => void;
  getDiningHistory: (restaurantId: string) => MealPlan[];
}

export function RestaurantHistoryDialog({
  open,
  restaurant,
  onOpenChange,
  getDiningHistory,
}: RestaurantHistoryDialogProps) {
  const history = restaurant ? getDiningHistory(restaurant.id) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            Lịch sử ăn uống tại {restaurant?.name}
          </DialogTitle>
          <DialogDescription>
            Danh sách các bữa ăn đã ghi nhận tại nhà hàng này
          </DialogDescription>
        </DialogHeader>

        {restaurant && (
          <div className='space-y-4'>
            {history.length === 0 ? (
              <div className='text-center py-8'>
                <ChefHat className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500'>
                  Chưa có lịch sử ăn uống nào tại nhà hàng này
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {history.map((meal) => (
                  <Card key={meal.id}>
                    <CardContent className='p-4'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <h4 className='font-medium'>
                            {formatVietnameseDateTime(new Date(meal.date))}
                          </h4>
                          <p className='text-sm text-gray-600 capitalize'>
                            {meal.meal_type === 'breakfast' && 'Bữa sáng'}
                            {meal.meal_type === 'lunch' && 'Bữa trưa'}
                            {meal.meal_type === 'dinner' && 'Bữa tối'}
                          </p>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        {meal.dishes.map((dish, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between text-sm'
                          >
                            <span>{dish.name}</span>
                            {'price' in dish && dish.price && (
                              <span className='text-gray-600'>
                                {dish.price.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
