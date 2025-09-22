import { getModelInfo } from '../gemini-models';
import type { GeminiResponse } from '../gemini-utils';
import {
  PROMPTS,
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
  modelSupportsCapability,
  parseAIJsonResponse,
} from '../gemini-utils';
import { GeminiCoreClient } from './client-core';
import type { AIAnalyzedCosmeticItem } from './types';

export class GeminiCosmeticService extends GeminiCoreClient {
  /**
   * Analyze a cosmetic image and extract product information
   */
  async analyzeCosmeticImage(
    base64Image: string,
    mimeType: string
  ): Promise<GeminiResponse<AIAnalyzedCosmeticItem>> {
    // Ensure vision-capable model
    const modelInfo = getModelInfo(this.selectedModel!);
    const modelToUse = this.selectedModel!;

    if (!modelSupportsCapability(modelInfo, 'vision')) {
      // Use best vision model if current model doesn't support vision
      // ...should be handled by caller or injected
    }

    try {
      const prompt = PROMPTS.COSMETIC_IMAGE_ANALYSIS();
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
                  mimeType,
                },
              },
            ],
          },
        ],
      });

      const responseText = result.text || '';

      try {
        const parsedResponse: AIAnalyzedCosmeticItem =
          parseAIJsonResponse(responseText);
        return createSuccessResponse(parsedResponse);
      } catch {
        return createErrorResponse(responseText);
      }
    } catch (error: unknown) {
      return handleApiError<AIAnalyzedCosmeticItem>(
        error,
        'analyze cosmetic image'
      );
    }
  }
}
