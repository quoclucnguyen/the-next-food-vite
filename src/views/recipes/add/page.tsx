import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Plus, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { ImageUpload } from '@/components/image-upload';
import { useRecipes } from '@/hooks/use-recipes';
import { useSettings } from '@/hooks/use-settings';
import type { AIGeneratedRecipe } from '@/lib/gemini/types';

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    prepTime: '',
    servings: '',
    ingredients: [''],
    instructions: [''],
    imageUrl: '',
  });

  // AI generation state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGeneratedData, setAiGeneratedData] =
    useState<AIGeneratedRecipe | null>(null);

  const { addRecipe } = useRecipes();
  const { settings, hasGeminiApiKey, getSelectedGeminiModel } = useSettings();

  const generateRecipeWithAI = async () => {
    if (!formData.name.trim()) {
      setAiError('Vui lòng nhập tên công thức trước');
      return;
    }

    if (!hasGeminiApiKey || !settings.geminiApiKey) {
      setAiError(
        'Khóa API Gemini chưa được cấu hình. Vui lòng thiết lập trong Cài đặt.'
      );
      return;
    }

    setAiGenerating(true);
    setAiError(null);
    setAiGeneratedData(null);

    try {
      const selectedModel = getSelectedGeminiModel();
      if (!selectedModel) {
        setAiError(
          'Chưa chọn mô hình AI. Vui lòng vào Cài đặt và chọn mô hình Gemini để kích hoạt tạo công thức bằng AI.'
        );
        return;
      }

      // GeminiCoreClient does not implement generateCompleteRecipe.
      setAiError('GeminiCoreClient does not implement generateCompleteRecipe.');
      setAiGeneratedData(null);
    } catch (error: unknown) {
      setAiError(
        error instanceof Error
          ? error.message
          : 'Không thể tạo công thức bằng AI'
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const clearAiData = () => {
    setAiGeneratedData(null);
    setAiError(null);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({
      ...formData,
      ingredients: newIngredients,
    });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, ''],
    });
  };

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({
      ...formData,
      instructions: newInstructions,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.prepTime || !formData.servings) {
      alert('Vui lòng điền vào tất cả các trường bắt buộc');
      return;
    }

    const filteredIngredients = formData.ingredients.filter(
      (ing) => ing.trim() !== ''
    );
    const filteredInstructions = formData.instructions.filter(
      (inst) => inst.trim() !== ''
    );

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      alert('Vui lòng thêm ít nhất một nguyên liệu và một hướng dẫn');
      return;
    }

    try {
      await addRecipe({
        name: formData.name,
        prep_time: Number.parseInt(formData.prepTime),
        servings: Number.parseInt(formData.servings),
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        image_url: formData.imageUrl || undefined,
      });

      navigate('/recipes');
    } catch (error) {
      console.error('Failed to add recipe:', error);
      alert('Không thể thêm công thức. Vui lòng thử lại.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center gap-3'>
            <Link to='/recipes'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
            </Link>
            <h1 className='text-xl font-bold text-gray-900'>Thêm công thức</h1>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Recipe Image */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh công thức</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageUpload={(url) =>
                  setFormData({ ...formData, imageUrl: url })
                }
                onImageRemove={() => setFormData({ ...formData, imageUrl: '' })}
                type='recipe'
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='name'>Tên công thức</Label>
                <div className='flex gap-2'>
                  <Input
                    id='name'
                    placeholder='ví dụ: Mì Ý Carbonara'
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      // Clear AI error when user starts typing
                      if (aiError) setAiError(null);
                    }}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={generateRecipeWithAI}
                    disabled={
                      aiGenerating || !formData.name.trim() || !hasGeminiApiKey
                    }
                    className='shrink-0 min-w-[44px]'
                    aria-label='Tạo công thức bằng AI'
                  >
                    {aiGenerating ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <Sparkles className='w-4 h-4' />
                    )}
                    <span className='hidden sm:inline ml-2'>Tạo bằng AI</span>
                  </Button>
                </div>
                {aiError && (
                  <p className='text-sm text-red-600 mt-1' role='alert'>
                    {aiError}
                  </p>
                )}
                {!hasGeminiApiKey && (
                  <p className='text-sm text-gray-600 mt-1'>
                    Cấu hình khóa API Gemini trong Cài đặt để kích hoạt tạo bằng
                    AI
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='prepTime'>Thời gian chuẩn bị (phút)</Label>
                  <Input
                    id='prepTime'
                    type='number'
                    placeholder='30'
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({ ...formData, prepTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='servings'>Khẩu phần</Label>
                  <Input
                    id='servings'
                    type='number'
                    placeholder='4'
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                  />
                </div>
              </div>

              {aiGeneratedData && (
                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='font-semibold text-lg flex items-center gap-2 text-blue-900'>
                      <Sparkles className='w-5 h-5 text-blue-600' />
                      Chi tiết công thức do AI tạo
                    </h3>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={clearAiData}
                      className='text-blue-600 hover:text-blue-800 hover:bg-blue-100'
                      aria-label='Đóng thông tin do AI tạo'
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                  <div className='space-y-2 text-sm text-blue-800'>
                    {aiGeneratedData.description && (
                      <div>
                        <span className='font-medium'>Mô tả:</span>
                        <p className='mt-1'>{aiGeneratedData.description}</p>
                      </div>
                    )}
                    {aiGeneratedData.difficulty && (
                      <div>
                        <span className='font-medium'>Độ khó:</span>
                        <span className='ml-2'>
                          {aiGeneratedData.difficulty}
                        </span>
                      </div>
                    )}
                    <p className='text-xs text-blue-600 mt-3'>
                      Biểu mẫu đã được điền với nội dung do AI tạo. Bạn có thể
                      chỉnh sửa bất kỳ trường nào khi cần.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Nguyên liệu</CardTitle>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addIngredient}
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      placeholder='ví dụ: 2 cốc bột mì'
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                    />
                    {formData.ingredients.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeIngredient(index)}
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Hướng dẫn</CardTitle>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addInstruction}
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className='flex gap-2'>
                    <div className='flex-1'>
                      <Label className='text-sm text-gray-600'>
                        Bước {index + 1}
                      </Label>
                      <Textarea
                        placeholder='Mô tả bước này...'
                        value={instruction}
                        onChange={(e) =>
                          updateInstruction(index, e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                    {formData.instructions.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeInstruction(index)}
                        className='mt-6'
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='flex gap-3'>
            <Link to='/recipes' className='flex-1'>
              <Button variant='outline' className='w-full bg-transparent'>
                Hủy
              </Button>
            </Link>
            <Button type='submit' className='flex-1'>
              Lưu công thức
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
