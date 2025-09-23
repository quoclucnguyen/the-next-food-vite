import { Badge } from '@/components/ui/badge';
import type { NutritionTotals } from '@/hooks/use-nutrition';
import type { MealSource } from '@/types/meal-planning';
import { DollarSign, Flame, Target, ChefHat, Utensils } from 'lucide-react';
import type { ReactNode } from 'react';

interface MultiDishHeaderProps {
  mode: MealSource;
  totals: {
    dishCount: number;
    totalPrice: number;
    totalNutrition: NutritionTotals;
  };
  action: ReactNode;
}

export function MultiDishHeader({ mode, totals, action }: MultiDishHeaderProps) {
  const isDiningOut = mode === 'dining_out';
  const { dishCount, totalPrice, totalNutrition } = totals;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <h3 className='text-lg font-semibold flex items-center gap-2'>
          {isDiningOut ? (
            <>
              <Utensils className='w-5 h-5' />
              Món ăn ngoài ({dishCount})
            </>
          ) : (
            <>
              <ChefHat className='w-5 h-5' />
              Món ăn tự nấu ({dishCount})
            </>
          )}
        </h3>

        {isDiningOut && totalPrice > 0 && (
          <Badge variant='secondary' className='flex items-center gap-1'>
            <DollarSign className='w-3 h-3' />
            {totalPrice.toLocaleString('vi-VN')}₫
          </Badge>
        )}

        {totalNutrition.kcal > 0 && (
          <div className='flex gap-2'>
            <Badge variant='outline' className='flex items-center gap-1'>
              <Flame className='w-3 h-3' />
              {Math.round(totalNutrition.kcal)}kcal
            </Badge>
            {totalNutrition.protein > 0 && (
              <Badge variant='outline' className='flex items-center gap-1'>
                <Target className='w-3 h-3' />
                {Math.round(totalNutrition.protein)}g protein
              </Badge>
            )}
            {!totalNutrition.hasCompleteData && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Target className='w-3 h-3' />
                Ước tính
              </Badge>
            )}
          </div>
        )}
      </div>

      {action}
    </div>
  );
}
