import type { Restaurant } from '@/types/meal-planning';

import type { FilterState } from './types';

export const matchesText = (
  value: string | null | undefined,
  searchTerm: string
) => Boolean(value?.toLowerCase().includes(searchTerm));

export const matchesSearchTerm = (
  restaurant: Restaurant,
  searchTerm: string
) => {
  if (!searchTerm) return true;

  if (matchesText(restaurant.name, searchTerm)) return true;
  if (matchesText(restaurant.cuisine, searchTerm)) return true;
  if (matchesText(restaurant.address, searchTerm)) return true;

  return restaurant.tags?.some((tag) => matchesText(tag, searchTerm)) ?? false;
};

export const matchesCuisineFilter = (
  restaurant: Restaurant,
  cuisineFilter: string
) => {
  if (!cuisineFilter) return true;

  return restaurant.cuisine === cuisineFilter;
};

export const getSortValue = (
  restaurant: Restaurant,
  sortBy: FilterState['sortBy']
): string | number => {
  switch (sortBy) {
    case 'rating':
      return restaurant.rating ?? 0;
    case 'lastVisited':
      return restaurant.lastVisited
        ? new Date(restaurant.lastVisited).getTime()
        : 0;
    case 'name':
    default:
      return restaurant.name.toLowerCase();
  }
};

export const compareRestaurants = (
  a: Restaurant,
  b: Restaurant,
  sortBy: FilterState['sortBy'],
  sortOrder: FilterState['sortOrder']
) => {
  const aValue = getSortValue(a, sortBy);
  const bValue = getSortValue(b, sortBy);

  if (aValue === bValue) {
    return 0;
  }

  const direction = sortOrder === 'asc' ? 1 : -1;
  return aValue < bValue ? -1 * direction : 1 * direction;
};
