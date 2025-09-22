import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useNutrition } from '@/hooks/use-nutrition';
import { useRecipes } from '@/hooks/use-recipes';
import type { MealDish, MealSource } from '@/types/meal-planning';
import { isDiningDish, isHomeDish } from '@/types/meal-planning';
import {
  ChefHat,
  DollarSign,
  Edit,
  Flame,
  Plus,
  Target,
  Trash2,
  Users,
  Utensils,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface MultiDishEditorProps {
  dishes: MealDish[];
  mode: MealSource;
  onChange: (dishes: MealDish[]) => void;
  maxDishes?: number;
}

interface HomeDishFormData {
  recipeId: string;
  servings: string;
  notes: string;
}

interface DiningDishFormData {
  name: string;
  price: string;
  quantity: string;
  notes: string;
  // Nutrition fields
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
}

type DishFormData = HomeDishFormData | DiningDishFormData;

export function MultiDishEditor({
  dishes,
  mode,
  onChange,
  maxDishes = 10,
}: MultiDishEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MealDish | null>(null);
  const [formData, setFormData] = useState<DishFormData>(
    mode === 'home'
      ? { recipeId: '', servings: '1', notes: '' }
      : {
          name: '',
          price: '',
          quantity: '1',
          notes: '',
          kcal: '',
          protein: '',
          carbs: '',
          fat: '',
        }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { recipes } = useRecipes();
  const { calculateDishesNutrition } = useNutrition();
  const isMobile = useIsMobile();

  // Calculate totals
  const totals = useMemo(() => {
    const dishCount = dishes.length;
    const totalPrice = dishes
      .filter(isDiningDish)
      .reduce((sum, dish) => sum + (dish.price || 0) * (dish.quantity || 1), 0);

    // recipes: Recipe[] where Recipe has image_url: string | null
    const totalNutrition = calculateDishesNutrition(dishes, recipes);

    return { dishCount, totalPrice, totalNutrition };
  }, [dishes, recipes, calculateDishesNutrition]);

  const resetForm = () => {
    setFormData(
      mode === 'home'
        ? { recipeId: '', servings: '1', notes: '' }
        : {
            name: '',
            price: '',
            quantity: '1',
            notes: '',
            kcal: '',
            protein: '',
            carbs: '',
            fat: '',
          }
    );
    setErrors({});
    setEditingDish(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsDialogOpen(open);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'home') {
      const homeData = formData as HomeDishFormData;
      if (!homeData.recipeId) {
        newErrors.recipeId = 'Vui lòng chọn công thức';
      }
      const servings = Number.parseFloat(homeData.servings);
      if (!homeData.servings || Number.isNaN(servings) || servings <= 0) {
        newErrors.servings = 'Vui lòng nhập số khẩu phần hợp lệ';
      }
    } else {
      const diningData = formData as DiningDishFormData;
      if (!diningData.name.trim()) {
        newErrors.name = 'Vui lòng nhập tên món ăn';
      }
      if (diningData.price) {
        const price = Number.parseFloat(diningData.price);
        if (Number.isNaN(price) || price < 0) {
          newErrors.price = 'Vui lòng nhập giá hợp lệ';
        }
      }
      if (diningData.quantity) {
        const quantity = Number.parseFloat(diningData.quantity);
        if (Number.isNaN(quantity) || quantity <= 0) {
          newErrors.quantity = 'Vui lòng nhập số lượng hợp lệ';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newDish: MealDish =
      mode === 'home'
        ? {
            id: editingDish?.id || crypto.randomUUID(),
            name:
              recipes.find(
                (r) => r.id === (formData as HomeDishFormData).recipeId
              )?.name || '',
            recipeId: (formData as HomeDishFormData).recipeId,
            servings: Number.parseFloat(
              (formData as HomeDishFormData).servings
            ),
            notes: (formData as HomeDishFormData).notes,
            // Note: nutrition data should come from an external source or be calculated separately
          }
        : {
            id: editingDish?.id || crypto.randomUUID(),
            name: (formData as DiningDishFormData).name,
            price: (formData as DiningDishFormData).price
              ? Number.parseFloat((formData as DiningDishFormData).price)
              : undefined,
            quantity: (formData as DiningDishFormData).quantity
              ? Number.parseFloat((formData as DiningDishFormData).quantity)
              : undefined,
            notes: (formData as DiningDishFormData).notes,
            nutrition: {
              kcal: (formData as DiningDishFormData).kcal
                ? Number.parseFloat((formData as DiningDishFormData).kcal)
                : undefined,
              protein: (formData as DiningDishFormData).protein
                ? Number.parseFloat((formData as DiningDishFormData).protein)
                : undefined,
              carbs: (formData as DiningDishFormData).carbs
                ? Number.parseFloat((formData as DiningDishFormData).carbs)
                : undefined,
              fat: (formData as DiningDishFormData).fat
                ? Number.parseFloat((formData as DiningDishFormData).fat)
                : undefined,
            },
          };

    if (editingDish) {
      onChange(dishes.map((d) => (d.id === editingDish.id ? newDish : d)));
    } else {
      onChange([...dishes, newDish]);
    }

    handleDialogOpenChange(false);
  };

  const handleEdit = (dish: MealDish) => {
    setEditingDish(dish);
    if (isHomeDish(dish)) {
      setFormData({
        recipeId: dish.recipeId,
        servings: dish.servings.toString(),
        notes: dish.notes || '',
      });
    } else {
      setFormData({
        name: dish.name,
        price: dish.price?.toString() || '',
        quantity: dish.quantity?.toString() || '',
        notes: dish.notes || '',
        kcal: dish.nutrition?.kcal?.toString() || '',
        protein: dish.nutrition?.protein?.toString() || '',
        carbs: dish.nutrition?.carbs?.toString() || '',
        fat: dish.nutrition?.fat?.toString() || '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (dishId: string) => {
    onChange(dishes.filter((d) => d.id !== dishId));
  };

  const getRecipeDisplayName = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    return recipe?.name || 'Công thức không xác định';
  };

  const canAddMoreDishes = dishes.length < maxDishes;

  return (
    <div className='space-y-4'>
      {/* Header with totals */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h3 className='text-lg font-semibold flex items-center gap-2'>
            {mode === 'home' ? (
              <>
                <ChefHat className='w-5 h-5' />
                Món ăn tự nấu ({totals.dishCount})
              </>
            ) : (
              <>
                <Utensils className='w-5 h-5' />
                Món ăn ngoài ({totals.dishCount})
              </>
            )}
          </h3>

          {mode === 'dining_out' && totals.totalPrice > 0 && (
            <Badge variant='secondary' className='flex items-center gap-1'>
              <DollarSign className='w-3 h-3' />
              {totals.totalPrice.toLocaleString('vi-VN')}₫
            </Badge>
          )}

          {totals.totalNutrition.kcal > 0 && (
            <div className='flex gap-2'>
              <Badge variant='outline' className='flex items-center gap-1'>
                <Flame className='w-3 h-3' />
                {Math.round(totals.totalNutrition.kcal)}kcal
              </Badge>
              {totals.totalNutrition.protein > 0 && (
                <Badge variant='outline' className='flex items-center gap-1'>
                  <Target className='w-3 h-3' />
                  {Math.round(totals.totalNutrition.protein)}g protein
                </Badge>
              )}
              {!totals.totalNutrition.hasCompleteData && (
                <Badge variant='secondary' className='flex items-center gap-1'>
                  <Target className='w-3 h-3' />
                  Ước tính
                </Badge>
              )}
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              size='sm'
              disabled={!canAddMoreDishes}
              className='flex items-center gap-2'
            >
              <Plus className='w-4 h-4' />
              Thêm món
            </Button>
          </DialogTrigger>

          <DialogContent
            className={isMobile ? 'max-w-[95vw]' : 'sm:max-w-[500px]'}
          >
            <DialogHeader>
              <DialogTitle>
                {editingDish ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}
              </DialogTitle>
              <DialogDescription>
                {mode === 'home'
                  ? 'Chọn công thức và số khẩu phần cho món ăn tự nấu.'
                  : 'Nhập thông tin cho món ăn tại nhà hàng.'}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              {mode === 'home' ? (
                /* Home Dish Form */
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='recipe'>Công thức *</Label>
                    <Select
                      value={(formData as HomeDishFormData).recipeId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, recipeId: value })
                      }
                    >
                      <SelectTrigger
                        className={errors.recipeId ? 'border-destructive' : ''}
                      >
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
                      <p className='text-sm text-destructive'>
                        {errors.recipeId}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='servings'>Số khẩu phần *</Label>
                    <Input
                      id='servings'
                      type='number'
                      min='0.5'
                      step='0.5'
                      value={(formData as HomeDishFormData).servings}
                      onChange={(e) =>
                        setFormData({ ...formData, servings: e.target.value })
                      }
                      className={errors.servings ? 'border-destructive' : ''}
                      placeholder='1'
                    />
                    {errors.servings && (
                      <p className='text-sm text-destructive'>
                        {errors.servings}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* Dining Dish Form */
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Tên món ăn *</Label>
                    <Input
                      id='name'
                      value={(formData as DiningDishFormData).name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
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
                        value={(formData as DiningDishFormData).price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className={errors.price ? 'border-destructive' : ''}
                        placeholder='0'
                      />
                      {errors.price && (
                        <p className='text-sm text-destructive'>
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='quantity'>Số lượng</Label>
                      <Input
                        id='quantity'
                        type='number'
                        min='0.1'
                        step='0.1'
                        value={(formData as DiningDishFormData).quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        className={errors.quantity ? 'border-destructive' : ''}
                        placeholder='1'
                      />
                      {errors.quantity && (
                        <p className='text-sm text-destructive'>
                          {errors.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nutrition Information Section */}
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
                          value={(formData as DiningDishFormData).kcal}
                          onChange={(e) =>
                            setFormData({ ...formData, kcal: e.target.value })
                          }
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
                          value={(formData as DiningDishFormData).protein}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              protein: e.target.value,
                            })
                          }
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
                          value={(formData as DiningDishFormData).carbs}
                          onChange={(e) =>
                            setFormData({ ...formData, carbs: e.target.value })
                          }
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
                          value={(formData as DiningDishFormData).fat}
                          onChange={(e) =>
                            setFormData({ ...formData, fat: e.target.value })
                          }
                          placeholder='0'
                        />
                      </div>
                    </div>

                    <p className='text-xs text-muted-foreground'>
                      Nhập thông tin dinh dưỡng để theo dõi tổng calo và chất
                      dinh dưỡng. Bạn có thể để trống nếu không biết chính xác.
                    </p>
                  </div>
                </>
              )}

              <div className='space-y-2'>
                <Label htmlFor='notes'>Ghi chú</Label>
                <Textarea
                  id='notes'
                  value={'notes' in formData ? formData.notes : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder='Thêm ghi chú cho món ăn...'
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => handleDialogOpenChange(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleSubmit}>
                {editingDish ? 'Cập nhật' : 'Thêm món'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dishes List */}
      {dishes.length === 0 ? (
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
      ) : (
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
                            {(dish.price * dish.quantity).toLocaleString(
                              'vi-VN'
                            )}
                            ₫
                          </span>
                        )}

                        {/* Show nutrition for dining dishes if available */}
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
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleEdit(dish)}
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDelete(dish.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!canAddMoreDishes && (
        <p className='text-sm text-muted-foreground text-center'>
          Đã đạt giới hạn tối đa {maxDishes} món ăn.
        </p>
      )}
    </div>
  );
}
