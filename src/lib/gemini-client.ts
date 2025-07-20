import { GoogleGenAI } from '@google/genai';
import {
  getBestModelForUseCase,
  getModelInfo,
  isValidModelSync,
  type GeminiModelInfo,
} from './gemini-models';
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  modelSupportsCapability,
  parseAIJsonResponse,
  PROMPTS,
  validateAIResponse,
  type GeminiResponse,
} from './gemini-utils';

// Re-export the GeminiResponse interface for backward compatibility
export type { GeminiResponse } from './gemini-utils';

/**
 * Interface for raw model data from Google AI API
 */
interface ApiModelData {
  name?: string;
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
  inputTokenLimit?: number;
}

/**
 * Interface for AI-analyzed food items from image recognition
 */
export interface AIAnalyzedFoodItem {
  name: string;
  description: string;
  caloriesPer100g: string;
  macronutrients: {
    protein: string;
    carbohydrates: string;
    fat: string;
  };
  keyIngredients: string[];
  category: string;
}

/**
 * Interface for AI-generated recipes
 */
export interface AIGeneratedRecipe {
  [key: string]: unknown; // Index signature for compatibility with Record<string, unknown>
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  servings: number;
  description?: string;
  difficulty?: string;
}

/**
 * Gemini AI Client for food-related AI operations
 * Handles recipe generation, nutrition analysis, and food image recognition
 */
export class GeminiClient {
  private client: GoogleGenAI | null = null;
  private apiKey: string | null = null;
  private selectedModel: string | null = null;

  constructor(apiKey?: string, selectedModel?: string) {
    if (selectedModel) {
      this.selectedModel = selectedModel;
    }
    if (apiKey) {
      this.setApiKey(apiKey, selectedModel);
    }
  }

  /**
   * Set the API key and initialize the client
   * @param apiKey - Gemini API key
   * @param selectedModel - Optional model to select
   */
  setApiKey(apiKey: string, selectedModel?: string): void {
    this.apiKey = apiKey;
    this.client = new GoogleGenAI({ apiKey });

    if (selectedModel) {
      this.selectedModel = selectedModel;
    }

    // Validate the selected model if one is set
    if (this.selectedModel && !isValidModelSync(this.selectedModel)) {
      console.warn(
        `Selected model "${this.selectedModel}" is not valid. Model will need to be set explicitly.`
      );
      this.selectedModel = null;
    }
  }

  /**
   * Set the selected model
   * @param modelId - Model ID to select
   */
  setSelectedModel(modelId: string): void {
    this.selectedModel = modelId;
    // Re-initialize if client is already configured
    if (this.apiKey) {
      this.setApiKey(this.apiKey, modelId);
    }
  }

  /**
   * Get the currently selected model
   * @returns Current model ID or null if no model is configured
   */
  getSelectedModel(): string | null {
    return this.selectedModel;
  }

  /**
   * Check if the client is properly configured
   * @returns Boolean indicating configuration status
   */
  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  /**
   * Validate client configuration and model support
   * @param requiredCapability - Optional capability requirement
   * @returns Error response if invalid, null if valid
   */
  private validateConfiguration(
    requiredCapability?: keyof GeminiModelInfo['capabilities']
  ): GeminiResponse | null {
    if (!this.client) {
      return createErrorResponse('Gemini API key not configured.');
    }

    if (!this.selectedModel) {
      return createErrorResponse(
        'No model selected. Please select a model before using the Gemini client.'
      );
    }

    if (requiredCapability) {
      const modelInfo = getModelInfo(this.selectedModel);
      if (!modelSupportsCapability(modelInfo, requiredCapability)) {
        return createErrorResponse(
          `Selected model "${this.selectedModel}" does not support ${requiredCapability}.`
        );
      }
    }

    return null;
  }

  /**
   * Test the connection to Gemini API
   * @returns Promise resolving to test result
   */
  async testConnection(): Promise<GeminiResponse> {
    const validationError = this.validateConfiguration();
    if (validationError) {
      return validationError;
    }

    // Additional validation for sync model check
    if (!isValidModelSync(this.selectedModel!)) {
      return createErrorResponse(
        `Selected model "${this.selectedModel}" is not supported or has been deprecated.`
      );
    }

    try {
      const result = await this.client!.models.generateContent({
        model: this.selectedModel!,
        contents: PROMPTS.TEST_CONNECTION,
      });

      if (result) {
        const modelInfo = getModelInfo(this.selectedModel!);
        return createSuccessResponse(
          `Connection successful using ${
            modelInfo?.name || this.selectedModel!
          }.`
        );
      } else {
        return createErrorResponse(
          'Invalid response from Gemini API during test.'
        );
      }
    } catch (error: unknown) {
      return handleApiError(error, 'test connection');
    }
  }

  /**
   * Generate recipe suggestions based on ingredients
   * @param ingredients - Array of ingredient names
   * @returns Promise resolving to recipe suggestions
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
    const validationError = this.validateConfiguration('text');
    if (validationError) {
      return validationError as GeminiResponse<{
        recipes: Array<{
          name: string;
          description: string;
          cookingTime: string;
          difficulty: string;
        }>;
      }>;
    }

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
        // Fallback if AI doesn't return perfect JSON
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
   * @param recipeName - Name of the recipe to generate
   * @returns Promise resolving to complete recipe
   */
  async generateCompleteRecipe(recipeName: string): Promise<GeminiResponse> {
    const validationError = this.validateConfiguration('text');
    if (validationError) {
      return validationError;
    }

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

        // Validate the response has required fields
        validateAIResponse(parsedResponse, [
          'name',
          'ingredients',
          'instructions',
          'prepTime',
          'servings',
        ]);

        return createSuccessResponse(parsedResponse);
      } catch (parseError) {
        console.error(
          'Failed to parse AI recipe response:',
          responseText,
          parseError
        );
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
   * @param foodItem - Name of the food item to analyze
   * @returns Promise resolving to nutrition analysis
   */
  async analyzeNutrition(foodItem: string): Promise<GeminiResponse> {
    const validationError = this.validateConfiguration('text');
    if (validationError) {
      return validationError;
    }

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
   * @param base64Image - Base64 encoded image data
   * @param mimeType - MIME type of the image
   * @returns Promise resolving to food analysis
   */
  async analyzeFoodImage(
    base64Image: string,
    mimeType: string
  ): Promise<GeminiResponse> {
    const validationError = this.validateConfiguration();
    if (validationError) {
      return validationError;
    }

    // Determine the best model for vision tasks
    const modelInfo = getModelInfo(this.selectedModel!);
    let modelToUse = this.selectedModel!;

    if (!modelSupportsCapability(modelInfo, 'vision')) {
      // Use best vision model if current model doesn't support vision
      modelToUse = await getBestModelForUseCase(
        'vision',
        this.apiKey || undefined
      );
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
      } catch (parseError) {
        console.error(
          'Failed to parse AI response JSON:',
          responseText,
          parseError
        );
        return createErrorResponse(
          'AI response could not be parsed. Please try again or enter manually.'
        );
      }
    } catch (error: unknown) {
      return handleApiError(error, 'analyze food image');
    }
  }

  /**
   * Get all available models from the Gemini API
   * @returns Promise resolving to array of model information
   */
  async getAvailableModels(): Promise<GeminiModelInfo[]> {
    if (!this.client || !this.apiKey) {
      console.warn(
        'No client or API key configured for getAvailableModels. Returning empty array.'
      );
      return [];
    }

    try {
      const response = await this.client.models.list({
        config: { pageSize: 20 },
      });
      const models: GeminiModelInfo[] = [];

      for await (const model of response) {
        const modelInfo = this.transformApiModelToInfo(model);
        models.push(modelInfo);
      }

      return models;
    } catch (error) {
      console.error('Failed to fetch models from Gemini API:', error);
      return [];
    }
  }

  /**
   * Transform API model data to our GeminiModelInfo interface
   * @param model - Raw model data from API
   * @returns Transformed model information
   */
  private transformApiModelToInfo(model: ApiModelData): GeminiModelInfo {
    const modelName = model.name || '';
    const baseModelId = modelName.replace('models/', '');

    return {
      id: baseModelId,
      name: model.displayName || baseModelId,
      description: model.description || 'No description available',
      capabilities: {
        text:
          model.supportedGenerationMethods?.includes('generateContent') ?? true,
        vision: this.detectVisionCapability(baseModelId),
        multimodal: this.detectVisionCapability(baseModelId), // Vision models are typically multimodal
      },
      contextWindow: model.inputTokenLimit ?? 32768,
      maxOutputTokens: 2048, // Default value since the API doesn't provide outputTokenLimit
      isRecommended: baseModelId === 'gemini-1.5-flash',
      isDeprecated: false,
    };
  }

  /**
   * Detect if a model supports vision based on its ID
   * @param modelId - Model identifier
   * @returns Boolean indicating vision support
   */
  private detectVisionCapability(modelId: string): boolean {
    return modelId.includes('vision') || modelId.includes('1.5');
  }
}
