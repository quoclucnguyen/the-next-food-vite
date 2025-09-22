import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNutrition } from '@/hooks/use-nutrition';
import { useRecipes } from '@/hooks/use-recipes';
import { useRestaurants } from '@/hooks/use-restaurants';
import type { MealPlan, MealSource } from '@/types/meal-planning';
import {
  ChefHat,
  Flame,
  MapPin,
  Plus,
  Target,
  UtensilsCrossed,
} from 'lucide-react';

interface MealCellProps {
  meal: MealPlan | null;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: Date;
  onDelete?: (mealId: string) => void;
  onEdit?: (meal: MealPlan) => void;
}

export function MealCell({
  meal,
  mealType,
  date,
  onDelete,
  onEdit,
}: MealCellProps) {
  const { restaurants } = useRestaurants();
  const { recipes } = useRecipes();
  const { calculateMealPlanNutrition, shouldShowNutrition } = useNutrition();

  // Vietnamese meal type labels
  const mealTypeLabels = {
    breakfast: 'Sáng',
    lunch: 'Trưa',
    dinner: 'Tối',
  } as const;

  // Get restaurant info if this is a dining out meal
  const restaurant = meal?.restaurantId
    ? restaurants.find((r) => r.id === meal.restaurantId)
    : null;

  // Determine meal source display
  const getMealSourceDisplay = (source: MealSource) => {
    switch (source) {
      case 'home':
        return {
          label: 'Nấu tại nhà',
          icon: ChefHat,
          variant: 'default' as const,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'dining_out':
        return {
          label: 'Ăn ngoài',
          icon: UtensilsCrossed,
          variant: 'secondary' as const,
          color: 'bg-orange-50 text-orange-700 border-orange-200',
        };
      default:
        return {
          label: 'Không xác định',
          icon: ChefHat,
          variant: 'outline' as const,
          color: 'bg-gray-50 text-gray-600 border-gray-200',
        };
    }
  };

  const mealSourceDisplay = meal ? getMealSourceDisplay(meal.source) : null;

  // Get dish names for display
  const getDishNames = () => {
    if (!meal?.dishes.length) return [];

    return meal.dishes.map((dish) => {
      if ('recipeId' in dish) {
        // Home dish - could show recipe name if available
        return dish.name;
      } else {
        // Dining dish - show dish name
        return dish.name;
      }
    });
  };

  const dishNames = getDishNames();
  const dishCount = meal?.dishes.length || 0;

  // Calculate nutrition for this meal
  const mealNutrition = meal ? calculateMealPlanNutrition(meal, recipes) : null;

  if (!meal) {
    return (
      <Card className='bg-gray-50/50 border-dashed border-gray-200 hover:bg-gray-50 transition-colors'>
        <CardContent className='p-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Badge variant='outline' className='capitalize'>
                {mealTypeLabels[mealType]}
              </Badge>
              <span className='text-gray-500 text-sm'>
                Chưa lên kế hoạch bữa ăn
              </span>
            </div>
            <Button
              variant='ghost'
              size='sm'
              className='text-gray-400 hover:text-gray-600'
              onClick={() => {
                // For empty cells, we need to pass null or create a new meal object
                // Let's create a basic meal object for the dialog
                const newMeal: MealPlan = {
                  id: '',
                  user_id: '',
                  date: date.toISOString().split('T')[0],
                  meal_type: mealType,
                  source: 'home',
                  dishes: [],
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                onEdit?.(newMeal);
              }}
            >
              <Plus className='w-4 h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const SourceIcon = mealSourceDisplay?.icon || ChefHat;

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 cursor-pointer ${
        mealSourceDisplay?.color || 'bg-gray-50'
      }`}
      onClick={() => onEdit?.(meal)}
    >
      <CardContent className='p-3'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='capitalize'>
              {mealTypeLabels[mealType]}
            </Badge>
            {mealSourceDisplay && (
              <Badge
                variant={mealSourceDisplay.variant}
                className='flex items-center gap-1'
              >
                <SourceIcon className='w-3 h-3' />
                {mealSourceDisplay.label}
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='text-gray-400 hover:text-red-600 h-6 w-6 p-0'
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(meal.id);
              }}
            >
              ×
            </Button>
          </div>
        </div>

        {/* Restaurant info for dining out meals */}
        {meal.source === 'dining_out' && restaurant && (
          <div className='mb-2 flex items-center gap-2 text-sm'>
            <MapPin className='w-4 h-4 text-orange-500 flex-shrink-0' />
            <span className='font-medium text-orange-800 truncate'>
              {restaurant.name}
            </span>
          </div>
        )}

        {/* Dish count and names */}
        <div className='space-y-1'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-gray-600'>
              {dishCount > 0 ? `${dishCount} món` : 'Chưa có món nào'}
            </span>
          </div>

          {/* Show first few dish names */}
          {dishNames.length > 0 && (
            <div className='text-sm text-gray-700'>
              <div className='truncate'>
                {dishNames.slice(0, 2).join(', ')}
                {dishNames.length > 2 && ` +${dishNames.length - 2} món khác`}
              </div>
            </div>
          )}

          {/* Nutrition display */}
          {mealNutrition && shouldShowNutrition(mealNutrition) && (
            <div className='flex items-center gap-2 text-xs'>
              {mealNutrition.kcal > 0 && (
                <span className='flex items-center gap-1'>
                  <Flame className='w-3 h-3' />
                  {Math.round(mealNutrition.kcal)}kcal
                </span>
              )}
              {mealNutrition.protein > 0 && (
                <span className='flex items-center gap-1'>
                  <Target className='w-3 h-3' />
                  {Math.round(mealNutrition.protein)}g
                </span>
              )}
              {!mealNutrition.hasCompleteData && (
                <Badge variant='secondary' className='text-xs px-1 py-0'>
                  Ước tính
                </Badge>
              )}
            </div>
          )}

          {/* Legacy recipe support */}
          {meal.recipe?.name && dishCount === 0 && (
            <div className='text-sm text-gray-700'>
              <div className='truncate font-medium'>{meal.recipe.name}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
