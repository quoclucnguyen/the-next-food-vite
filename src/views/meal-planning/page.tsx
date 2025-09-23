import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditMealDialog, MealCell } from '@/views/meal-planning/components';
import { useMealPlans } from '@/hooks/use-meal-plans';
import { useRecipes } from '@/hooks/use-recipes';
import type { MealPlan } from '@/types/meal-planning';
import { CalendarIcon, ChefHat, Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function MealPlanningPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealPlan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<MealPlan | null>(null);
  const { mealPlans, loading, deleteMealPlan } = useMealPlans();
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

  const handleEditMeal = (meal: MealPlan) => {
    setEditingMeal(meal);
    setIsEditDialogOpen(true);
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteMealConfirm = (mealId: string) => {
    const meal = mealPlans.find((m) => m.id === mealId);
    if (meal) {
      setMealToDelete(meal);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteMeal = async () => {
    if (mealToDelete) {
      try {
        await deleteMealPlan(mealToDelete.id);
        setDeleteDialogOpen(false);
        setMealToDelete(null);
      } catch (error) {
        console.error('Không thể xóa bữa ăn:', error);
      }
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
              <Button
                size='sm'
                onClick={handleAddMeal}
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
              >
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Plus className='w-4 h-4' />
                )}
              </Button>
            </div>

            {/* Desktop action button */}
            <div className='hidden sm:flex'>
              <Button
                size='sm'
                onClick={handleAddMeal}
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Plus className='w-4 h-4 mr-2' />
                    Thêm bữa ăn
                  </>
                )}
              </Button>
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
        {loading ? (
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
                    {mealTypes.map((mealType) => (
                      <div key={mealType} className='animate-pulse'>
                        <div className='h-16 bg-gray-200 rounded-lg'></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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
                        <MealCell
                          key={mealType}
                          meal={meal}
                          mealType={mealType}
                          date={date}
                          onEdit={handleEditMeal}
                          onDelete={handleDeleteMealConfirm}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
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

      {/* Edit Meal Dialog */}
      <EditMealDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mealPlan={editingMeal}
        existingMealPlans={mealPlans}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bữa ăn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bữa ăn này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMeal}
              className='bg-red-600 hover:bg-red-700'
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
