import { useQuery } from "@tanstack/react-query"
import type { UseQueryOptions } from "@tanstack/react-query"
import { getModelSelectOptions, type ModelSelectOption } from "@/lib/gemini-models"
import { toast } from "sonner"

type UseGeminiModelOptionsProps = {
  enabled?: boolean
  onError?: (error: Error) => void
}

export function useGeminiModelOptions(
  apiKey?: string,
  { enabled = true, onError }: UseGeminiModelOptionsProps = {}
) {
  return useQuery<ModelSelectOption[], Error>({
    queryKey: ['geminiModels', apiKey],
    queryFn: async () => {
      if (!apiKey) {
        throw new Error('API key is required to fetch Gemini models')
      }
      return await getModelSelectOptions(apiKey)
    },
    enabled: !!apiKey && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: Error) => {
      console.error('Failed to load model options:', error)
      toast.error('Failed to load AI models', {
        description: error.message || 'Could not fetch available models',
      })
      onError?.(error)
    },
  } as UseQueryOptions<ModelSelectOption[], Error>)
}
