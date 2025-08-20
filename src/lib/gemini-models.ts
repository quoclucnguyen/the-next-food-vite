/**
 * Gemini AI Model Configuration
 * Defines available Gemini models, their capabilities, and configuration options
 */

export interface GeminiModelInfo {
  id: string;
  name: string;
  description: string;
  capabilities: {
    text: boolean;
    vision: boolean;
    multimodal: boolean;
  };
  contextWindow: number;
  maxOutputTokens: number;
  isRecommended?: boolean;
  isDeprecated?: boolean;
}

export interface ModelSelectOption {
  value: string;
  label: string;
  description: string;
  badge?: string;
  disabled?: boolean;
}

export type ModelCapability = keyof GeminiModelInfo['capabilities'];
export type ModelUseCase = 'text' | 'vision' | 'multimodal';

/**
 * Cache for storing fetched models to avoid repeated API calls
 */
let modelCache: { models: GeminiModelInfo[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Clear the model cache
 */
export function clearModelCache(): void {
  modelCache = null;
}

/**
 * Get model information by ID from cached models
 * Returns null if model is not found or cache is empty
 */
export function getModelInfo(modelId: string): GeminiModelInfo | null {
  return modelCache?.models?.find((model) => model.id === modelId) || null;
}

/**
 * Check if cached models are still valid
 */
function isCacheValid(): boolean {
  return (
    modelCache !== null && Date.now() - modelCache.timestamp < CACHE_DURATION
  );
}

/**
 * Get all available models from the Gemini API with caching
 * @param apiKey - Optional API key, will try environment variable if not provided
 * @param forceRefresh - Force refresh of cache even if valid
 * @returns Promise resolving to array of model information
 */
export async function getAvailableModels(
  apiKey?: string,
  forceRefresh = false
): Promise<GeminiModelInfo[]> {
  // Return cached models if valid and not forcing refresh
  if (!forceRefresh && isCacheValid()) {
    return modelCache!.models;
  }

  // Import here to avoid circular dependency
  const { GeminiClient } = await import('./gemini-client');

  // Use provided API key or try to get from environment
  const key =
    apiKey ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

  if (!key) {
    console.warn(
      'No API key provided for getAvailableModels. Returning empty array.'
    );
    return [];
  }

  try {
    const client = new GeminiClient(key);
    const models = await client.getAvailableModels();

    // Update cache
    modelCache = {
      models,
      timestamp: Date.now(),
    };

    return models;
  } catch (error) {
    console.error('Failed to fetch models from Gemini API:', error);
    // Return cached models if available, otherwise empty array
    return modelCache?.models || [];
  }
}

/**
 * Get models filtered by capability
 * @param capability - The capability to filter by
 * @param apiKey - Optional API key for fetching models
 * @returns Promise resolving to filtered models
 */
export async function getModelsByCapability(
  capability: ModelCapability,
  apiKey?: string
): Promise<GeminiModelInfo[]> {
  const models = await getAvailableModels(apiKey);
  return models.filter(
    (model) => model.capabilities[capability] && !model.isDeprecated
  );
}

/**
 * Get recommended models
 * @param apiKey - Optional API key for fetching models
 * @returns Promise resolving to recommended models
 */
export async function getRecommendedModels(
  apiKey?: string
): Promise<GeminiModelInfo[]> {
  const models = await getAvailableModels(apiKey);
  return models.filter((model) => model.isRecommended && !model.isDeprecated);
}

/**
 * Validate if a model ID is supported
 * @param modelId - The model ID to validate
 * @param apiKey - Optional API key for fetching models
 * @returns Promise resolving to validation result
 */
export async function isValidModel(
  modelId: string,
  apiKey?: string
): Promise<boolean> {
  try {
    const availableModels = await getAvailableModels(apiKey);
    return availableModels.some(
      (model) => model.id === modelId && !model.isDeprecated
    );
  } catch (error) {
    console.error('Error validating model:', error);
    return false;
  }
}

/**
 * Get the best model for a specific use case
 * @param useCase - The use case to find the best model for
 * @param apiKey - Optional API key for fetching models
 * @returns Promise resolving to the best model ID
 * @throws Error if no suitable model is found
 */
export async function getBestModelForUseCase(
  useCase: ModelUseCase,
  apiKey?: string
): Promise<string> {
  const capabilityMap: Record<ModelUseCase, ModelCapability> = {
    text: 'text',
    vision: 'vision',
    multimodal: 'multimodal',
  };

  const capability = capabilityMap[useCase];
  const models = await getModelsByCapability(capability, apiKey);

  // Prefer recommended models
  const recommended = models.filter((model) => model.isRecommended);
  if (recommended.length > 0) {
    return recommended[0].id;
  }

  // Return first available model if any
  if (models.length > 0) {
    return models[0].id;
  }

  // No suitable model found - throw error
  throw new Error(
    `No suitable model found for use case '${useCase}'. Please ensure you have a valid API key and that models are available.`
  );
}

/**
 * Get model options formatted for Select components
 * @param apiKey - Optional API key for fetching models
 * @returns Promise resolving to formatted model options
 */
export async function getModelSelectOptions(
  apiKey?: string
): Promise<ModelSelectOption[]> {
  const models = await getAvailableModels(apiKey);
  return models
    .filter((model) => !model.isDeprecated)
    .map((model) => ({
      value: model.id,
      label: model.name,
      description: model.description,
      badge: model.isRecommended ? 'Recommended' : undefined,
      disabled: false,
    }))
    .sort((a, b) => {
      // Sort recommended models first
      if (a.badge && !b.badge) return -1;
      if (!a.badge && b.badge) return 1;
      return a.label.localeCompare(b.label);
    });
}
