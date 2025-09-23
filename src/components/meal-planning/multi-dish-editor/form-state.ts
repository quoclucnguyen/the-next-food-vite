import type { MealSource } from '@/types/meal-planning';

export interface HomeDishFormData {
  recipeId: string;
  servings: string;
  notes: string;
}

export interface DiningDishFormData {
  name: string;
  price: string;
  quantity: string;
  notes: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
}

export type FormState = {
  home: HomeDishFormData;
  dining_out: DiningDishFormData;
};

export type FormErrors = Record<string, string>;

export const createHomeDefaults = (): HomeDishFormData => ({
  recipeId: '',
  servings: '1',
  notes: '',
});

export const createDiningDefaults = (): DiningDishFormData => ({
  name: '',
  price: '',
  quantity: '1',
  notes: '',
  kcal: '',
  protein: '',
  carbs: '',
  fat: '',
});

export const createInitialFormState = (): FormState => ({
  home: createHomeDefaults(),
  dining_out: createDiningDefaults(),
});

export const resetFormState = (
  current: FormState,
  mode: MealSource
): FormState =>
  mode === 'home'
    ? { ...current, home: createHomeDefaults() }
    : { ...current, dining_out: createDiningDefaults() };
