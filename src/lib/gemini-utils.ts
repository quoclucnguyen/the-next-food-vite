/**
 * Shared utilities for Gemini AI integration
 * Contains common functionality used across Gemini client and models
 */

import type { GeminiModelInfo } from './gemini-models';

/**
 * Standard response interface for Gemini operations
 */
export interface GeminiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Error types for better error handling
 */
export enum GeminiErrorType {
  API_KEY_MISSING = 'API_KEY_MISSING',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  MODEL_NOT_SUPPORTED = 'MODEL_NOT_SUPPORTED',
  MODEL_NOT_CONFIGURED = 'MODEL_NOT_CONFIGURED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  PARSE_ERROR = 'PARSE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Enhanced error class for Gemini operations
 */
export class GeminiError extends Error {
  constructor(
    public type: GeminiErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse<T = unknown>(
  message: string
): GeminiResponse<T> {
  return {
    success: false,
    error: message,
  };
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T): GeminiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Clean up AI response text by removing markdown code fences
 * @param responseText - Raw response text from AI
 * @returns Cleaned text without markdown fences
 */
export function cleanMarkdownFences(responseText: string): string {
  let cleanText = responseText.trim();

  if (cleanText.startsWith('```')) {
    // Remove the opening fence and optional language tag
    const firstNewline = cleanText.indexOf('\n');
    if (firstNewline !== -1) {
      cleanText = cleanText.slice(firstNewline + 1);
    }

    // Remove the trailing fence if present
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.slice(0, -3);
    }
  }

  return cleanText.trim();
}

/**
 * Parse JSON response from AI with error handling
 * @param responseText - Raw response text from AI
 * @returns Parsed JSON object or throws GeminiError
 */
export function parseAIJsonResponse<T>(responseText: string): T {
  try {
    const cleanedText = cleanMarkdownFences(responseText);
    return JSON.parse(cleanedText) as T;
  } catch (error) {
    throw new GeminiError(
      GeminiErrorType.PARSE_ERROR,
      'AI response could not be parsed as JSON. Please try again.',
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

/**
 * Validate that a parsed AI response has required fields
 * @param response - Parsed response object
 * @param requiredFields - Array of required field names
 * @returns True if valid, throws GeminiError if invalid
 */
export function validateAIResponse(
  response: Record<string, unknown>,
  requiredFields: string[]
): boolean {
  const missingFields = requiredFields.filter(
    (field) => response[field] === undefined || response[field] === null
  );

  if (missingFields.length > 0) {
    throw new GeminiError(
      GeminiErrorType.INVALID_RESPONSE,
      `AI response is missing required fields: ${missingFields.join(', ')}`
    );
  }

  return true;
}

/**
 * Check if a model supports a specific capability
 * @param modelInfo - Model information object
 * @param capability - Capability to check
 * @returns Boolean indicating support
 */
export function modelSupportsCapability(
  modelInfo: GeminiModelInfo | null,
  capability: keyof GeminiModelInfo['capabilities']
): boolean {
  return modelInfo?.capabilities[capability] === true;
}

/**
 * Handle API errors and convert to standardized format
 * @param error - Error from API call
 * @param context - Context for the error (e.g., 'recipe generation')
 * @returns Standardized error response
 */
export function handleApiError(
  error: unknown,
  context: string
): GeminiResponse {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Handle specific API error patterns
  if (
    errorMessage.includes('model not found') ||
    errorMessage.includes('not supported')
  ) {
    return createErrorResponse(
      'The selected model is not available. Please select a different model.'
    );
  }

  if (errorMessage.includes('API key')) {
    return createErrorResponse(
      'Invalid or missing API key. Please check your configuration.'
    );
  }

  // Network or connection errors
  if (
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('timeout')
  ) {
    return createErrorResponse(
      'Network error occurred. Please check your connection and try again.'
    );
  }

  // Generic error
  return createErrorResponse(errorMessage || `Failed to ${context}.`);
}

/**
 * Retry function with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise resolving to function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Common prompts and templates in Vietnamese
 */
export const PROMPTS = {
  TEST_CONNECTION: 'Xin chào, đây là tin nhắn kiểm tra kết nối.',

  RECIPE_SUGGESTIONS: (ingredients: string[]) =>
    `Với các nguyên liệu sau: ${ingredients.join(
      ', '
    )}, hãy gợi ý 3 công thức nấu ăn đơn giản theo định dạng JSON:
{
  "recipes": [
    { "name": "...", "description": "...", "cookingTime": "...", "difficulty": "Dễ|Trung bình|Khó" }
  ]
}

Vui lòng đảm bảo:
- Tên công thức bằng tiếng Việt
- Mô tả ngắn gọn về món ăn
- Thời gian nấu thực tế (ví dụ: "30 phút")
- Độ khó phù hợp với nguyên liệu có sẵn`,

  COMPLETE_RECIPE: (recipeName: string) =>
    `Tạo một công thức nấu ăn hoàn chỉnh cho món "${recipeName}". Cung cấp công thức chi tiết với nguyên liệu thực tế, hướng dẫn từng bước, thời gian chuẩn bị và số khẩu phần. Trả về phản hồi theo định dạng JSON chính xác sau:

{
  "name": "${recipeName}",
  "ingredients": ["nguyên liệu 1 với số lượng", "nguyên liệu 2 với số lượng", "..."],
  "instructions": ["Bước 1 mô tả chi tiết", "Bước 2 mô tả chi tiết", "..."],
  "prepTime": 30,
  "servings": 4,
  "description": "Mô tả ngắn gọn về món ăn",
  "difficulty": "Dễ"
}

Hướng dẫn:
- Bao gồm số lượng cụ thể cho nguyên liệu (ví dụ: "2 cốc bột mì", "500g thịt gà")
- Viết hướng dẫn từng bước rõ ràng, chi tiết
- Cung cấp thời gian chuẩn bị thực tế tính bằng phút
- Bao gồm số khẩu phần phù hợp
- Đảm bảo công thức thực tế và có thể thực hiện được
- Sử dụng kỹ thuật nấu ăn và nguyên liệu phổ biến tại Việt Nam`,

  NUTRITION_ANALYSIS: (foodItem: string) =>
    `Cung cấp thông tin dinh dưỡng cho: ${foodItem}. Bao gồm calo trên 100g, các chất dinh dưỡng chính và lợi ích sức khỏe. Giữ ngắn gọn và có thông tin hữu ích. Trả lời bằng tiếng Việt.`,

  FOOD_IMAGE_ANALYSIS: () =>
    `Phân tích hình ảnh thực phẩm này. Cung cấp thông tin sau theo định dạng JSON:
{
  "name": "Tên thực phẩm ngắn gọn (ví dụ: 'Táo', 'Thịt gà nướng', 'Miếng pizza')",
  "description": "Mô tả ngắn gọn về thực phẩm.",
  "caloriesPer100g": "Ước tính calo trên 100g (ví dụ: '52 kcal', '165 kcal')",
  "macronutrients": {
    "protein": "Ước tính protein trên 100g (ví dụ: '0.3 g', '31 g')",
    "carbohydrates": "Ước tính carbohydrate trên 100g (ví dụ: '14 g', '0 g')",
    "fat": "Ước tính chất béo trên 100g (ví dụ: '0.2 g', '3.6 g')"
  },
  "keyIngredients": ["Danh", "sách", "nguyên", "liệu", "chính", "nếu", "nhận", "ra"],
  "category": "Danh mục phù hợp nhất (ví dụ: 'fruits', 'vegetables', 'dairy', 'meat', 'grains', 'pantry', 'frozen', 'beverages', 'snacks', 'other')"
}

Lưu ý: Sử dụng tên thực phẩm và mô tả bằng tiếng Việt, nhưng giữ nguyên các key trong JSON và category bằng tiếng Anh.`,

  FOOD_IMAGE_GENERATION: (
    prompt: string,
    options: { width?: number; height?: number; style?: string }
  ) =>
    `Tạo mô tả chi tiết cho việc tạo hình ảnh thực phẩm với yêu cầu sau:

Mô tả: ${prompt}
Kích thước: ${options.width || 1024}x${options.height || 1024} pixels
Phong cách: ${options.style || 'realistic'}

Hãy tạo một mô tả chi tiết và hấp dẫn về hình ảnh thực phẩm này, bao gồm:
- Màu sắc và kết cấu của thực phẩm
- Cách bày trí và trình bày
- Ánh sáng và bối cảnh phù hợp
- Chi tiết làm cho hình ảnh trông ngon miệng và chuyên nghiệp

Lưu ý: Đây là mô tả để tạo hình ảnh, không phải hình ảnh thực tế. Trong thực tế, bạn sẽ cần sử dụng API tạo hình ảnh chuyên dụng.`,

  FOOD_IMAGE_SUGGESTIONS: (ingredients: string[]) =>
    `Với các nguyên liệu sau: ${ingredients.join(
      ', '
    )}, hãy gợi ý 3 ý tưởng tạo hình ảnh thực phẩm theo định dạng JSON:
{
  "suggestions": [
    {
      "prompt": "Mô tả chi tiết cho việc tạo hình ảnh món ăn",
      "description": "Mô tả ngắn gọn về món ăn và cách trình bày",
      "style": "realistic|artistic|minimalist|rustic"
    }
  ]
}

Vui lòng đảm bảo:
- Mỗi gợi ý có mô tả chi tiết về cách trình bày món ăn
- Bao gồm màu sắc, kết cấu và bối cảnh
- Phong cách phù hợp với loại món ăn
- Tất cả mô tả bằng tiếng Việt`,
} as const;
