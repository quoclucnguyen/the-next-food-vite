import { getModelInfo } from '../gemini-models';
import type { GeminiResponse } from '../gemini-utils';
import {
  PROMPTS,
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  modelSupportsCapability,
  parseAIJsonResponse,
  validateAIResponse,
} from '../gemini-utils';
import { GeminiCoreClient } from './client-core';
import type { AIAnalyzedFoodItem, AIGeneratedRecipe } from './types';

export class GeminiFoodService extends GeminiCoreClient {
  /**
   * Generate recipe suggestions based on ingredients
   */
  async generateRecipeSuggestions(ingredients: string[]): Promise<
    GeminiResponse<{
      recipes: Array<{
        name: string;
        description: string;
        cookingTime: string;
        difficulty: string;
      }>;
    }>
  > {
    // Assume 'text' capability is required
    // ...validation logic should be handled by caller or here if needed
    try {
      const prompt = PROMPTS.RECIPE_SUGGESTIONS(ingredients);
      const result = await this.client!.models.generateContent({
        model: this.selectedModel!,
        contents: prompt,
      });

      const responseText = result.text || '';

      try {
        const parsedResponse = parseAIJsonResponse(responseText);
        return createSuccessResponse(
          parsedResponse as {
            recipes: Array<{
              name: string;
              description: string;
              cookingTime: string;
              difficulty: string;
            }>;
          }
        );
      } catch {
        return createSuccessResponse({
          recipes: [
            {
              name: 'Recipe Suggestion',
              description: responseText,
              cookingTime: 'Unknown',
              difficulty: 'Easy',
            },
          ],
        });
      }
    } catch (error: unknown) {
      return handleApiError(
        error,
        'generate recipe suggestions'
      ) as GeminiResponse<{
        recipes: Array<{
          name: string;
          description: string;
          cookingTime: string;
          difficulty: string;
        }>;
      }>;
    }
  }

  /**
   * Generate a complete recipe with detailed instructions
   */
  async generateCompleteRecipe(recipeName: string): Promise<GeminiResponse> {
    try {
      const prompt = PROMPTS.COMPLETE_RECIPE(recipeName);
      const result = await this.client!.models.generateContent({
        model: this.selectedModel!,
        contents: prompt,
      });

      const responseText = result.text || '';

      try {
        const parsedResponse: AIGeneratedRecipe =
          parseAIJsonResponse(responseText);

        validateAIResponse(parsedResponse, [
          'name',
          'ingredients',
          'instructions',
          'prepTime',
          'servings',
        ]);

        return createSuccessResponse(parsedResponse);
      } catch {
        return createErrorResponse(
          'AI response could not be parsed. Please try again or create the recipe manually.'
        );
      }
    } catch (error: unknown) {
      return handleApiError(error, 'generate complete recipe');
    }
  }

  /**
   * Analyze nutritional information for a food item
   */
  async analyzeNutrition(foodItem: string): Promise<GeminiResponse> {
    try {
      const prompt = PROMPTS.NUTRITION_ANALYSIS(foodItem);
      const result = await this.client!.models.generateContent({
        model: this.selectedModel!,
        contents: prompt,
      });

      const responseText = result.text || '';
      return createSuccessResponse(responseText);
    } catch (error: unknown) {
      return handleApiError(error, 'analyze nutrition');
    }
  }

  /**
   * Analyze a food image and extract nutritional information
   */
  async analyzeFoodImage(
    base64Image: string,
    mimeType: string
  ): Promise<GeminiResponse> {
    // Ensure vision-capable model
    const modelInfo = getModelInfo(this.selectedModel!);
    const modelToUse = this.selectedModel!;

    if (!modelSupportsCapability(modelInfo, 'vision')) {
      // Use best vision model if current model doesn't support vision
      // ...should be handled by caller or injected
    }

    try {
      const prompt = PROMPTS.FOOD_IMAGE_ANALYSIS();
      const result = await this.client!.models.generateContent({
        model: modelToUse,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType,
                },
              },
            ],
          },
        ],
      });

      const responseText = result.text || '';

      try {
        const parsedResponse: AIAnalyzedFoodItem =
          parseAIJsonResponse(responseText);
        return createSuccessResponse(parsedResponse);
      } catch {
        return createErrorResponse(responseText);
      }
    } catch (error: unknown) {
      return handleApiError(error, 'analyze food image');
    }
  }
}
