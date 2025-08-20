import { ImageUpload } from '@/components/image-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/use-categories';
import { useFoodItems } from '@/hooks/use-food-items';
import { useSettings } from '@/hooks/use-settings';
import { useUnits } from '@/hooks/use-units';
import { GeminiClient, type AIAnalyzedFoodItem } from '@/lib/gemini-client';
import { ArrowLeft, Info, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type InventoryFormValues = {
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string;
  category: string;
  imageUrl?: string;
};

export default function AddItemPage() {
  const navigate = useNavigate();
  const { settings, hasGeminiApiKey, getSelectedGeminiModel } = useSettings();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { units, isLoading: unitsLoading } = useUnits();
  const todayStr = new Date().toLocaleDateString('en-CA');
  const QUANTITY_MAX = 100000;

  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);
  const [aiGeneratedInfo, setAiGeneratedInfo] =
    useState<AIAnalyzedFoodItem | null>(null);

  const { items, refetch, addItem, updateItem } = useFoodItems();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const form = useForm<InventoryFormValues>({
    defaultValues: {
      name: '',
      quantity: 0,
      unit: '',
      expirationDate: '',
      category: '',
      imageUrl: '',
    },
  });
  const { reset, setValue, handleSubmit, control } = form;

  // Prefill form when editing and items are available
  useEffect(() => {
    if (!isEditMode) return;
    if (items && items.length > 0) {
      const existing = items.find(
        (it) => String((it as { id: unknown }).id) === String(id)
      );
      if (existing) {
        reset({
          name: existing.name || '',
          quantity: existing.quantity ?? 0,
          unit: existing.unit || '',
          expirationDate: existing.expiration_date || '',
          category: existing.category || '',
          imageUrl: existing.image_url || '',
        });
      } else {
        // If not found try refetching
        refetch();
      }
    }
  }, [isEditMode, id, items, refetch, reset]);

  const handleImageReadyForAI = async (
    base64Image: string,
    mimeType: string
  ) => {
    if (!hasGeminiApiKey || !settings.geminiApiKey) {
      setAiAnalysisError(
        'Khóa API Gemini chưa được cấu hình. Vui lòng thiết lập trong Cài đặt để kích hoạt phân tích AI.'
      );
      return;
    }

    setAiAnalysisLoading(true);
    setAiAnalysisError(null);
    setAiGeneratedInfo(null);

    try {
      const selectedModel = getSelectedGeminiModel();

      if (!selectedModel) {
        setAiAnalysisError(
          'Chưa chọn mô hình AI. Vui lòng vào Cài đặt và chọn mô hình Gemini để kích hoạt phân tích AI.'
        );
        return;
      }

      const geminiClient = new GeminiClient(
        settings.geminiApiKey,
        selectedModel
      );
      const result = await geminiClient.analyzeFoodImage(base64Image, mimeType);

      if (result.success && result.data) {
        const data = result.data as AIAnalyzedFoodItem;
        setAiGeneratedInfo(data);
        // Pre-fill form fields with AI-generated data
        if (data.name) {
          setValue('name', data.name);
        }
        if (
          data.category &&
          categories.some((cat) => cat.name === data.category.toLowerCase())
        ) {
          setValue('category', data.category.toLowerCase());
        }
      } else {
        setAiAnalysisError(
          result.error || 'Không thể phân tích hình ảnh bằng AI.'
        );
      }
    } catch (error: unknown) {
      setAiAnalysisError(
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi không mong muốn trong quá trình phân tích AI.'
      );
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const onSubmit = async (values: InventoryFormValues) => {
    // Basic validations that complement react-hook-form rules
    if (!values.name.trim()) {
      // should be handled by RHF, guard nonetheless
      return;
    }
    try {
      if (isEditMode && id) {
        await updateItem({
          id: String(id),
          updates: {
            name: values.name,
            quantity: values.quantity,
            unit: values.unit,
            expiration_date: values.expirationDate,
            category: values.category,
            image_url: values.imageUrl || undefined,
          },
        });
      } else {
        await addItem({
          name: values.name,
          quantity: values.quantity,
          unit: values.unit,
          expiration_date: values.expirationDate,
          category: values.category,
          image_url: values.imageUrl || undefined,
        });
      }

      navigate('/inventory');
    } catch (error) {
      console.error('Failed to save item:', error);
      alert(
        isEditMode
          ? 'Không thể cập nhật mặt hàng. Vui lòng thử lại.'
          : 'Không thể thêm mặt hàng. Vui lòng thử lại.'
      );
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center gap-3'>
            <Link to='/inventory'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
            </Link>
            <h1 className='text-xl font-bold text-gray-900'>
              {isEditMode ? 'Chỉnh sửa thực phẩm' : 'Thêm thực phẩm'}
            </h1>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Ảnh & Phân tích AI</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name='imageUrl'
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      InventoryFormValues,
                      'imageUrl'
                    >;
                  }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            currentImageUrl={field.value}
                            onImageUpload={(url) => field.onChange(url)}
                            onImageRemove={() => field.onChange('')}
                            onImageReadyForAI={async (b64, mime) => {
                              // Keep image value in form
                              field.onChange(field.value);
                              await handleImageReadyForAI(b64, mime);
                            }}
                            type='food-item'
                            disabled={aiAnalysisLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {aiAnalysisLoading && (
                  <div className='flex items-center justify-center py-4 text-gray-600'>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    Đang phân tích hình ảnh bằng AI...
                  </div>
                )}

                {aiAnalysisError && (
                  <Alert variant='destructive' className='mt-4'>
                    <Info className='h-4 w-4' />
                    <AlertDescription>{aiAnalysisError}</AlertDescription>
                  </Alert>
                )}

                {aiGeneratedInfo && (
                  <div className='mt-6 space-y-4'>
                    <h3 className='font-semibold text-lg flex items-center gap-2'>
                      <Sparkles className='w-5 h-5 text-blue-600' />
                      Thông tin do AI tạo
                    </h3>
                    <div className='space-y-2 text-sm'>
                      <div>
                        <Label className='font-medium'>Tên:</Label>
                        <p>{aiGeneratedInfo.name}</p>
                      </div>
                      <div>
                        <Label className='font-medium'>Mô tả:</Label>
                        <p>{aiGeneratedInfo.description}</p>
                      </div>
                      <div>
                        <Label className='font-medium'>Danh mục:</Label>
                        <p className='capitalize'>{aiGeneratedInfo.category}</p>
                      </div>
                      <div>
                        <Label className='font-medium'>
                          Thông tin dinh dưỡng (trên 100g):
                        </Label>
                        <ul className='list-disc list-inside ml-4'>
                          <li>Calo: {aiGeneratedInfo.caloriesPer100g}</li>
                          <li>
                            Protein: {aiGeneratedInfo.macronutrients.protein}
                          </li>
                          <li>
                            Carbohydrate:{' '}
                            {aiGeneratedInfo.macronutrients.carbohydrates}
                          </li>
                          <li>
                            Chất béo: {aiGeneratedInfo.macronutrients.fat}
                          </li>
                        </ul>
                      </div>
                      {aiGeneratedInfo.keyIngredients.length > 0 && (
                        <div>
                          <Label className='font-medium'>
                            Thành phần chính:
                          </Label>
                          <p>{aiGeneratedInfo.keyIngredients.join(', ')}</p>
                        </div>
                      )}
                    </div>
                    <Alert>
                      <Info className='h-4 w-4' />
                      <AlertDescription>
                        Các trường bên dưới đã được điền sẵn với dữ liệu do AI
                        tạo. Vui lòng xem xét và chỉnh sửa khi cần.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết mặt hàng</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='name'>Tên mặt hàng</FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          placeholder='ví dụ: Chuối, Sữa, Ức gà'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{
                    required: 'Vui lòng nhập tên mặt hàng',
                  }}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={control}
                    name='quantity'
                    rules={{
                      required: 'Số lượng phải lớn hơn 0',
                      min: {
                        value: 0.000001,
                        message: 'Số lượng phải lớn hơn 0',
                      },
                      max: {
                        value: QUANTITY_MAX,
                        message: `Số lượng quá lớn (tối đa ${QUANTITY_MAX})`,
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='quantity'>Số lượng</FormLabel>
                        <FormControl>
                          <Input
                            id='quantity'
                            type='number'
                            step='0.1'
                            min='0.1'
                            max={QUANTITY_MAX}
                            placeholder='1.5'
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const parsed = parseFloat(e.target.value);
                              const value = isNaN(parsed) ? 0 : parsed;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name='unit'
                    rules={{ required: 'Vui lòng chọn đơn vị' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor='unit'>Đơn vị</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(v: string) => field.onChange(v)}
                            disabled={unitsLoading}
                          >
                            <SelectTrigger
                              className={field.value ? '' : ''}
                              aria-invalid={!!field}
                            >
                              <SelectValue
                                placeholder={
                                  unitsLoading
                                    ? 'Đang tải đơn vị...'
                                    : 'Chọn đơn vị'
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem
                                  key={unit.id}
                                  value={unit.name.toLocaleLowerCase()}
                                >
                                  {unit.display_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name='category'
                  rules={{ required: 'Vui lòng chọn danh mục' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='category'>Danh mục</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(v: string) => field.onChange(v)}
                          disabled={categoriesLoading}
                        >
                          <SelectTrigger aria-invalid={!!field}>
                            <SelectValue
                              placeholder={
                                categoriesLoading
                                  ? 'Đang tải danh mục...'
                                  : 'Chọn danh mục'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.display_name.toLocaleLowerCase()}
                              >
                                {category.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name='expirationDate'
                  rules={{
                    required: 'Vui lòng chọn ngày hết hạn',
                    validate: (val) =>
                      !val ||
                      val >= todayStr ||
                      'Ngày hết hạn không được ở quá khứ',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='expirationDate'>
                        Ngày hết hạn
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='expirationDate'
                          type='date'
                          min={todayStr}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className='flex gap-3'>
              <Link to='/inventory' className='flex-1'>
                <Button variant='outline' className='w-full bg-transparent'>
                  Hủy
                </Button>
              </Link>
              <Button
                type='submit'
                className='flex-1'
                disabled={aiAnalysisLoading}
              >
                {isEditMode ? 'Cập nhật' : 'Thêm mặt hàng'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
