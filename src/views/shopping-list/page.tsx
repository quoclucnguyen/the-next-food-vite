import { AddShoppingItemDialog } from '@/components/add-shopping-item-dialog';
import { BottomNav } from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategories } from '@/hooks/use-categories';
import { useFoodItems } from '@/hooks/use-food-items';
import { useMealPlans } from '@/hooks/use-meal-plans';
import { useRecipes } from '@/hooks/use-recipes';
import { useShoppingList } from '@/hooks/use-shopping-list';
import { RefreshCw, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShoppingListPage() {
  const {
    items: shoppingList,
    addItem,
    updateItem,
    deleteItem,
    clearCompleted,
  } = useShoppingList();
  const { items: inventory } = useFoodItems();
  const { categories } = useCategories();
  const { mealPlans } = useMealPlans();
  const { recipes } = useRecipes();

  const toggleItem = async (id: string) => {
    const item = shoppingList.find((item) => item.id === id);
    if (item) {
      try {
        await updateItem(id, { completed: !item.completed });
        // Don't show toast for toggle as it's a frequent action
      } catch (error) {
        console.error('Failed to update item:', error);
        toast.error('Không thể cập nhật mặt hàng', {
          description: 'Đã xảy ra lỗi khi cập nhật mặt hàng. Vui lòng thử lại.',
        });
      }
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteItem(id);
      toast.success('Đã xóa mặt hàng', {
        description: 'Mặt hàng đã được xóa khỏi danh sách mua sắm của bạn.',
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Không thể xóa mặt hàng', {
        description: 'Đã xảy ra lỗi khi xóa mặt hàng. Vui lòng thử lại.',
      });
    }
  };

  const generateFromMealPlans = async () => {
    try {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingMeals = mealPlans.filter((plan) => {
        const planDate = new Date(plan.date);
        return planDate >= new Date() && planDate <= nextWeek;
      });

      if (upcomingMeals.length === 0) {
        toast.info('Không tìm thấy bữa ăn sắp tới', {
          description:
            'Thêm một số kế hoạch bữa ăn cho tuần tới để tạo danh sách mua sắm.',
        });
        return;
      }

      const neededIngredients: {
        [key: string]: { quantity: number; unit: string; category: string };
      } = {};

      upcomingMeals.forEach((meal) => {
        const recipe = recipes.find((r) => r.id === meal.recipe_id);
        if (recipe) {
          recipe.ingredients.forEach((ingredient) => {
            const parts = ingredient.split(' ');
            const quantity = Number.parseFloat(parts[0]) || 1;
            const unit = parts[1] || 'pieces';
            const name = parts.slice(2).join(' ') || ingredient;

            if (neededIngredients[name]) {
              neededIngredients[name].quantity += quantity;
            } else {
              // Find the default category or use 'pantry' as fallback
              const defaultCategory =
                categories.find((cat) => cat.name === 'pantry')?.name ||
                categories.find((cat) => cat.name === 'other')?.name ||
                'other';
              neededIngredients[name] = {
                quantity,
                unit,
                category: defaultCategory,
              };
            }
          });
        }
      });

      // Remove existing meal-plan items first
      const mealPlanItems = shoppingList.filter(
        (item) => item.source === 'meal-plan'
      );
      for (const item of mealPlanItems) {
        await deleteItem(item.id);
      }

      let addedCount = 0;
      // Add new items
      for (const [name, details] of Object.entries(neededIngredients)) {
        const inventoryItem = inventory.find(
          (item) =>
            item.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(item.name.toLowerCase())
        );

        const neededQuantity = inventoryItem
          ? Math.max(0, details.quantity - inventoryItem.quantity)
          : details.quantity;

        if (neededQuantity > 0) {
          try {
            await addItem({
              name,
              quantity: neededQuantity,
              unit: details.unit,
              category: details.category,
              completed: false,
              source: 'meal-plan',
            });
            addedCount++;
          } catch (error) {
            console.error('Failed to add shopping item:', error);
          }
        }
      }

      toast.success('Đã tạo danh sách mua sắm', {
        description: `Đã thêm ${addedCount} mặt hàng từ kế hoạch bữa ăn của bạn.`,
      });
    } catch (error) {
      console.error('Failed to generate shopping list:', error);
      toast.error('Không thể tạo danh sách mua sắm', {
        description:
          'Đã xảy ra lỗi khi tạo danh sách mua sắm. Vui lòng thử lại.',
      });
    }
  };

  const handleAddItem = async (item: {
    name: string;
    quantity: number;
    unit: string;
    category: string;
    completed: boolean;
    source: 'manual';
  }) => {
    try {
      await addItem(item);
      toast.success('Đã thêm mặt hàng vào danh sách mua sắm', {
        description: `${item.name} (${item.quantity} ${item.unit}) đã được thêm thành công`,
      });
    } catch (error) {
      console.error('Failed to add item:', error);
      toast.error('Không thể thêm mặt hàng', {
        description:
          'Đã xảy ra lỗi khi thêm mặt hàng vào danh sách mua sắm. Vui lòng thử lại.',
      });
      throw error; // Re-throw to let the dialog handle loading state
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedCount = shoppingList.filter(
        (item) => item.completed
      ).length;
      await clearCompleted();
      toast.success('Đã xóa các mặt hàng đã hoàn thành', {
        description: `Đã xóa ${completedCount} mặt hàng đã hoàn thành khỏi danh sách của bạn.`,
      });
    } catch (error) {
      console.error('Failed to clear completed items:', error);
      toast.error('Không thể xóa các mặt hàng đã hoàn thành', {
        description:
          'Đã xảy ra lỗi khi xóa các mặt hàng đã hoàn thành. Vui lòng thử lại.',
      });
    }
  };

  const completedCount = shoppingList.filter((item) => item.completed).length;
  const totalCount = shoppingList.length;

  const groupedItems = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof shoppingList>);

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-6'>
          <div className='flex flex-col gap-4 mb-6'>
            {/* Header with title and action buttons */}
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-tight'>
                  Danh sách mua sắm
                </h1>
                <p className='text-sm text-gray-500 mt-1 hidden sm:block'>
                  Quản lý danh sách mua sắm của bạn
                </p>
              </div>

              {/* Mobile action buttons */}
              <div className='flex sm:hidden gap-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={generateFromMealPlans}
                  className='bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-colors h-10 w-10 p-0'
                >
                  <RefreshCw className='w-4 h-4' />
                </Button>
                <AddShoppingItemDialog onAddItem={handleAddItem} />
              </div>

              {/* Desktop action buttons */}
              <div className='hidden sm:flex gap-3'>
                <Button
                  variant='outline'
                  size='default'
                  onClick={generateFromMealPlans}
                  className='bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 transition-colors'
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Tạo tự động
                </Button>
                <AddShoppingItemDialog onAddItem={handleAddItem} />
              </div>
            </div>

            {/* Progress indicator */}
            {totalCount > 0 && (
              <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                <span className='text-sm text-gray-600'>
                  {completedCount} / {totalCount} đã hoàn thành
                </span>
                {completedCount > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleClearCompleted}
                    className='text-gray-500 hover:text-gray-700'
                  >
                    Xóa đã hoàn thành
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='p-4'>
        {totalCount > 0 ? (
          <div className='space-y-4'>
            {Object.entries(groupedItems).map(([category, items]) => {
              const categoryObj = categories.find(
                (cat) => cat.name === category
              );
              const displayName =
                categoryObj?.display_name ||
                category.charAt(0).toUpperCase() + category.slice(1);

              return (
                <Card key={category}>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      {displayName}
                      <Badge variant='secondary'>{items.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50'
                        >
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleItem(item.id)}
                          />
                          <div
                            className={`flex-1 ${
                              item.completed ? 'line-through text-gray-500' : ''
                            }`}
                          >
                            <span className='font-medium'>{item.name}</span>
                            <span className='text-sm text-gray-600 ml-2'>
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Badge variant='outline' className='text-xs'>
                              {item.source}
                            </Badge>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-12'>
            <ShoppingCart className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Danh sách mua sắm trống
            </h3>
            <p className='text-gray-500 mb-4'>
              Thêm mặt hàng thủ công hoặc tạo từ kế hoạch bữa ăn
            </p>
            <div className='flex gap-3 justify-center'>
              <AddShoppingItemDialog onAddItem={handleAddItem} />
              <Button variant='outline' onClick={generateFromMealPlans}>
                <RefreshCw className='w-4 h-4 mr-2' />
                Tạo từ bữa ăn
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
