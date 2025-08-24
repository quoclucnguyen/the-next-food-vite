import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMealPlans } from '@/hooks/use-meal-plans';
import type { MealDish, MealPlan, MealSource } from '@/types/meal-planning';
import {
  AlertTriangle,
  Calendar,
  ChefHat,
  Clock,
  Loader2,
  Utensils,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MultiDishEditor } from './multi-dish-editor';
import { RestaurantPicker } from './restaurant-picker';

// Form validation interface
interface MealPlanFormData {
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  source: MealSource;
  restaurantId: string;
  dishes: MealDish[];
}

interface ValidationErrors {
  date?: string;
  meal_type?: string;
  source?: string;
  restaurantId?: string;
  dishes?: string;
  general?: string;
}

interface EditMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealPlan?: MealPlan | null;
  existingMealPlans?: MealPlan[];
}

const mealTypeLabels = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
};

const mealTypeDescriptions = {
  breakfast: 'Bữa ăn sáng - thường từ 6:00-9:00',
  lunch: 'Bữa ăn trưa - thường từ 11:00-14:00',
  dinner: 'Bữa ăn tối - thường từ 17:00-21:00',
};

export function EditMealDialog({
  open,
  onOpenChange,
  mealPlan,
  existingMealPlans = [],
}: EditMealDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createMealPlan, updateMealPlan } = useMealPlans();
  const isEdit = !!mealPlan;

  const form = useForm<MealPlanFormData>({
    defaultValues: {
      date: '',
      meal_type: 'breakfast',
      source: 'home',
      restaurantId: '',
      dishes: [],
    },
  });

  // Custom validation function
  const validateForm = (data: MealPlanFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.date.trim()) {
      errors.date = 'Vui lòng chọn ngày';
    }

    if (!data.meal_type) {
      errors.meal_type = 'Vui lòng chọn loại bữa ăn';
    }

    if (!data.source) {
      errors.source = 'Vui lòng chọn nguồn bữa ăn';
    }

    if (data.dishes.length === 0) {
      errors.dishes = 'Phải có ít nhất một món ăn';
    }

    return errors;
  };

  const watchedSource = form.watch('source');
  const watchedDate = form.watch('date');
  const watchedMealType = form.watch('meal_type');
  const watchedDishes = form.watch('dishes');

  // Check for duplicate meal plans (unique constraint: date + meal_type)
  const duplicateError =
    watchedDate && watchedMealType
      ? existingMealPlans.find(
          (plan) =>
            plan.date === watchedDate &&
            plan.meal_type === watchedMealType &&
            plan.id !== mealPlan?.id
        )
      : null;

  // Reset form when dialog opens/closes or meal plan changes
  useEffect(() => {
    if (open) {
      if (mealPlan) {
        // Edit mode
        form.reset({
          date: mealPlan.date,
          meal_type: mealPlan.meal_type,
          source: mealPlan.source,
          restaurantId: mealPlan.restaurantId || '',
          dishes: mealPlan.dishes,
        });
      } else {
        // Create mode
        const today = new Date().toISOString().split('T')[0];
        form.reset({
          date: today,
          meal_type: 'breakfast',
          source: 'home',
          restaurantId: '',
          dishes: [],
        });
      }
      setError(null);
    }
  }, [open, mealPlan, form]);

  // Clear restaurant ID when switching to home source
  useEffect(() => {
    if (watchedSource === 'home') {
      form.setValue('restaurantId', '');
    }
  }, [watchedSource, form]);

  const handleDishesChange = (dishes: MealDish[]) => {
    form.setValue('dishes', dishes);
  };

  const handleRestaurantChange = (restaurantId: string) => {
    form.setValue('restaurantId', restaurantId);
  };

  const handleSubmit = async (data: MealPlanFormData) => {
    // Validate form data
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      // Set form errors
      Object.entries(validationErrors).forEach(([field, message]) => {
        form.setError(field as keyof MealPlanFormData, { message });
      });
      return;
    }

    if (duplicateError) {
      setError(
        `Đã có kế hoạch cho ${
          mealTypeLabels[duplicateError.meal_type]
        } vào ngày ${new Date(duplicateError.date).toLocaleDateString('vi-VN')}`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mealPlanInput = {
        date: data.date,
        meal_type: data.meal_type,
        source: data.source,
        restaurantId:
          data.source === 'dining_out' ? data.restaurantId : undefined,
        dishes: data.dishes,
      };

      if (isEdit && mealPlan) {
        await updateMealPlan({
          id: mealPlan.id,
          ...mealPlanInput,
        });
      } else {
        await createMealPlan(mealPlanInput);
      }

      onOpenChange(false);
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError(
        isEdit
          ? 'Không thể cập nhật kế hoạch bữa ăn. Vui lòng thử lại.'
          : 'Không thể tạo kế hoạch bữa ăn. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid
  const formErrors = form.formState.errors;
  const hasFormErrors = Object.keys(formErrors).length > 0;
  const isFormValid =
    !hasFormErrors && watchedDishes.length > 0 && !duplicateError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {isEdit ? (
              <>
                <Utensils className='w-5 h-5' />
                Chỉnh sửa bữa ăn
              </>
            ) : (
              <>
                <ChefHat className='w-5 h-5' />
                Thêm bữa ăn mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Cập nhật thông tin cho bữa ăn của bạn.'
              : 'Tạo kế hoạch bữa ăn mới cho ngày hôm nay.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='meal-plan-form'
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6 flex-1 overflow-y-auto'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Date Selection */}
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      Ngày
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        className={duplicateError ? 'border-destructive' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meal Type Selection */}
              <FormField
                control={form.control}
                name='meal_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'>
                      <Clock className='w-4 h-4' />
                      Loại bữa ăn
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={duplicateError ? 'border-destructive' : ''}
                        >
                          <SelectValue placeholder='Chọn loại bữa ăn' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(mealTypeLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              <div>
                                <div className='font-medium'>{label}</div>
                                <div className='text-xs text-muted-foreground'>
                                  {
                                    mealTypeDescriptions[
                                      value as keyof typeof mealTypeDescriptions
                                    ]
                                  }
                                </div>
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duplicate Warning */}
            {duplicateError && (
              <Alert variant='destructive'>
                <AlertTriangle className='w-4 h-4' />
                <AlertDescription>
                  Đã có kế hoạch cho {mealTypeLabels[duplicateError.meal_type]}{' '}
                  vào ngày{' '}
                  {new Date(duplicateError.date).toLocaleDateString('vi-VN')}.
                  Vui lòng chọn ngày hoặc loại bữa ăn khác.
                </AlertDescription>
              </Alert>
            )}

            {/* Meal Source Selection */}
            <FormField
              control={form.control}
              name='source'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Nguồn bữa ăn</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='grid grid-cols-1 md:grid-cols-2 gap-4'
                    >
                      <div className='flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent'>
                        <RadioGroupItem value='home' id='home' />
                        <label
                          htmlFor='home'
                          className='flex items-center gap-3 cursor-pointer flex-1'
                        >
                          <ChefHat className='w-5 h-5 text-green-600' />
                          <div>
                            <div className='font-medium'>Nấu tại nhà</div>
                            <div className='text-sm text-muted-foreground'>
                              Sử dụng công thức nấu ăn
                            </div>
                          </div>
                        </label>
                      </div>

                      <div className='flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent'>
                        <RadioGroupItem value='dining_out' id='dining_out' />
                        <label
                          htmlFor='dining_out'
                          className='flex items-center gap-3 cursor-pointer flex-1'
                        >
                          <Utensils className='w-5 h-5 text-blue-600' />
                          <div>
                            <div className='font-medium'>Ăn tại nhà hàng</div>
                            <div className='text-sm text-muted-foreground'>
                              Chọn nhà hàng và món ăn
                            </div>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Restaurant Picker - Only show for dining_out */}
            {watchedSource === 'dining_out' && (
              <div className='space-y-2'>
                <FormLabel>Chọn nhà hàng</FormLabel>
                <RestaurantPicker
                  value={form.getValues('restaurantId')}
                  onChange={handleRestaurantChange}
                  placeholder='Chọn nhà hàng cho bữa ăn...'
                  showDetails={true}
                />
              </div>
            )}

            {/* Dishes Editor */}
            <FormField
              control={form.control}
              name='dishes'
              render={() => (
                <FormItem>
                  <FormLabel>Món ăn</FormLabel>
                  <FormControl>
                    <MultiDishEditor
                      dishes={watchedDishes}
                      mode={watchedSource}
                      onChange={handleDishesChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Display */}
            {error && (
              <Alert variant='destructive'>
                <AlertTriangle className='w-4 h-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>

        <DialogFooter className='border-t pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            disabled={!isFormValid || loading}
            className='min-w-[120px]'
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                {isEdit ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : isEdit ? (
              'Cập nhật'
            ) : (
              'Tạo bữa ăn'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
