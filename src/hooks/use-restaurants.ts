import { supabase } from '@/lib/supabase';
import type { Restaurant } from '@/types/meal-planning';
import { useEffect, useState } from 'react';

// Define the restaurants table structure for Supabase
type RestaurantRow = {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  phone?: string;
  tags?: string[];
  cuisine?: string;
  rating?: number;
  last_visited?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

type RestaurantInsert = {
  id?: string;
  user_id: string;
  name: string;
  address?: string;
  phone?: string;
  tags?: string[];
  cuisine?: string;
  rating?: number;
  last_visited?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

type RestaurantUpdate = {
  id?: string;
  user_id?: string;
  name?: string;
  address?: string;
  phone?: string;
  tags?: string[];
  cuisine?: string;
  rating?: number;
  last_visited?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform database records to Restaurant type
      const transformedData: Restaurant[] = (data || []).map(
        (restaurant: RestaurantRow) => ({
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address || undefined,
          phone: restaurant.phone || undefined,
          tags: restaurant.tags || undefined,
          cuisine: restaurant.cuisine || undefined,
          rating: restaurant.rating || undefined,
          lastVisited: restaurant.last_visited || undefined,
          notes: restaurant.notes || undefined,
        })
      );

      setRestaurants(transformedData);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRestaurant = async (
    restaurant: Omit<RestaurantInsert, 'user_id'>
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('restaurants')
        .insert({ ...restaurant, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Transform to Restaurant type
      const newRestaurant: Restaurant = {
        id: data.id,
        name: data.name,
        address: data.address || undefined,
        phone: data.phone || undefined,
        tags: data.tags || undefined,
        cuisine: data.cuisine || undefined,
        rating: data.rating || undefined,
        lastVisited: data.last_visited || undefined,
        notes: data.notes || undefined,
      };

      setRestaurants((prev) => [...prev, newRestaurant]);
      return newRestaurant;
    } catch (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }
  };

  const updateRestaurant = async (id: string, updates: RestaurantUpdate) => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform to Restaurant type
      const updatedRestaurant: Restaurant = {
        id: data.id,
        name: data.name,
        address: data.address || undefined,
        phone: data.phone || undefined,
        tags: data.tags || undefined,
        cuisine: data.cuisine || undefined,
        rating: data.rating || undefined,
        lastVisited: data.last_visited || undefined,
        notes: data.notes || undefined,
      };

      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant.id === id ? updatedRestaurant : restaurant
        )
      );
      return updatedRestaurant;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant.id !== id)
      );
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  };

  const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      // Transform to Restaurant type
      const restaurant: Restaurant = {
        id: data.id,
        name: data.name,
        address: data.address || undefined,
        phone: data.phone || undefined,
        tags: data.tags || undefined,
        cuisine: data.cuisine || undefined,
        rating: data.rating || undefined,
        lastVisited: data.last_visited || undefined,
        notes: data.notes || undefined,
      };

      return restaurant;
    } catch (error) {
      console.error('Error fetching restaurant by ID:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRestaurants();

    // Set up real-time subscription
    const subscription = supabase
      .channel('restaurants_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'restaurants' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newData = payload.new as RestaurantRow;
            const newRestaurant: Restaurant = {
              id: newData.id,
              name: newData.name,
              address: newData.address || undefined,
              phone: newData.phone || undefined,
              tags: newData.tags || undefined,
              cuisine: newData.cuisine || undefined,
              rating: newData.rating || undefined,
              lastVisited: newData.last_visited || undefined,
              notes: newData.notes || undefined,
            };
            setRestaurants((prev) => [...prev, newRestaurant]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedData = payload.new as RestaurantRow;
            const updatedRestaurant: Restaurant = {
              id: updatedData.id,
              name: updatedData.name,
              address: updatedData.address || undefined,
              phone: updatedData.phone || undefined,
              tags: updatedData.tags || undefined,
              cuisine: updatedData.cuisine || undefined,
              rating: updatedData.rating || undefined,
              lastVisited: updatedData.last_visited || undefined,
              notes: updatedData.notes || undefined,
            };
            setRestaurants((prev) =>
              prev.map((restaurant) =>
                restaurant.id === updatedData.id
                  ? updatedRestaurant
                  : restaurant
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const oldData = payload.old as RestaurantRow;
            setRestaurants((prev) =>
              prev.filter((restaurant) => restaurant.id !== oldData.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    restaurants,
    loading,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantById,
    refetch: fetchRestaurants,
  };
}
