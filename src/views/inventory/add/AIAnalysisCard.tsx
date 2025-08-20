import { ImageUpload } from '@/components/image-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import type { AIAnalyzedFoodItem } from '@/lib/gemini-client';
import { Info, Loader2, Sparkles } from 'lucide-react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import type { InventoryFormValues } from './types';

export default function AIAnalysisCard({
  control,
  aiAnalysisLoading,
  aiAnalysisError,
  aiGeneratedInfo,
  onImageReadyForAI,
}: {
  control: Control<InventoryFormValues>;
  aiAnalysisLoading: boolean;
  aiAnalysisError: string | null;
  aiGeneratedInfo: AIAnalyzedFoodItem | null;
  onImageReadyForAI: (base64Image: string, mimeType: string) => Promise<void>;
}) {
  return (
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
            field: ControllerRenderProps<InventoryFormValues, 'imageUrl'>;
          }) => {
            return (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    currentImageUrl={field.value}
                    onImageUpload={(url) => field.onChange(url)}
                    onImageRemove={() => field.onChange('')}
                    onImageReadyForAI={async (b64, mime) => {
                      // Keep image value in form (retain current value)
                      field.onChange(field.value);
                      await onImageReadyForAI(b64, mime);
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
                <div className='font-medium'>Tên:</div>
                <p>{aiGeneratedInfo.name}</p>
              </div>
              <div>
                <div className='font-medium'>Mô tả:</div>
                <p>{aiGeneratedInfo.description}</p>
              </div>
              <div>
                <div className='font-medium'>Danh mục:</div>
                <p className='capitalize'>{aiGeneratedInfo.category}</p>
              </div>
              <div>
                <div className='font-medium'>
                  Thông tin dinh dưỡng (trên 100g):
                </div>
                <ul className='list-disc list-inside ml-4'>
                  <li>Calo: {aiGeneratedInfo.caloriesPer100g}</li>
                  <li>Protein: {aiGeneratedInfo.macronutrients.protein}</li>
                  <li>
                    Carbohydrate: {aiGeneratedInfo.macronutrients.carbohydrates}
                  </li>
                  <li>Chất béo: {aiGeneratedInfo.macronutrients.fat}</li>
                </ul>
              </div>
              {aiGeneratedInfo.keyIngredients.length > 0 && (
                <div>
                  <div className='font-medium'>Thành phần chính:</div>
                  <p>{aiGeneratedInfo.keyIngredients.join(', ')}</p>
                </div>
              )}
            </div>
            <Alert>
              <Info className='h-4 w-4' />
              <AlertDescription>
                Các trường bên dưới đã được điền sẵn với dữ liệu do AI tạo. Vui
                lòng xem xét và chỉnh sửa khi cần.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
