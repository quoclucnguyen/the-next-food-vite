// Base types for meal planning features
export type MealSource = 'home' | 'dining_out';

// Nutrition data interface
export interface NutritionData {
   kcal?: number;
   protein?: number;
   carbs?: number;
   fat?: number;
}

// Base interface for meal dishes with common properties
export interface MealDishBase {
   id: string;
   name: string;
   notes?: string;
   nutrition?: NutritionData;
}

// Home dish - for cooking at home using recipes
export interface HomeDish extends MealDishBase {
  recipeId: string;
  servings: number;
}

// Dining dish - for eating out at restaurants
export interface DiningDish extends MealDishBase {
  price?: number;
  quantity?: number;
}

// Union type for any dish
export type MealDish = HomeDish | DiningDish;

// Restaurant information
export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  tags?: string[];
  cuisine?: string;
  rating?: number;
  lastVisited?: string;
  notes?: string;
}

// Extended meal plan interface supporting both home cooking and dining out
export interface MealPlan {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  source: MealSource;
  restaurantId?: string;
  dishes: MealDish[];
  created_at: string;
  updated_at: string;
  // Legacy support for existing recipe-based plans
  recipe_id?: string;
  recipe?: {
    id: string;
    name: string;
    ingredients?: string[];
    instructions?: string[];
    prep_time?: number;
    servings?: number;
    image_url?: string;
  };
}

// Input type for creating new meal plans
export interface CreateMealPlanInput {
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  source: MealSource;
  restaurantId?: string;
  dishes: MealDish[];
  // Legacy support
  recipe_id?: string;
}

// Input type for updating meal plans
export interface UpdateMealPlanInput extends Partial<CreateMealPlanInput> {
  id: string;
}

// Type guard functions
export function isHomeDish(dish: MealDish): dish is HomeDish {
  return 'recipeId' in dish && 'servings' in dish;
}

export function isDiningDish(dish: MealDish): dish is DiningDish {
  return 'price' in dish && 'quantity' in dish;
}

// Helper type for meal planning form data
export interface MealPlanningFormData {
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  source: MealSource;
  restaurantId?: string;
  dishes: MealDish[];
}

// Utility types for meal planning
export interface MealPlanSummary {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  source: MealSource;
  dishCount: number;
  totalNutrition?: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  restaurantName?: string;
  recipeNames?: string[];
}

export interface WeeklyMealPlan {
  weekStart: string;
  weekEnd: string;
  meals: MealPlan[];
  summary: {
    totalMeals: number;
    homeMeals: number;
    diningMeals: number;
    totalNutrition?: {
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}
