import type { Database } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import type {
  CreateMealPlanInput,
  MealPlan,
  UpdateMealPlanInput,
} from '@/types/meal-planning';
import { useEffect, useState } from 'react';

type MealPlanInsert = Database['public']['Tables']['meal_plans']['Insert'];

export function useMealPlans() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const mapDbToMealPlan = (
    plan: Database['public']['Tables']['meal_plans']['Row'] & {
      recipe?: {
        name?: string;
        ingredients?: string[];
        instructions?: string[];
        prep_time?: number;
        servings?: number;
        image_url?: string;
      } | null;
      dishes?: unknown;
      restaurant_id?: string | null;
    }
  ): MealPlan => {
    return {
      id: plan.id,
      user_id: plan.user_id ?? null,
      date: plan.date,
      meal_type:
        plan.meal_type === 'breakfast' ||
        plan.meal_type === 'lunch' ||
        plan.meal_type === 'dinner'
          ? plan.meal_type
          : 'breakfast',
      source: (plan.source as MealPlan['source']) ?? 'home',
      restaurantId:
        typeof plan.restaurant_id === 'string' ? plan.restaurant_id : undefined,
      dishes: Array.isArray(plan.dishes)
        ? (plan.dishes as unknown as MealPlan['dishes'])
        : plan.recipe_id
        ? [
            {
              id: plan.recipe_id,
              name: plan.recipe?.name || 'Unknown Recipe',
              recipeId: plan.recipe_id,
              servings: 1,
            },
          ]
        : [],
      created_at: plan.created_at ?? '',
      updated_at: plan.updated_at ?? '',
      recipe_id: plan.recipe_id ?? undefined,
      recipe: plan.recipe
        ? {
            id: plan.recipe_id ?? '',
            name: plan.recipe.name ?? '',
            ingredients: plan.recipe.ingredients ?? undefined,
            instructions: plan.recipe.instructions ?? undefined,
            prep_time: plan.recipe.prep_time ?? undefined,
            servings: plan.recipe.servings ?? undefined,
            image_url: plan.recipe.image_url ?? undefined,
          }
        : undefined,
    };
  };

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select(
          `
          *,
          recipe:recipes(name)
        `
        )
        .order('date', { ascending: true });

      if (error) throw error;

      // Transform legacy database records to new MealPlan format
      const transformedData: MealPlan[] = (data || []).map(mapDbToMealPlan);

      setMealPlans(transformedData);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMealPlan = async (mealPlan: Omit<MealPlanInsert, 'user_id'>) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('meal_plans')
        .insert({ ...mealPlan, user_id: user.id })
        .select(
          `
          *,
          recipe:recipes(name)
        `
        )
        .single();

      if (error) throw error;
      const newPlan = mapDbToMealPlan(data);
      setMealPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (error) {
      console.error('Error adding meal plan:', error);
      throw error;
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase.from('meal_plans').delete().eq('id', id);

      if (error) throw error;
      setMealPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw error;
    }
  };

  // Enhanced function for creating meal plans with new structure
  const createMealPlan = async (input: CreateMealPlanInput) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // For now, we'll use the first dish for backward compatibility with existing database
      const firstDish = input.dishes[0];
      if (!firstDish) throw new Error('At least one dish is required');

      // If it's a home dish, use the recipe_id for database compatibility
      const recipeId = 'recipeId' in firstDish ? firstDish.recipeId : undefined;

      const dbMealPlan = {
        date: input.date,
        meal_type: input.meal_type,
        recipe_id: recipeId,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('meal_plans')
        .insert(dbMealPlan)
        .select(
          `
          *,
          recipe:recipes(name)
        `
        )
        .single();

      if (error) throw error;

      const transformed = mapDbToMealPlan(data);
      const newMealPlan: MealPlan = {
        ...transformed,
        source: input.source,
        dishes: Array.isArray(input.dishes) ? input.dishes : transformed.dishes,
        restaurantId: input.restaurantId ?? transformed.restaurantId,
      };

      setMealPlans((prev) => [...prev, newMealPlan]);
      return newMealPlan;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  };

  // Function to update meal plans with new structure
  const updateMealPlan = async (input: UpdateMealPlanInput) => {
    try {
      const updateData: Partial<
        Database['public']['Tables']['meal_plans']['Update']
      > = {};

      if (input.dishes && input.dishes.length > 0) {
        const firstDish = input.dishes[0];
        if ('recipeId' in firstDish) {
          updateData.recipe_id = firstDish.recipeId;
        }
      }

      const { data, error } = await supabase
        .from('meal_plans')
        .update(updateData)
        .eq('id', input.id)
        .select(
          `
          *,
          recipe:recipes(name)
        `
        )
        .single();

      if (error) throw error;

      const transformed = mapDbToMealPlan(data);
      const updatedMealPlan: MealPlan = {
        ...transformed,
        source: (input.source as MealPlan['source']) || transformed.source,
        dishes: Array.isArray(input.dishes) ? input.dishes : transformed.dishes,
        restaurantId: input.restaurantId ?? transformed.restaurantId,
      };

      setMealPlans((prev) =>
        prev.map((plan) => (plan.id === input.id ? updatedMealPlan : plan))
      );

      return updatedMealPlan;
    } catch (error) {
      console.error('Error updating meal plan:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchMealPlans();

    // Set up real-time subscription
    const subscription = supabase
      .channel('meal_plans_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'meal_plans' },
        () => {
          // Refetch to get updated data with recipe names
          fetchMealPlans();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    mealPlans,
    loading,
    addMealPlan,
    deleteMealPlan,
    createMealPlan,
    updateMealPlan,
    refetch: fetchMealPlans,
  };
}
