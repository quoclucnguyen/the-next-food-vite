import { ImageUpload } from '@/components/image-upload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import type { AIAnalyzedCosmeticItem } from '@/lib/gemini-client';
import { Info, Loader2, Sparkles } from 'lucide-react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import type { CosmeticFormValues } from '../types';

type CosmeticAIAnalysisCardProps = {
  control: Control<CosmeticFormValues>;
  aiAnalysisLoading: boolean;
  aiAnalysisError: string | null;
  aiGeneratedInfo: AIAnalyzedCosmeticItem | null;
  onImageReadyForAI: (base64Image: string, mimeType: string) => Promise<void>;
};

export function CosmeticAIAnalysisCard({
  control,
  aiAnalysisLoading,
  aiAnalysisError,
  aiGeneratedInfo,
  onImageReadyForAI,
}: Readonly<CosmeticAIAnalysisCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ảnh & Phân tích AI</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name='image_url'
          render={({
            field,
          }: {
            field: ControllerRenderProps<CosmeticFormValues, 'image_url'>;
          }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  currentImageUrl={field.value}
                  onImageUpload={(url) => field.onChange(url)}
                  onImageRemove={() => field.onChange('')}
                  onImageReadyForAI={async (base64, mime) => {
                    field.onChange(field.value);
                    await onImageReadyForAI(base64, mime);
                  }}
                  type='cosmetic'
                  disabled={aiAnalysisLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
              Thông tin AI gợi ý
            </h3>
            <div className='space-y-2 text-sm'>
              <Detail label='Tên sản phẩm' value={aiGeneratedInfo.name} />
              <Detail label='Thương hiệu' value={aiGeneratedInfo.brand} />
              <Detail label='Danh mục' value={aiGeneratedInfo.category} />
              <Detail
                label='Dung tích/Khối lượng'
                value={aiGeneratedInfo.size}
              />
              <Detail label='Đơn vị' value={aiGeneratedInfo.unit} />
              <Detail label='PAO (tháng)' value={aiGeneratedInfo.paoMonths} />
              <Detail label='Mô tả' value={aiGeneratedInfo.description} />
              <Detail label='Ghi chú' value={aiGeneratedInfo.notes} />
            </div>
            <Alert>
              <Info className='h-4 w-4' />
              <AlertDescription>
                Các trường trên đã được AI điền sẵn. Vui lòng kiểm tra và chỉnh
                sửa nếu cần.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className='font-medium'>{label}</div>
      <p>{value}</p>
    </div>
  );
}
