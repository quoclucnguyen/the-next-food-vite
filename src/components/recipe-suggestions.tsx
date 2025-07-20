

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Loader2 } from "lucide-react"
import { GeminiClient } from "@/lib/gemini-client"
import { useSettings } from "@/hooks/use-settings"

interface RecipeSuggestionsProps {
  ingredients: string[]
}

interface Recipe {
  name: string
  description: string
  cookingTime: string
  difficulty: string
}

export function RecipeSuggestions({ ingredients }: RecipeSuggestionsProps) {
  const { settings, hasGeminiApiKey, getSelectedGeminiModel } = useSettings()
  const [suggestions, setSuggestions] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSuggestions = async () => {
    if (!hasGeminiApiKey || !settings.geminiApiKey) {
      setError("Gemini API key not configured. Please set it up in Settings.")
      return
    }

    if (ingredients.length === 0) {
      setError("No ingredients available for suggestions.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const selectedModel = getSelectedGeminiModel()
      if (!selectedModel) {
        setError("No AI model selected. Please go to Settings and select a Gemini model to enable recipe suggestions.")
        return
      }

      const client = new GeminiClient(settings.geminiApiKey, selectedModel)
      const result = await client.generateRecipeSuggestions(ingredients)

      if (result.success && result.data?.recipes) {
        setSuggestions(result.data.recipes)
      } else {
        setError(result.error || "Failed to generate recipe suggestions")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to generate recipe suggestions")
    } finally {
      setLoading(false)
    }
  }

  if (!hasGeminiApiKey) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">AI Recipe Suggestions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure your Gemini API key to get personalized recipe suggestions based on your inventory.
          </p>
          <Button variant="outline" size="sm" className="bg-transparent">
            Set up in Settings
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Gợi ý công thức AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 && !loading && !error && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Nhận gợi ý công thức cá nhân hóa dựa trên nguyên liệu có sẵn của bạn.
            </p>
            <Button onClick={generateSuggestions} disabled={ingredients.length === 0}>
              <Sparkles className="w-4 h-4 mr-2" />
              Tạo gợi ý
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Đang tạo gợi ý công thức...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={generateSuggestions} className="bg-transparent">
              Thử lại
            </Button>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((recipe, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{recipe.name}</h4>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.cookingTime}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={generateSuggestions} className="w-full bg-transparent">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
