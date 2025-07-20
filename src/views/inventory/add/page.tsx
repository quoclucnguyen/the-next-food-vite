import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useFoodItems } from '@/hooks/use-food-items';
import { useCategories } from '@/hooks/use-categories';
import { useUnits } from '@/hooks/use-units';
import { ImageUpload } from '@/components/image-upload';
import { useSettings } from '@/hooks/use-settings';
import { GeminiClient, type AIAnalyzedFoodItem } from '@/lib/gemini-client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AddItemPage() {
  const navigate = useNavigate();
  const { settings, hasGeminiApiKey, getSelectedGeminiModel } = useSettings();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { units, isLoading: unitsLoading } = useUnits();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0, // Changed from empty string to number
    unit: '',
    expirationDate: '',
    category: '',
    imageUrl: '',
  });

  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);
  const [aiGeneratedInfo, setAiGeneratedInfo] =
    useState<AIAnalyzedFoodItem | null>(null);

  const { addItem } = useFoodItems();

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
        setFormData((prev) => ({
          ...prev,
          name: data.name || prev.name,
          category:
            data.category &&
            categories.some((cat) => cat.name === data.category.toLowerCase())
              ? data.category.toLowerCase()
              : prev.category,
        }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.quantity ||
      !formData.unit ||
      !formData.expirationDate ||
      !formData.category
    ) {
      return;
    }

    try {
      await addItem({
        name: formData.name,
        quantity: formData.quantity, // Using the number directly
        unit: formData.unit,
        expiration_date: formData.expirationDate,
        category: formData.category,
        image_url: formData.imageUrl || undefined,
      });

      navigate('/inventory');
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Không thể thêm mặt hàng. Vui lòng thử lại.');
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
            <h1 className='text-xl font-bold text-gray-900'>Thêm thực phẩm</h1>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh & Phân tích AI</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageUpload={(url) =>
                  setFormData({ ...formData, imageUrl: url })
                }
                onImageRemove={() => setFormData({ ...formData, imageUrl: '' })}
                onImageReadyForAI={handleImageReadyForAI}
                type='food-item'
                disabled={aiAnalysisLoading} // Disable upload while AI is processing
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
                        <li>Chất béo: {aiGeneratedInfo.macronutrients.fat}</li>
                      </ul>
                    </div>
                    {aiGeneratedInfo.keyIngredients.length > 0 && (
                      <div>
                        <Label className='font-medium'>Thành phần chính:</Label>
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
              <div>
                <Label htmlFor='name'>Tên mặt hàng</Label>
                <Input
                  id='name'
                  placeholder='ví dụ: Chuối, Sữa, Ức gà'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='quantity'>Số lượng</Label>
                  <Input
                    id='quantity'
                    type='number'
                    step='0.1'
                    placeholder='1.5'
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='unit'>Đơn vị</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, unit: value })
                    }
                    disabled={unitsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          unitsLoading ? 'Đang tải đơn vị...' : 'Chọn đơn vị'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor='category'>Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, category: value })
                  }
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
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
                      <SelectItem key={category.id} value={category.name}>
                        {category.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='expirationDate'>Ngày hết hạn</Label>
                <Input
                  id='expirationDate'
                  type='date'
                  value={formData.expirationDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expirationDate: e.target.value })
                  }
                />
              </div>
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
              Thêm mặt hàng
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
