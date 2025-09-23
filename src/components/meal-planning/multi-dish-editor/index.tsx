import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNutrition } from '@/hooks/use-nutrition';
import { useRecipes } from '@/hooks/use-recipes';
import type { MealDish, MealSource } from '@/types/meal-planning';
import { isDiningDish, isHomeDish } from '@/types/meal-planning';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DishFormDialogContent } from './dish-form-dialog-content';
import { DishList } from './dish-list';
import { createInitialFormState, resetFormState } from './form-state';
import type {
  FormState,
  FormErrors,
  HomeDishFormData,
  DiningDishFormData,
} from './form-state';
import { MultiDishHeader } from './multi-dish-header';

interface MultiDishEditorProps {
  dishes: MealDish[];
  mode: MealSource;
  onChange: (dishes: MealDish[]) => void;
  maxDishes?: number;
}

export function MultiDishEditor({
  dishes,
  mode,
  onChange,
  maxDishes = 10,
}: MultiDishEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MealDish | null>(null);
  const [formState, setFormState] = useState<FormState>(() =>
    createInitialFormState()
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const homeForm = formState.home;
  const diningForm = formState.dining_out;
  const isHomeMode = mode === 'home';

  const updateHomeForm = (updates: Partial<HomeDishFormData>) => {
    setFormState((prev) => ({
      ...prev,
      home: { ...prev.home, ...updates },
    }));
  };

  const updateDiningForm = (updates: Partial<DiningDishFormData>) => {
    setFormState((prev) => ({
      ...prev,
      dining_out: { ...prev.dining_out, ...updates },
    }));
  };

  const { recipes } = useRecipes();
  const { calculateDishesNutrition } = useNutrition();
  const isMobile = useIsMobile();

  const totals = useMemo(() => {
    const dishCount = dishes.length;
    const totalPrice = dishes
      .filter(isDiningDish)
      .reduce((sum, dish) => sum + (dish.price || 0) * (dish.quantity || 1), 0);

    const totalNutrition = calculateDishesNutrition(dishes, recipes);

    return { dishCount, totalPrice, totalNutrition };
  }, [dishes, recipes, calculateDishesNutrition]);

  const resetForm = (targetMode: MealSource = mode) => {
    setFormState((prev) => resetFormState(prev, targetMode));
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
    const newErrors: FormErrors = {};

    if (isHomeMode) {
      if (!homeForm.recipeId) {
        newErrors.recipeId = 'Vui lòng chọn công thức';
      }
      const servings = Number.parseFloat(homeForm.servings);
      if (!homeForm.servings || Number.isNaN(servings) || servings <= 0) {
        newErrors.servings = 'Vui lòng nhập số khẩu phần hợp lệ';
      }
    } else {
      if (!diningForm.name.trim()) {
        newErrors.name = 'Vui lòng nhập tên món ăn';
      }
      if (diningForm.price) {
        const price = Number.parseFloat(diningForm.price);
        if (Number.isNaN(price) || price < 0) {
          newErrors.price = 'Vui lòng nhập giá hợp lệ';
        }
      }
      if (diningForm.quantity) {
        const quantity = Number.parseFloat(diningForm.quantity);
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

    const newDish: MealDish = isHomeMode
      ? {
          id: editingDish?.id || crypto.randomUUID(),
          name: recipes.find((r) => r.id === homeForm.recipeId)?.name || '',
          recipeId: homeForm.recipeId,
          servings: Number.parseFloat(homeForm.servings),
          notes: homeForm.notes,
        }
      : {
          id: editingDish?.id || crypto.randomUUID(),
          name: diningForm.name,
          price: diningForm.price
            ? Number.parseFloat(diningForm.price)
            : undefined,
          quantity: diningForm.quantity
            ? Number.parseFloat(diningForm.quantity)
            : undefined,
          notes: diningForm.notes,
          nutrition: {
            kcal: diningForm.kcal
              ? Number.parseFloat(diningForm.kcal)
              : undefined,
            protein: diningForm.protein
              ? Number.parseFloat(diningForm.protein)
              : undefined,
            carbs: diningForm.carbs
              ? Number.parseFloat(diningForm.carbs)
              : undefined,
            fat: diningForm.fat
              ? Number.parseFloat(diningForm.fat)
              : undefined,
          },
        };

    if (editingDish) {
      onChange(dishes.map((dish) => (dish.id === editingDish.id ? newDish : dish)));
    } else {
      onChange([...dishes, newDish]);
    }

    handleDialogOpenChange(false);
  };

  const handleEdit = (dish: MealDish) => {
    setEditingDish(dish);
    if (isHomeDish(dish)) {
      setFormState((prev) => ({
        ...prev,
        home: {
          recipeId: dish.recipeId,
          servings: dish.servings.toString(),
          notes: dish.notes || '',
        },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        dining_out: {
          name: dish.name,
          price: dish.price?.toString() || '',
          quantity: dish.quantity?.toString() || '',
          notes: dish.notes || '',
          kcal: dish.nutrition?.kcal?.toString() || '',
          protein: dish.nutrition?.protein?.toString() || '',
          carbs: dish.nutrition?.carbs?.toString() || '',
          fat: dish.nutrition?.fat?.toString() || '',
        },
      }));
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (dishId: string) => {
    onChange(dishes.filter((dish) => dish.id !== dishId));
  };

  const getRecipeDisplayName = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    return recipe?.name || 'Công thức không xác định';
  };

  const canAddMoreDishes = dishes.length < maxDishes;

  return (
    <div className='space-y-4'>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <MultiDishHeader
          mode={mode}
          totals={totals}
          action={
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
          }
        />

        <DishFormDialogContent
          mode={mode}
          isMobile={isMobile}
          homeForm={homeForm}
          diningForm={diningForm}
          errors={errors}
          recipes={recipes}
          editingDish={editingDish}
          onCancel={() => handleDialogOpenChange(false)}
          onSubmit={handleSubmit}
          onUpdateHome={updateHomeForm}
          onUpdateDining={updateDiningForm}
        />
      </Dialog>

      <DishList
        dishes={dishes}
        mode={mode}
        getRecipeDisplayName={getRecipeDisplayName}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {!canAddMoreDishes && (
        <p className='text-sm text-muted-foreground text-center'>
          Đã đạt giới hạn tối đa {maxDishes} món ăn.
        </p>
      )}
    </div>
  );
}
