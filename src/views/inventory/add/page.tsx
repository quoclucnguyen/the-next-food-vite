import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCategories } from '@/hooks/use-categories';
import { useFoodItems } from '@/hooks/use-food-items';
import { useSettings } from '@/hooks/use-settings';
import { useUnits } from '@/hooks/use-units';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import AIAnalysisCard from './AIAnalysisCard';
import HeaderBar from './HeaderBar';
import ItemDetailsCard from './ItemDetailsCard';
import type { InventoryFormValues } from './types';
import useAiImageAnalysis from './useAiImageAnalysis';

export default function AddItemPage() {
  const navigate = useNavigate();
  const { settings, hasGeminiApiKey, getSelectedGeminiModel } = useSettings();

  const {
    categories,
    isLoading: categoriesLoading,
    addCategory,
  } = useCategories();
  const { units, isLoading: unitsLoading, addUnit } = useUnits();
  const todayStr = new Date().toLocaleDateString('en-CA');
  const QUANTITY_MAX = 100000;

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

  const {
    handleImageReadyForAI,
    aiAnalysisLoading,
    aiAnalysisError,
    aiGeneratedInfo,
  } = useAiImageAnalysis({
    setValue,
    categories,
    units,
    addCategory,
    addUnit,
    settings,
    hasGeminiApiKey,
    getSelectedGeminiModel,
  });

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
        refetch();
      }
    }
  }, [isEditMode, id, items, refetch, reset]);

  const onSubmit = async (values: InventoryFormValues) => {
    if (!values.name.trim()) return;
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
      <HeaderBar isEditMode={isEditMode} />

      <div className='p-4'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <AIAnalysisCard
              control={control}
              aiAnalysisLoading={aiAnalysisLoading}
              aiAnalysisError={aiAnalysisError}
              aiGeneratedInfo={aiGeneratedInfo}
              onImageReadyForAI={handleImageReadyForAI}
            />

            <ItemDetailsCard
              control={control}
              units={units}
              unitsLoading={unitsLoading}
              categories={categories}
              categoriesLoading={categoriesLoading}
              todayStr={todayStr}
              QUANTITY_MAX={QUANTITY_MAX}
            />

            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='w-full bg-transparent'
                onClick={() => navigate('/inventory')}
              >
                Hủy
              </Button>
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
