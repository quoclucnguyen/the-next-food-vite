import type { GeminiModelInfo } from '../gemini-models';
import { GeminiCoreClient } from './client-core';
import type { ApiModelData } from './types';

export class GeminiModelService extends GeminiCoreClient {
  /**
   * Get all available models from the Gemini API
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
        multimodal: this.detectVisionCapability(baseModelId),
      },
      contextWindow: model.inputTokenLimit ?? 32768,
      maxOutputTokens: 2048,
      isRecommended: baseModelId === 'gemini-1.5-flash',
      isDeprecated: false,
    };
  }

  /**
   * Detect if a model supports vision based on API model data
   */
  private detectVisionCapability(
    modelIdOrModel:
      | string
      | {
          name?: string;
          description?: string;
          supportedGenerationMethods?: string[];
        }
  ): boolean {
    let modelId = '';
    let description = '';
    let supportedGenerationMethods: string[] = [];

    if (typeof modelIdOrModel === 'string') {
      modelId = modelIdOrModel.toLowerCase();
    } else if (modelIdOrModel) {
      modelId = (modelIdOrModel.name || '').toLowerCase();
      description = (modelIdOrModel.description || '').toLowerCase();
      supportedGenerationMethods =
        modelIdOrModel.supportedGenerationMethods || [];
    }

    if (description.includes('multimodal')) return true;
    const visionFamilies = ['1.5', '2.0', '2.5'];
    if (visionFamilies.some((family) => modelId.includes(family))) return true;
    if (modelId.includes('embedding')) return false;
    if (
      supportedGenerationMethods.includes('generateContent') &&
      (description.includes('image') || description.includes('vision'))
    ) {
      return true;
    }
    return false;
  }
}
