import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFoodItems } from '@/hooks/use-food-items';
import { useMealPlans } from '@/hooks/use-meal-plans';
import { useRecipes } from '@/hooks/use-recipes';
import { useShoppingList } from '@/hooks/use-shopping-list';
import {
  AlertTriangle,
  Calendar,
  ChefHat,
  Clock,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router';

export default function HomePage() {
  const { recipes, loading: recipesLoading } = useRecipes();
  const { items: foodItems, isLoading: foodItemsLoading } = useFoodItems();
  const { mealPlans, loading: mealPlansLoading } = useMealPlans();
  const { items: shoppingItems, loading: shoppingLoading } = useShoppingList();

  // Calculate statistics
  const totalRecipes = recipes?.length || 0;
  const totalFoodItems = foodItems?.length || 0;
  const totalMealPlans = mealPlans?.length || 0;
  const totalShoppingItems = shoppingItems?.length || 0;
  const completedShoppingItems =
    shoppingItems?.filter((item) => item.completed)?.length || 0;
  const pendingShoppingItems = totalShoppingItems - completedShoppingItems;

  // Get recent items
  const recentRecipes = recipes?.slice(0, 3) || [];
  const lowStockItems =
    foodItems?.filter((item) => (item.quantity || 0) < 5)?.slice(0, 3) || [];
  const upcomingMeals =
    mealPlans
      ?.filter((plan) => {
        const planDate = new Date(plan.date);
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return planDate >= today && planDate <= nextWeek;
      })
      ?.slice(0, 3) || [];

  const isLoading =
    recipesLoading || foodItemsLoading || mealPlansLoading || shoppingLoading;

  return (
    <div className='p-4 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Quản lý bếp núc thông minh của bạn
          </p>
        </div>
        <div className='flex gap-2'>
          <Button asChild size='sm'>
            <Link to='/recipes/add'>
              <Plus className='h-4 w-4 mr-2' />
              Thêm công thức
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Công thức</CardTitle>
            <ChefHat className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading ? '...' : totalRecipes}
            </div>
            <p className='text-xs text-muted-foreground'>
              Tổng số công thức nấu ăn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Kho thực phẩm</CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading ? '...' : totalFoodItems}
            </div>
            <p className='text-xs text-muted-foreground'>
              Số loại thực phẩm trong kho
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Kế hoạch bữa ăn
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading ? '...' : totalMealPlans}
            </div>
            <p className='text-xs text-muted-foreground'>
              Bữa ăn đã lên kế hoạch
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Danh sách mua sắm
            </CardTitle>
            <ShoppingCart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {isLoading ? '...' : pendingShoppingItems}
            </div>
            <p className='text-xs text-muted-foreground'>
              {completedShoppingItems} đã hoàn thành / {totalShoppingItems} tổng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Thao tác nhanh
          </CardTitle>
          <CardDescription>Truy cập nhanh các tính năng chính</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link to='/recipes' className='flex flex-col items-center gap-2'>
                <ChefHat className='h-6 w-6' />
                <span>Công thức nấu ăn</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link
                to='/inventory'
                className='flex flex-col items-center gap-2'
              >
                <Package className='h-6 w-6' />
                <span>Kho thực phẩm</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link
                to='/meal-planning'
                className='flex flex-col items-center gap-2'
              >
                <Calendar className='h-6 w-6' />
                <span>Lập kế hoạch bữa ăn</span>
              </Link>
            </Button>
            <Button asChild variant='outline' className='h-auto p-4'>
              <Link
                to='/shopping-list'
                className='flex flex-col items-center gap-2'
              >
                <ShoppingCart className='h-6 w-6' />
                <span>Danh sách mua sắm</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Recent Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ChefHat className='h-5 w-5' />
              Công thức mới nhất
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isLoading ? (
              <div className='space-y-2'>
                <div className='h-4 bg-muted rounded animate-pulse' />
                <div className='h-4 bg-muted rounded animate-pulse' />
                <div className='h-4 bg-muted rounded animate-pulse' />
              </div>
            ) : recentRecipes.length > 0 ? (
              recentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className='flex items-center justify-between'
                >
                  <div>
                    <p className='font-medium'>{recipe.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {recipe.prep_time
                        ? `${recipe.prep_time} phút`
                        : 'Không xác định'}
                    </p>
                  </div>
                  <Badge variant='secondary'>{recipe.servings} phần</Badge>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Chưa có công thức nào
              </p>
            )}
            {!isLoading && recentRecipes.length > 0 && (
              <Button asChild variant='ghost' size='sm' className='w-full'>
                <Link to='/recipes'>Xem tất cả</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-orange-500' />
              Thực phẩm sắp hết
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isLoading ? (
              <div className='space-y-2'>
                <div className='h-4 bg-muted rounded animate-pulse' />
                <div className='h-4 bg-muted rounded animate-pulse' />
                <div className='h-4 bg-muted rounded animate-pulse' />
              </div>
            ) : lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between'
                >
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      Còn lại: {item.quantity} {item.unit}
                    </p>
                  </div>
                  <Badge variant='destructive'>Sắp hết</Badge>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Tất cả thực phẩm đều đủ
              </p>
            )}
            {!isLoading && lowStockItems.length > 0 && (
              <Button asChild variant='ghost' size='sm' className='w-full'>
                <Link to='/inventory'>Quản lý kho</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Meals */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5' />
              Bữa ăn sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {isLoading ? (
              <div className='space-y-2'>
                <div className='h-4 bg-muted rounded animate-pulse' />
                <div className='h-4 bg-muted rounded animate-pulse' />
                <div className='h-4 bg-muted rounded animate-pulse' />
              </div>
            ) : upcomingMeals.length > 0 ? (
              upcomingMeals.map((meal) => (
                <div
                  key={meal.id}
                  className='flex items-center justify-between'
                >
                  <div>
                    <p className='font-medium'>
                      {meal.recipe?.name || 'Không có tên'}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(meal.date).toLocaleDateString('vi-VN')} -{' '}
                      {meal.meal_type}
                    </p>
                  </div>
                  <Badge variant='outline'>{meal.meal_type}</Badge>
                </div>
              ))
            ) : (
              <p className='text-sm text-muted-foreground'>
                Chưa có kế hoạch bữa ăn
              </p>
            )}
            {!isLoading && upcomingMeals.length > 0 && (
              <Button asChild variant='ghost' size='sm' className='w-full'>
                <Link to='/meal-planning'>Xem kế hoạch</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
