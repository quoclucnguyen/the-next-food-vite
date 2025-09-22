// Shared types/interfaces for Gemini services

export interface ApiModelData {
  name?: string;
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
  inputTokenLimit?: number;
}

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
  unit: string;
}

export interface AIAnalyzedCosmeticItem {
  name: string;
  brand: string;
  category: string;
  size?: string;
  unit?: string;
  paoMonths?: string;
  description?: string;
  notes?: string;
}

export interface AIGeneratedRecipe {
  [key: string]: unknown;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  servings: number;
  description?: string;
  difficulty?: string;
}
