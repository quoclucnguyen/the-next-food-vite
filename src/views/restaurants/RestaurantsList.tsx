import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatVietnameseDate } from '@/lib/vietnamese-formatting';
import type { MealPlan, Restaurant } from '@/types/meal-planning';
import { Edit, Eye, MapPin, Phone, Plus, Star, Trash2, Utensils } from 'lucide-react';

interface RestaurantsListProps {
  loading: boolean;
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  getDiningHistory: (restaurantId: string) => MealPlan[];
  onAddRestaurant: () => void;
  onViewHistory: (restaurant: Restaurant) => void;
  onEditRestaurant: (restaurant: Restaurant) => void;
  onDeleteRestaurant: (restaurant: Restaurant) => void;
}

export function RestaurantsList({
  loading,
  restaurants,
  filteredRestaurants,
  getDiningHistory,
  onAddRestaurant,
  onViewHistory,
  onEditRestaurant,
  onDeleteRestaurant,
}: RestaurantsListProps) {
  if (loading) {
    return (
      <div className='space-y-4 p-4'>
        {[...Array(5)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-6'>
              <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredRestaurants.length === 0) {
    return (
      <div className='p-4'>
        <Card className='mt-6'>
          <CardContent className='text-center py-8'>
            <Utensils className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {restaurants.length === 0
                ? 'Chưa có nhà hàng nào'
                : 'Không tìm thấy nhà hàng'}
            </h3>
            <p className='text-gray-500 mb-4'>
              {restaurants.length === 0
                ? 'Hãy thêm nhà hàng đầu tiên để bắt đầu quản lý các địa điểm ăn uống'
                : 'Thử thay đổi tiêu chí tìm kiếm'}
            </p>
            {restaurants.length === 0 && (
              <Button onClick={onAddRestaurant}>
                <Plus className='w-4 h-4 mr-2' />
                Thêm nhà hàng đầu tiên
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-4'>
      <div className='grid gap-4 md:hidden'>
        {filteredRestaurants.map((restaurant) => {
          const diningHistory = getDiningHistory(restaurant.id);
          return (
            <Card key={restaurant.id} className='p-4'>
              <div className='space-y-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{restaurant.name}</h3>
                    {restaurant.cuisine && (
                      <Badge variant='secondary' className='mt-1'>
                        {restaurant.cuisine}
                      </Badge>
                    )}
                  </div>
                  {restaurant.rating && (
                    <div className='flex items-center gap-1 text-sm text-amber-500'>
                      <Star className='w-4 h-4 fill-current' />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {restaurant.address && (
                  <div className='flex items-center text-sm text-gray-600'>
                    <MapPin className='w-4 h-4 mr-2 text-gray-400' />
                    <span>{restaurant.address}</span>
                  </div>
                )}

                {restaurant.phone && (
                  <div className='flex items-center text-sm text-gray-600'>
                    <Phone className='w-4 h-4 mr-2 text-gray-400' />
                    <span>{restaurant.phone}</span>
                  </div>
                )}

                {restaurant.notes && (
                  <p className='text-sm text-gray-600'>{restaurant.notes}</p>
                )}

                <div className='flex items-center justify-between pt-2 border-t'>
                  <div className='text-sm text-gray-500'>
                    Lịch sử:
                    <span className='font-medium text-gray-900 ml-1'>
                      {diningHistory.length}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onViewHistory(restaurant)}
                    >
                      Xem
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onEditRestaurant(restaurant)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-600 hover:text-red-700'
                      onClick={() => onDeleteRestaurant(restaurant)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className='hidden md:block'>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên nhà hàng</TableHead>
                <TableHead>Thông tin</TableHead>
                <TableHead>Lần cuối ghé</TableHead>
                <TableHead className='text-center'>Số lần ghé</TableHead>
                <TableHead className='text-right'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRestaurants.map((restaurant) => {
                const diningHistory = getDiningHistory(restaurant.id);
                return (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div className='font-medium text-gray-900'>
                        {restaurant.name}
                      </div>
                      {restaurant.cuisine && (
                        <div className='mt-1'>
                          <Badge variant='secondary'>{restaurant.cuisine}</Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='space-y-1 text-sm text-gray-600'>
                      {restaurant.address && (
                        <div className='flex items-center'>
                          <MapPin className='w-4 h-4 mr-2 text-gray-400' />
                          <span>{restaurant.address}</span>
                        </div>
                      )}
                      {restaurant.phone && (
                        <div className='flex items-center'>
                          <Phone className='w-4 h-4 mr-2 text-gray-400' />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.notes && <p>{restaurant.notes}</p>}
                    </TableCell>
                    <TableCell>
                      {restaurant.lastVisited ? (
                        <div className='space-y-1 text-sm'>
                          <div className='font-medium'>
                            {formatVietnameseDate(new Date(restaurant.lastVisited))}
                          </div>
                          <div className='text-gray-500 capitalize'>
                            {diningHistory[0]?.meal_type === 'breakfast' && 'Bữa sáng'}
                            {diningHistory[0]?.meal_type === 'lunch' && 'Bữa trưa'}
                            {diningHistory[0]?.meal_type === 'dinner' && 'Bữa tối'}
                          </div>
                        </div>
                      ) : (
                        <span className='text-sm text-gray-500'>Chưa ghé</span>
                      )}
                    </TableCell>
                    <TableCell className='text-center'>
                      <span className='font-medium'>{diningHistory.length}</span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onViewHistory(restaurant)}
                          title='Xem lịch sử'
                        >
                          <Eye className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onEditRestaurant(restaurant)}
                          title='Chỉnh sửa'
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onDeleteRestaurant(restaurant)}
                          className='text-red-600 hover:text-red-700'
                          title='Xóa'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
