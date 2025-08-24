import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useMealPlans } from '@/hooks/use-meal-plans';
import { useRestaurants } from '@/hooks/use-restaurants';
import {
  formatVietnameseDate,
  formatVietnameseDateTime,
} from '@/lib/vietnamese-formatting';
import type { Restaurant } from '@/types/meal-planning';
import {
  ChefHat,
  Edit,
  Eye,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Search,
  Star,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface RestaurantFormData {
  name: string;
  address: string;
  phone: string;
  cuisine: string;
  tags: string[];
  rating: string;
  notes: string;
}

interface FilterState {
  search: string;
  cuisine: string;
  sortBy: 'name' | 'rating' | 'lastVisited';
  sortOrder: 'asc' | 'desc';
}

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
    cuisine: '',
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

  // Get unique cuisines for filter dropdown
  const availableCuisines = useMemo(() => {
    const cuisines = new Set(
      restaurants
        .map((r) => r.cuisine)
        .filter((cuisine): cuisine is string => Boolean(cuisine))
    );
    return Array.from(cuisines).sort();
  }, [restaurants]);

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    const filtered = restaurants.filter((restaurant) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(search) ||
          (restaurant.cuisine &&
            restaurant.cuisine.toLowerCase().includes(search)) ||
          (restaurant.address &&
            restaurant.address.toLowerCase().includes(search)) ||
          (restaurant.tags &&
            restaurant.tags.some((tag) => tag.toLowerCase().includes(search)));
        if (!matchesSearch) return false;
      }

      // Cuisine filter
      if (filters.cuisine && restaurant.cuisine !== filters.cuisine) {
        return false;
      }

      return true;
    });

    // Sort restaurants
    filtered.sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'lastVisited':
          aValue = a.lastVisited ? new Date(a.lastVisited).getTime() : 0;
          bValue = b.lastVisited ? new Date(b.lastVisited).getTime() : 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [restaurants, filters]);

  // Get dining history for a restaurant
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

    if (formData.phone && formData.phone.trim()) {
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

  return (
    <>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-tight'>
                Quản lý nhà hàng
              </h1>
            </div>

            {/* Mobile action button */}
            <div className='flex sm:hidden'>
              <Button
                size='sm'
                onClick={handleAddRestaurant}
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
              >
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Plus className='w-4 h-4' />
                )}
              </Button>
            </div>

            {/* Desktop action button */}
            <div className='hidden sm:flex'>
              <Button
                size='sm'
                onClick={handleAddRestaurant}
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Plus className='w-4 h-4 mr-2' />
                    Thêm nhà hàng
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className='space-y-3'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <Input
                  placeholder='Tìm kiếm nhà hàng, loại món, địa chỉ...'
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className='pl-10'
                />
              </div>

              <Select
                value={filters.cuisine}
                onValueChange={(value) => handleFilterChange('cuisine', value)}
              >
                <SelectTrigger className='w-full sm:w-48'>
                  <SelectValue placeholder='Tất cả loại món' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>Tất cả loại món</SelectItem>
                  {availableCuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Sắp xếp:</span>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  handleFilterChange('sortBy', value as FilterState['sortBy'])
                }
              >
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Tên</SelectItem>
                  <SelectItem value='rating'>Đánh giá</SelectItem>
                  <SelectItem value='lastVisited'>Lần cuối ghé</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant='outline'
                size='sm'
                onClick={toggleSort}
                className='px-3'
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='p-4'>
        {loading ? (
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className='animate-pulse'>
                <CardContent className='p-6'>
                  <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
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
                <Button onClick={handleAddRestaurant}>
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm nhà hàng đầu tiên
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {/* Mobile card view */}
            <div className='grid gap-4 md:hidden'>
              {filteredRestaurants.map((restaurant) => {
                const diningHistory = getRestaurantDiningHistory(restaurant.id);
                return (
                  <Card key={restaurant.id} className='p-4'>
                    <div className='space-y-3'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='font-medium text-gray-900'>
                            {restaurant.name}
                          </h3>
                          {restaurant.cuisine && (
                            <Badge variant='secondary' className='mt-1'>
                              {restaurant.cuisine}
                            </Badge>
                          )}
                        </div>
                        {restaurant.rating && (
                          <div className='flex items-center gap-1 text-sm'>
                            <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                            <span>{restaurant.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className='space-y-2 text-sm text-gray-600'>
                        {restaurant.address && (
                          <div className='flex items-start gap-2'>
                            <MapPin className='w-4 h-4 mt-0.5 shrink-0' />
                            <span>{restaurant.address}</span>
                          </div>
                        )}
                        {restaurant.phone && (
                          <div className='flex items-center gap-2'>
                            <Phone className='w-4 h-4 shrink-0' />
                            <span>{restaurant.phone}</span>
                          </div>
                        )}
                      </div>

                      {restaurant.tags && restaurant.tags.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                          {restaurant.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant='outline'
                              className='text-xs'
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className='flex items-center justify-between pt-2 border-t'>
                        <span className='text-sm text-gray-500'>
                          {diningHistory.length} lần ghé thăm
                        </span>
                        <div className='flex gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleViewHistory(restaurant)}
                          >
                            <Eye className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEditRestaurant(restaurant)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteClick(restaurant)}
                            className='text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop table view */}
            <div className='hidden md:block'>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên nhà hàng</TableHead>
                      <TableHead>Loại món</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Lần cuối ghé</TableHead>
                      <TableHead className='text-center'>Lượt ghé thăm</TableHead>
                      <TableHead className='text-right'>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRestaurants.map((restaurant) => {
                      const diningHistory = getRestaurantDiningHistory(
                        restaurant.id
                      );
                      return (
                        <TableRow key={restaurant.id}>
                          <TableCell>
                            <div className='space-y-1'>
                              <div className='font-medium'>
                                {restaurant.name}
                              </div>
                              {restaurant.tags &&
                                restaurant.tags.length > 0 && (
                                  <div className='flex flex-wrap gap-1'>
                                    {restaurant.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {restaurant.cuisine ? (
                              <Badge variant='secondary'>
                                {restaurant.cuisine}
                              </Badge>
                            ) : (
                              <span className='text-gray-400'>—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {restaurant.address || (
                              <span className='text-gray-400'>—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {restaurant.phone || (
                              <span className='text-gray-400'>—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {restaurant.rating ? (
                              <div className='flex items-center gap-1'>
                                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                                <span>{restaurant.rating}</span>
                              </div>
                            ) : (
                              <span className='text-gray-400'>—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {restaurant.lastVisited ? (
                              formatVietnameseDate(
                                new Date(restaurant.lastVisited)
                              )
                            ) : (
                              <span className='text-gray-400'>Chưa ghé</span>
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
                                onClick={() => handleViewHistory(restaurant)}
                                title='Xem lịch sử'
                              >
                                <Eye className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleEditRestaurant(restaurant)}
                                title='Chỉnh sửa'
                              >
                                <Edit className='w-4 h-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => handleDeleteClick(restaurant)}
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
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Restaurant Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingRestaurant ? 'Chỉnh sửa nhà hàng' : 'Thêm nhà hàng mới'}
            </DialogTitle>
            <DialogDescription>
              {editingRestaurant
                ? 'Cập nhật thông tin nhà hàng'
                : 'Tạo nhà hàng mới để sử dụng trong kế hoạch ăn uống của bạn.'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Tên nhà hàng *</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={errors.name ? 'border-destructive' : ''}
                  placeholder='Ví dụ: Phở 10 Lý Quốc Sư, Bún Riêu Cố Đạo...'
                />
                {errors.name && (
                  <p className='text-sm text-destructive'>{errors.name}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='cuisine'>Loại món ăn</Label>
                <Input
                  id='cuisine'
                  value={formData.cuisine}
                  onChange={(e) =>
                    setFormData({ ...formData, cuisine: e.target.value })
                  }
                  placeholder='Ví dụ: Việt Nam, Nhật Bản, Ý...'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='address'>Địa chỉ</Label>
              <Input
                id='address'
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder='Ví dụ: 10 Lý Quốc Sư, Quận 1, TP.HCM'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Số điện thoại</Label>
                <Input
                  id='phone'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={errors.phone ? 'border-destructive' : ''}
                  placeholder='Ví dụ: 0123 456 789'
                />
                {errors.phone && (
                  <p className='text-sm text-destructive'>{errors.phone}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='rating'>Đánh giá (1-5)</Label>
                <Input
                  id='rating'
                  type='number'
                  min='1'
                  max='5'
                  step='0.1'
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className={errors.rating ? 'border-destructive' : ''}
                  placeholder='Ví dụ: 4.5'
                />
                {errors.rating && (
                  <p className='text-sm text-destructive'>{errors.rating}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tags'>Thẻ (tags)</Label>
              <div className='flex gap-2'>
                <Input
                  id='tags'
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                  }
                  placeholder='Nhập thẻ và nhấn Enter...'
                  className='flex-1'
                />
                <Button type='button' onClick={handleAddTag} variant='outline'>
                  Thêm
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className='flex flex-wrap gap-1 mt-2'>
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {tag}
                      <X
                        className='w-3 h-3 cursor-pointer'
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Ghi chú</Label>
              <Textarea
                id='notes'
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder='Thêm ghi chú về nhà hàng...'
                rows={3}
              />
            </div>

            {errors.submit && (
              <p className='text-sm text-destructive'>{errors.submit}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => handleDialogOpenChange(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {editingRestaurant ? 'Cập nhật' : 'Tạo nhà hàng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className='sm:max-w-[800px] max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              Lịch sử ăn uống tại {selectedRestaurant?.name}
            </DialogTitle>
            <DialogDescription>
              Danh sách các bữa ăn đã ghi nhận tại nhà hàng này
            </DialogDescription>
          </DialogHeader>

          {selectedRestaurant && (
            <div className='space-y-4'>
              {getRestaurantDiningHistory(selectedRestaurant.id).length ===
              0 ? (
                <div className='text-center py-8'>
                  <ChefHat className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500'>
                    Chưa có lịch sử ăn uống nào tại nhà hàng này
                  </p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {getRestaurantDiningHistory(selectedRestaurant.id).map(
                    (meal) => (
                      <Card key={meal.id}>
                        <CardContent className='p-4'>
                          <div className='flex items-start justify-between mb-2'>
                            <div>
                              <h4 className='font-medium'>
                                {formatVietnameseDateTime(new Date(meal.date))}
                              </h4>
                              <p className='text-sm text-gray-600 capitalize'>
                                {meal.meal_type === 'breakfast' && 'Bữa sáng'}
                                {meal.meal_type === 'lunch' && 'Bữa trưa'}
                                {meal.meal_type === 'dinner' && 'Bữa tối'}
                              </p>
                            </div>
                          </div>

                          <div className='space-y-2'>
                            {meal.dishes.map((dish, index) => (
                              <div
                                key={index}
                                className='flex items-center justify-between text-sm'
                              >
                                <span>{dish.name}</span>
                                {'price' in dish && dish.price && (
                                  <span className='text-gray-600'>
                                    {dish.price.toLocaleString('vi-VN')}đ
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setHistoryDialogOpen(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhà hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhà hàng "{restaurantToDelete?.name}"
              không? Hành động này không thể hoàn tác và sẽ xóa tất cả lịch sử
              liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
