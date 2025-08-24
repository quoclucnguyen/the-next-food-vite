import type { Database } from '@/lib/supabase';
import type { MealDish, MealPlan } from '@/types/meal-planning';
import { isDiningDish, isHomeDish } from '@/types/meal-planning';
import { useMemo } from 'react';

// Recipe type definition (matching use-recipes.ts)
type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  image_url?: string;
};

// Nutrition data interface
export interface NutritionData {
  kcal?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

// Nutrition calculation result
export interface NutritionTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  hasCompleteData: boolean;
  missingDataFields: string[];
}

// Recipe nutrition lookup (this would typically come from a database or API)
const RECIPE_NUTRITION_DATA: Record<string, NutritionData> = {
  // Example data - in a real app, this would come from the database
  // or an external nutrition API
};

export function useNutrition() {
  // Calculate nutrition for a single dish
  const calculateDishNutrition = useMemo(
    () =>
      (dish: MealDish, recipes: Recipe[] = []): NutritionTotals => {
        const nutrition: NutritionTotals = {
          kcal: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          hasCompleteData: false,
          missingDataFields: [],
        };

        if (isHomeDish(dish)) {
          // For home dishes, get nutrition from recipe or dish data
          const recipe = recipes.find((r) => r.id === dish.recipeId);
          let dishNutrition = dish.nutrition;

          // If dish has nutrition data, use it; otherwise try to get from recipe
          if (!dishNutrition && recipe) {
            // In a real implementation, recipes would have nutrition data
            // For now, we'll check our mock data
            dishNutrition = RECIPE_NUTRITION_DATA[recipe.id];
          }

          if (dishNutrition) {
            const multiplier = dish.servings;
            nutrition.kcal = (dishNutrition.kcal || 0) * multiplier;
            nutrition.protein = (dishNutrition.protein || 0) * multiplier;
            nutrition.carbs = (dishNutrition.carbs || 0) * multiplier;
            nutrition.fat = (dishNutrition.fat || 0) * multiplier;

            // Check for complete data
            const requiredFields = ['kcal', 'protein', 'carbs', 'fat'] as const;
            const missingFields = requiredFields.filter(
              (field) => !dishNutrition![field]
            );
            nutrition.hasCompleteData = missingFields.length === 0;
            nutrition.missingDataFields = missingFields;
          }
        } else if (isDiningDish(dish)) {
          // For dining dishes, use the nutrition data directly if available
          if (dish.nutrition) {
            const multiplier = dish.quantity || 1;
            nutrition.kcal = (dish.nutrition.kcal || 0) * multiplier;
            nutrition.protein = (dish.nutrition.protein || 0) * multiplier;
            nutrition.carbs = (dish.nutrition.carbs || 0) * multiplier;
            nutrition.fat = (dish.nutrition.fat || 0) * multiplier;

            // Check for complete data
            const requiredFields = ['kcal', 'protein', 'carbs', 'fat'] as const;
            const missingFields = requiredFields.filter(
              (field) => !dish.nutrition![field]
            );
            nutrition.hasCompleteData = missingFields.length === 0;
            nutrition.missingDataFields = missingFields;
          } else {
            // No nutrition data available
            nutrition.missingDataFields = ['kcal', 'protein', 'carbs', 'fat'];
          }
        }

        return nutrition;
      },
    []
  );

  // Calculate nutrition for multiple dishes
  const calculateDishesNutrition = useMemo(
    () =>
      (dishes: MealDish[], recipes: Recipe[] = []): NutritionTotals => {
        const totals: NutritionTotals = {
          kcal: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          hasCompleteData: true,
          missingDataFields: [],
        };

        const allMissingFields = new Set<string>();

        dishes.forEach((dish) => {
          const dishNutrition = calculateDishNutrition(dish, recipes);
          totals.kcal += dishNutrition.kcal;
          totals.protein += dishNutrition.protein;
          totals.carbs += dishNutrition.carbs;
          totals.fat += dishNutrition.fat;

          // Track missing data
          if (!dishNutrition.hasCompleteData) {
            totals.hasCompleteData = false;
            dishNutrition.missingDataFields.forEach((field) =>
              allMissingFields.add(field)
            );
          }
        });

        totals.missingDataFields = Array.from(allMissingFields);
        return totals;
      },
    [calculateDishNutrition]
  );

  // Calculate nutrition for a meal plan
  const calculateMealPlanNutrition = useMemo(
    () =>
      (mealPlan: MealPlan, recipes: Recipe[] = []): NutritionTotals => {
        return calculateDishesNutrition(mealPlan.dishes, recipes);
      },
    [calculateDishesNutrition]
  );

  // Calculate nutrition for multiple meal plans (e.g., weekly summary)
  const calculateMealPlansNutrition = useMemo(
    () =>
      (mealPlans: MealPlan[], recipes: Recipe[] = []): NutritionTotals => {
        const totals: NutritionTotals = {
          kcal: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          hasCompleteData: true,
          missingDataFields: [],
        };

        const allMissingFields = new Set<string>();

        mealPlans.forEach((mealPlan) => {
          const mealNutrition = calculateMealPlanNutrition(mealPlan, recipes);
          totals.kcal += mealNutrition.kcal;
          totals.protein += mealNutrition.protein;
          totals.carbs += mealNutrition.carbs;
          totals.fat += mealNutrition.fat;

          // Track missing data
          if (!mealNutrition.hasCompleteData) {
            totals.hasCompleteData = false;
            mealNutrition.missingDataFields.forEach((field) =>
              allMissingFields.add(field)
            );
          }
        });

        totals.missingDataFields = Array.from(allMissingFields);
        return totals;
      },
    [calculateMealPlanNutrition]
  );

  // Get nutrition display text with appropriate formatting
  const getNutritionDisplayText = useMemo(
    () =>
      (nutrition: NutritionTotals, compact: boolean = false): string => {
        if (!nutrition.hasCompleteData) {
          if (compact) {
            return nutrition.kcal > 0
              ? `~${Math.round(nutrition.kcal)}kcal`
              : 'No data';
          }
          return 'Incomplete nutrition data';
        }

        if (compact) {
          return `${Math.round(nutrition.kcal)}kcal`;
        }

        const parts = [];
        if (nutrition.kcal > 0) parts.push(`${Math.round(nutrition.kcal)}kcal`);
        if (nutrition.protein > 0)
          parts.push(`${Math.round(nutrition.protein)}g protein`);
        if (nutrition.carbs > 0)
          parts.push(`${Math.round(nutrition.carbs)}g carbs`);
        if (nutrition.fat > 0) parts.push(`${Math.round(nutrition.fat)}g fat`);

        return parts.length > 0 ? parts.join(', ') : 'No nutrition data';
      },
    []
  );

  // Check if nutrition data should be shown
  const shouldShowNutrition = useMemo(
    () =>
      (nutrition: NutritionTotals): boolean => {
        // Show nutrition if we have any data or if it's incomplete (to show estimates)
        return nutrition.kcal > 0 || !nutrition.hasCompleteData;
      },
    []
  );

  return {
    calculateDishNutrition,
    calculateDishesNutrition,
    calculateMealPlanNutrition,
    calculateMealPlansNutrition,
    getNutritionDisplayText,
    shouldShowNutrition,
  };
}
