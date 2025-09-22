import {
  GeminiFoodService,
  type AIAnalyzedFoodItem,
} from '@/lib/gemini-client';
import type { Database } from '@/lib/supabase';
import { useState } from 'react';
import type { UseFormSetValue } from 'react-hook-form';
import type { InventoryFormValues } from './types';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type Unit = Database['public']['Tables']['units']['Row'];
type UnitInsert = Database['public']['Tables']['units']['Insert'];

export default function useAiImageAnalysis({
  setValue,
  categories,
  units,
  addCategory,
  addUnit,
  settings,
  hasGeminiApiKey,
  getSelectedGeminiModel,
}: {
  setValue: UseFormSetValue<InventoryFormValues>;
  categories: Category[];
  units: Unit[];
  addCategory?: (payload: Omit<CategoryInsert, 'user_id'>) => Promise<Category>;
  addUnit?: (payload: Omit<UnitInsert, 'user_id'>) => Promise<Unit>;
  settings: { geminiApiKey?: string; preferences?: Record<string, unknown> };
  hasGeminiApiKey: boolean;
  getSelectedGeminiModel: () => string | null;
}) {
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);
  const [aiGeneratedInfo, setAiGeneratedInfo] =
    useState<AIAnalyzedFoodItem | null>(null);

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

      const geminiClient = new GeminiFoodService(
        settings.geminiApiKey,
        selectedModel
      );
      const result = await geminiClient.analyzeFoodImage(base64Image, mimeType);

      if (result.success && result.data) {
        const data = result.data as AIAnalyzedFoodItem;
        setAiGeneratedInfo(data);

        const normalize = (s?: string) =>
          (s || '').toString().trim().toLowerCase();

        if (data.name) {
          setValue('name', data.name);
        }

        if (data.category) {
          const catNorm = normalize(data.category);
          const existingCategory = categories.find(
            (cat) =>
              normalize(cat.name) === catNorm ||
              normalize(cat.display_name) === catNorm
          );

          try {
            if (!existingCategory && typeof addCategory === 'function') {
              const created = await addCategory({
                name: catNorm,
                display_name: data.category,
              });
              setValue(
                'category',
                (created?.display_name || data.category).toLowerCase()
              );
            } else {
              setValue(
                'category',
                (existingCategory?.display_name || data.category).toLowerCase()
              );
            }
          } catch (err: unknown) {
            setValue('category', data.category.toLowerCase());
            setAiAnalysisError(
              err instanceof Error
                ? err.message
                : 'Không thể thêm danh mục vào cơ sở dữ liệu.'
            );
          }
        }

        if (data.unit) {
          const unitNorm = normalize(data.unit);
          const existingUnit = units.find(
            (u) =>
              normalize(u.name) === unitNorm ||
              normalize(u.display_name) === unitNorm
          );

          try {
            if (!existingUnit && typeof addUnit === 'function') {
              const createdUnit = await addUnit({
                name: unitNorm,
                display_name: data.unit,
              });
              setValue('unit', (createdUnit?.name || unitNorm).toLowerCase());
            } else {
              setValue('unit', (existingUnit?.name || data.unit).toLowerCase());
            }
          } catch (err: unknown) {
            setValue('unit', data.unit.toLowerCase());
            setAiAnalysisError(
              err instanceof Error
                ? err.message
                : 'Không thể thêm đơn vị vào cơ sở dữ liệu.'
            );
          }
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

  return {
    handleImageReadyForAI,
    aiAnalysisLoading,
    aiAnalysisError,
    aiGeneratedInfo,
  };
}
