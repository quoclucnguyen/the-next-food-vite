import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMealPlans } from '@/hooks/use-meal-plans';
import { useRecipes } from '@/hooks/use-recipes';
import { CalendarIcon, ChefHat, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function MealPlanningPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { mealPlans, deleteMealPlan } = useMealPlans();
  const { recipes } = useRecipes();

  const getWeekDates = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(
      start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1)
    ); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  // Vietnamese translations for meal types
  const mealTypeLabels = {
    breakfast: 'Sáng',
    lunch: 'Trưa',
    dinner: 'Tối',
  } as const;

  const getMealForDateAndType = (date: Date, mealType: string) => {
    const dateString = date.toISOString().split('T')[0];
    const plan = mealPlans.find(
      (plan) => plan.date === dateString && plan.meal_type === mealType
    );
    return plan
      ? {
          ...plan,
          meal: plan.meal_type,
          recipeName: plan.recipe?.name || 'Công thức không xác định',
        }
      : null;
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMealPlan(mealId);
    } catch (error) {
      console.error('Không thể xóa bữa ăn:', error);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  return (
    <>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-tight'>
                Lập kế hoạch bữa ăn
              </h1>
            </div>

            {/* Mobile action button */}
            <div className='flex sm:hidden'>
              <Link to='/meal-planning/add'>
                <Button
                  size='sm'
                  className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </Link>
            </div>

            {/* Desktop action button */}
            <div className='hidden sm:flex'>
              <Link to='/meal-planning/add'>
                <Button
                  size='sm'
                  className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm bữa ăn
                </Button>
              </Link>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateWeek('prev')}
            >
              Trước
            </Button>
            <h2 className='font-medium'>
              {weekDates[0].toLocaleDateString('vi-VN', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {weekDates[6].toLocaleDateString('vi-VN', {
                month: 'short',
                day: 'numeric',
              })}
            </h2>
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigateWeek('next')}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <div className='space-y-4'>
          {weekDates.map((date) => (
            <Card key={date.toISOString()}>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <CalendarIcon className='w-5 h-5' />
                  {date.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {mealTypes.map((mealType) => {
                    const meal = getMealForDateAndType(date, mealType);
                    return (
                      <div
                        key={mealType}
                        className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          <Badge variant='outline' className='capitalize'>
                            {mealTypeLabels[mealType]}
                          </Badge>
                          {meal ? (
                            <span className='font-medium'>
                              {meal.recipeName}
                            </span>
                          ) : (
                            <span className='text-gray-500'>
                              Chưa lên kế hoạch bữa ăn
                            </span>
                          )}
                        </div>
                        <div className='flex gap-2'>
                          {meal ? (
                            <>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDeleteMeal(meal.id)}
                              >
                                Xóa
                              </Button>
                            </>
                          ) : (
                            <Link
                              to={`/meal-planning/add?date=${
                                date.toISOString().split('T')[0]
                              }&meal=${mealType}`}
                            >
                              <Button variant='ghost' size='sm'>
                                <Plus className='w-4 h-4' />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {recipes.length === 0 && (
          <Card className='mt-6'>
            <CardContent className='text-center py-8'>
              <ChefHat className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Chưa có công thức nào
              </h3>
              <p className='text-gray-500 mb-4'>
                Hãy thêm một số công thức trước để bắt đầu lập kế hoạch bữa ăn
              </p>
              <Link to='/recipes/add'>
                <Button>
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm công thức
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
