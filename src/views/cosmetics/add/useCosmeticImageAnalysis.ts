import { useState } from "react"
import type { UseFormSetValue } from "react-hook-form"
import { GeminiClient, type AIAnalyzedCosmeticItem } from "@/lib/gemini-client"
import type { Database } from "@/lib/supabase"
import type { CosmeticFormValues } from "./types"

type Category = Database["public"]["Tables"]["categories"]["Row"]
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"]
type Unit = Database["public"]["Tables"]["units"]["Row"]
type UnitInsert = Database["public"]["Tables"]["units"]["Insert"]

type Settings = {
  geminiApiKey?: string
  preferences?: Record<string, unknown>
}

type UseCosmeticImageAnalysisParams = {
  setValue: UseFormSetValue<CosmeticFormValues>
  categories: Category[]
  units: Unit[]
  addCategory?: (payload: Omit<CategoryInsert, "user_id">) => Promise<Category>
  addUnit?: (payload: Omit<UnitInsert, "user_id">) => Promise<Unit>
  settings: Settings
  hasGeminiApiKey: boolean
  getSelectedGeminiModel: () => string | null
}

export function useCosmeticImageAnalysis({
  setValue,
  categories,
  units,
  addCategory,
  addUnit,
  settings,
  hasGeminiApiKey,
  getSelectedGeminiModel,
}: UseCosmeticImageAnalysisParams) {
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null)
  const [aiGeneratedInfo, setAiGeneratedInfo] = useState<AIAnalyzedCosmeticItem | null>(null)

  const handleImageReadyForAI = async (base64Image: string, mimeType: string) => {
    if (!hasGeminiApiKey || !settings.geminiApiKey) {
      setAiAnalysisError(
        "Khóa API Gemini chưa được cấu hình. Vui lòng thiết lập trong Cài đặt để kích hoạt phân tích AI.",
      )
      return
    }

    setAiAnalysisLoading(true)
    setAiAnalysisError(null)
    setAiGeneratedInfo(null)

    try {
      const selectedModel = getSelectedGeminiModel()

      if (!selectedModel) {
        setAiAnalysisError(
          "Chưa chọn mô hình AI. Vui lòng vào Cài đặt và chọn mô hình Gemini để kích hoạt phân tích AI.",
        )
        return
      }

      const geminiClient = new GeminiClient(settings.geminiApiKey, selectedModel)
      const result = await geminiClient.analyzeCosmeticImage(base64Image, mimeType)

      if (!result.success || !result.data) {
        setAiAnalysisError(result.error || "Không thể phân tích hình ảnh bằng AI.")
        return
      }

      const data = result.data
      setAiGeneratedInfo(data)

      const normalize = (value?: string) => (value || "").trim().toLowerCase()

      if (data.name) {
        setValue("name", data.name)
      }

      if (data.brand) {
        setValue("brand", data.brand)
      }

      if (data.category) {
        const categoryNorm = normalize(data.category)
        const existingCategory = categories.find(
          (cat) =>
            normalize(cat.name) === categoryNorm ||
            normalize(cat.display_name) === categoryNorm,
        )

        try {
          if (!existingCategory && typeof addCategory === "function") {
            const created = await addCategory({
              name: categoryNorm || data.category,
              display_name: data.category,
            })
            setValue("category_id", created.id)
          } else if (existingCategory) {
            setValue("category_id", existingCategory.id)
          }
        } catch (error: unknown) {
          console.error("Failed to create category from AI analysis", error)
          setAiAnalysisError(
            error instanceof Error
              ? error.message
              : "Không thể thêm danh mục vào cơ sở dữ liệu.",
          )
        }
      }

      if (data.unit) {
        const unitNorm = normalize(data.unit)
        const existingUnit = units.find(
          (unit) =>
            normalize(unit.name) === unitNorm ||
            normalize(unit.display_name) === unitNorm,
        )

        try {
          if (!existingUnit && typeof addUnit === "function") {
            const createdUnit = await addUnit({
              name: unitNorm || data.unit,
              display_name: data.unit,
            })
            setValue("unit", createdUnit.name.toLowerCase())
          } else if (existingUnit) {
            setValue("unit", existingUnit.name.toLowerCase())
          } else if (data.unit) {
            setValue("unit", data.unit.toLowerCase())
          }
        } catch (error: unknown) {
          console.error("Failed to create unit from AI analysis", error)
          setAiAnalysisError(
            error instanceof Error
              ? error.message
              : "Không thể thêm đơn vị vào cơ sở dữ liệu.",
          )
        }
      }

      if (data.size) {
        setValue("size", data.size)
      }

      if (data.paoMonths) {
        setValue("pao_months", data.paoMonths)
      }

      if (data.description) {
        setValue("notes", data.description)
      }
    } catch (error: unknown) {
      setAiAnalysisError(
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi không mong muốn trong quá trình phân tích AI.",
      )
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  return {
    handleImageReadyForAI,
    aiAnalysisLoading,
    aiAnalysisError,
    aiGeneratedInfo,
  }
}
