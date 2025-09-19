export interface RestaurantFormData {
  name: string;
  address: string;
  phone: string;
  cuisine: string;
  tags: string[];
  rating: string;
  notes: string;
}

export interface FilterState {
  search: string;
  cuisine: string;
  sortBy: 'name' | 'rating' | 'lastVisited';
  sortOrder: 'asc' | 'desc';
}
