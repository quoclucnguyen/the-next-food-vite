import { createMemoryRouter } from 'react-router';
import App from './App';

// Import pages
import HomePage from './views/HomePage';
import AddItemPage from './views/inventory/add/page';
import InventoryPage from './views/inventory/page';
import AddMealPage from './views/meal-planning/add/page';
import MealPlanningPage from './views/meal-planning/page';
import RecipeDetailPage from './views/recipes/[id]/page';
import AddRecipePage from './views/recipes/add/page';
import RecipesPage from './views/recipes/page';
import SettingsPage from './views/settings/page';
import ShoppingListPage from './views/shopping-list/page';

// Create and export router
export const router = createMemoryRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'recipes',
        children: [
          {
            index: true,
            element: <RecipesPage />,
          },
          {
            path: ':id',
            element: <RecipeDetailPage />,
          },
          {
            path: 'add',
            element: <AddRecipePage />,
          },
        ],
      },
      {
        path: 'inventory',
        children: [
          {
            index: true,
            element: <InventoryPage />,
          },
          { path: 'add', element: <AddItemPage /> },
          { path: 'edit/:id', element: <AddItemPage /> },
        ],
      },
      {
        path: 'meal-planning',
        children: [
          { index: true, element: <MealPlanningPage /> },
          { path: 'add', element: <AddMealPage /> },
          { path: 'edit/:id', element: <AddMealPage /> },
        ],
      },
      { path: 'shopping-list', element: <ShoppingListPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
