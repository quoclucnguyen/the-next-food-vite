# Meal Planning Components

This directory contains React components for meal planning functionality with support for both home cooking and dining out scenarios.

## Components

### MultiDishEditor

A comprehensive React component for managing dish lists in meal planning.

### RestaurantPicker

An intelligent restaurant selection component with search, creation, and detail viewing capabilities.

## MultiDishEditor Component

A comprehensive React component for managing dish lists in meal planning with support for both home cooking and dining out scenarios.

## Features

- **Dual Mode Support**: Home mode (recipe selection + servings) and Dining mode (manual entry with price/quantity)
- **Complete CRUD Operations**: Add, edit, and delete dishes with validation
- **Real-time Totals**: Display dish count and total price (for dining mode)
- **Nutrition Display**: Show nutritional information for home dishes when available
- **Mobile Responsive**: Optimized for both desktop and mobile experiences
- **Vietnamese Localization**: All UI text in Vietnamese with proper formatting

## Usage

```tsx
import { MultiDishEditor } from '@/components/meal-planning';
import type { MealDish, MealSource } from '@/types/meal-planning';

interface MyComponentProps {
  dishes: MealDish[];
  mode: MealSource; // 'home' | 'dining_out'
  onChange: (dishes: MealDish[]) => void;
  maxDishes?: number;
}

function MyComponent({
  dishes,
  mode,
  onChange,
  maxDishes = 10,
}: MyComponentProps) {
  return (
    <MultiDishEditor
      dishes={dishes}
      mode={mode}
      onChange={onChange}
      maxDishes={maxDishes}
    />
  );
}
```

## Props

| Prop        | Type                           | Default  | Description                      |
| ----------- | ------------------------------ | -------- | -------------------------------- |
| `dishes`    | `MealDish[]`                   | Required | Array of dish objects to manage  |
| `mode`      | `MealSource`                   | Required | Either 'home' or 'dining_out'    |
| `onChange`  | `(dishes: MealDish[]) => void` | Required | Callback when dishes change      |
| `maxDishes` | `number`                       | `10`     | Maximum number of dishes allowed |

## RestaurantPicker Component

An intelligent restaurant selection component that provides a seamless experience for choosing restaurants in meal planning.

### Features

- **Smart Search**: Real-time search through existing restaurants with filtering
- **Create Quick**: Add new restaurants on-the-fly without leaving the workflow
- **Restaurant Details**: View comprehensive restaurant information including ratings, address, and notes
- **Clear Selection**: Easy option to clear the current selection
- **Vietnamese Localization**: All UI text in Vietnamese with proper formatting
- **Validation**: Proper form validation with helpful error messages
- **Reusable**: Highly configurable for different use cases

### Usage

```tsx
import { RestaurantPicker } from '@/components/meal-planning';

interface MyComponentProps {
  restaurantId?: string;
  onRestaurantChange: (restaurantId: string) => void;
}

function MyComponent({ restaurantId, onRestaurantChange }: MyComponentProps) {
  return (
    <RestaurantPicker
      value={restaurantId}
      onChange={onRestaurantChange}
      placeholder='Chọn nhà hàng...'
      allowClear={true}
      showDetails={true}
    />
  );
}
```

### Props

| Prop          | Type                             | Default              | Description                                   |
| ------------- | -------------------------------- | -------------------- | --------------------------------------------- |
| `value`       | `string`                         | `undefined`          | Currently selected restaurant ID              |
| `onChange`    | `(restaurantId: string) => void` | Required             | Callback when selection changes               |
| `placeholder` | `string`                         | `'Chọn nhà hàng...'` | Placeholder text for the combobox             |
| `disabled`    | `boolean`                        | `false`              | Whether the component is disabled             |
| `allowClear`  | `boolean`                        | `true`               | Show clear button when restaurant is selected |
| `showDetails` | `boolean`                        | `true`               | Show restaurant details button and popover    |
| `className`   | `string`                         | `undefined`          | Additional CSS classes                        |

## Data Structures

### HomeDish (for home cooking)

```typescript
{
  id: string;
  name: string; // Auto-filled from recipe
  recipeId: string; // Recipe reference
  servings: number; // Number of servings
  notes?: string;
  nutrition?: {
    kcal?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}
```

### DiningDish (for dining out)

```typescript
{
  id: string;
  name: string; // Manual entry
  price?: number; // Optional price in VND
  quantity?: number; // Optional quantity
  notes?: string;
}
```

## Features by Mode

### Home Mode

- Recipe selection from available recipes
- Servings input (0.5 to 10, step 0.5)
- Automatic recipe name population
- Nutrition information display (when available)
- Total nutrition calculation across all dishes

### Dining Mode

- Manual dish name entry
- Optional price input (VND)
- Optional quantity input
- Total price calculation across all dishes
- Price formatting with Vietnamese locale

## Validation

- **Home Mode**: Recipe selection and servings are required
- **Dining Mode**: Dish name is required, price/quantity must be valid numbers
- Real-time error display with Vietnamese messages
- Form validation before submission

## Mobile Support

- Responsive dialog sizing
- Mobile-optimized form layouts
- Touch-friendly button sizes
- Proper mobile keyboard handling

## Integration Notes

- Uses existing UI components from the project's design system
- Follows project's TypeScript and import patterns
- Compatible with React Hook Form validation patterns
- Supports both controlled and uncontrolled usage patterns
