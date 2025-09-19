import { useMemo, useState } from 'react';

import { useMealPlans } from '@/hooks/use-meal-plans';
import { useRestaurants } from '@/hooks/use-restaurants';
import type { Restaurant } from '@/types/meal-planning';

import { RestaurantDeleteDialog } from './RestaurantDeleteDialog';
import { RestaurantFormDialog } from './RestaurantFormDialog';
import { RestaurantHistoryDialog } from './RestaurantHistoryDialog';
import { RestaurantsList } from './RestaurantsList';
import { RestaurantsToolbar } from './RestaurantsToolbar';
import type { FilterState, RestaurantFormData } from './types';
import {
  compareRestaurants,
  matchesCuisineFilter,
  matchesSearchTerm,
} from './utils';

export default function RestaurantsPage() {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] =
    useState<Restaurant | null>(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
    phone: '',
    cuisine: '',
    tags: [],
    rating: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    cuisine: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const {
    restaurants,
    loading,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } = useRestaurants();
  const { mealPlans } = useMealPlans();

  const availableCuisines = useMemo(() => {
    const cuisines = new Set(
      restaurants
        .map((r) => r.cuisine)
        .filter((cuisine): cuisine is string => Boolean(cuisine))
    );
    return Array.from(cuisines).sort((a, b) => a.localeCompare(b));
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    const filtered = restaurants.filter(
      (restaurant) =>
        matchesSearchTerm(restaurant, searchTerm) &&
        (filters.cuisine === 'all' ||
          matchesCuisineFilter(restaurant, filters.cuisine))
    );

    return filtered.sort((a, b) =>
      compareRestaurants(a, b, filters.sortBy, filters.sortOrder)
    );
  }, [restaurants, filters]);

  const getRestaurantDiningHistory = (restaurantId: string) => {
    return mealPlans
      .filter(
        (plan) =>
          plan.source === 'dining_out' && plan.restaurantId === restaurantId
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      cuisine: '',
      tags: [],
      rating: '',
      notes: '',
    });
    setTagInput('');
    setErrors({});
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      setEditingRestaurant(null);
    }
    setIsFormDialogOpen(open);
  };

  const handleAddRestaurant = () => {
    resetForm();
    setEditingRestaurant(null);
    setIsFormDialogOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      cuisine: restaurant.cuisine || '',
      tags: restaurant.tags || [],
      rating: restaurant.rating?.toString() || '',
      notes: restaurant.notes || '',
    });
    setTagInput('');
    setIsFormDialogOpen(true);
  };

  const handleViewHistory = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setHistoryDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên nhà hàng';
    }

    if (formData.phone?.trim()) {
      const phoneRegex = /^[+]?[0-9\s\-()]{8,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (
      formData.rating &&
      (isNaN(Number(formData.rating)) ||
        Number(formData.rating) < 1 ||
        Number(formData.rating) > 5)
    ) {
      newErrors.rating = 'Đánh giá phải từ 1 đến 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const restaurantData = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        cuisine: formData.cuisine.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        rating: formData.rating ? Number(formData.rating) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, restaurantData);
      } else {
        await addRestaurant(restaurantData);
      }

      handleDialogOpenChange(false);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setErrors({
        submit: 'Không thể lưu nhà hàng. Vui lòng thử lại.',
      });
    }
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (restaurantToDelete) {
      try {
        await deleteRestaurant(restaurantToDelete.id);
        setDeleteDialogOpen(false);
        setRestaurantToDelete(null);
      } catch (error) {
        console.error('Không thể xóa nhà hàng:', error);
      }
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSort = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFormDataChange = (updates: Partial<RestaurantFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
  };

  return (
    <>
      <RestaurantsToolbar
        loading={loading}
        filters={filters}
        availableCuisines={availableCuisines}
        onAddRestaurant={handleAddRestaurant}
        onFilterChange={handleFilterChange}
        onToggleSort={toggleSort}
      />

      <RestaurantsList
        loading={loading}
        restaurants={restaurants}
        filteredRestaurants={filteredRestaurants}
        getDiningHistory={getRestaurantDiningHistory}
        onAddRestaurant={handleAddRestaurant}
        onViewHistory={handleViewHistory}
        onEditRestaurant={handleEditRestaurant}
        onDeleteRestaurant={handleDeleteClick}
      />

      <RestaurantFormDialog
        open={isFormDialogOpen}
        editingRestaurant={editingRestaurant}
        formData={formData}
        errors={errors}
        tagInput={tagInput}
        onOpenChange={handleDialogOpenChange}
        onFormDataChange={handleFormDataChange}
        onTagInputChange={handleTagInputChange}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onSubmit={handleSubmit}
      />

      <RestaurantHistoryDialog
        open={historyDialogOpen}
        restaurant={selectedRestaurant}
        onOpenChange={setHistoryDialogOpen}
        getDiningHistory={getRestaurantDiningHistory}
      />

      <RestaurantDeleteDialog
        open={deleteDialogOpen}
        restaurant={restaurantToDelete}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  );
}
