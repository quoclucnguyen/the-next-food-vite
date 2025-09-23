import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useRestaurants } from '@/hooks/use-restaurants';
import { ChevronDown, MapPin, Phone, Plus, Star, X } from 'lucide-react';
import { useMemo, useState } from 'react';

interface RestaurantPickerProps {
  value?: string;
  onChange: (restaurantId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  showDetails?: boolean;
  className?: string;
}

interface RestaurantFormData {
  name: string;
  address: string;
  phone: string;
  cuisine: string;
  notes: string;
}

export function RestaurantPicker({
  value,
  onChange,
  placeholder = 'Chọn nhà hàng...',
  disabled = false,
  allowClear = true,
  showDetails = true,
  className,
}: RestaurantPickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
    phone: '',
    cuisine: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState('');

  const { restaurants, loading, addRestaurant } = useRestaurants();

  // Filter restaurants based on search
  const filteredRestaurants = useMemo(() => {
    if (!searchValue.trim()) return restaurants;

    const search = searchValue.toLowerCase();
    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(search) ||
        (restaurant.cuisine &&
          restaurant.cuisine.toLowerCase().includes(search)) ||
        (restaurant.address &&
          restaurant.address.toLowerCase().includes(search))
    );
  }, [restaurants, searchValue]);

  // Convert restaurants to combobox options
  const restaurantOptions = useMemo(() => {
    const options = filteredRestaurants.map((restaurant) => ({
      value: restaurant.id,
      label: (
        <div className='flex items-center justify-between w-full'>
          <div className='flex flex-col'>
            <span className='font-medium'>{restaurant.name}</span>
            {restaurant.cuisine && (
              <span className='text-sm text-muted-foreground'>
                {restaurant.cuisine}
              </span>
            )}
          </div>
          {restaurant.rating && (
            <div className='flex items-center gap-1'>
              <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
              <span className='text-sm'>{restaurant.rating}</span>
            </div>
          )}
        </div>
      ),
    }));

    // Add "Create Quick" option if there are search results
    if (
      searchValue.trim() &&
      !restaurants.some(
        (r) => r.name.toLowerCase() === searchValue.toLowerCase()
      )
    ) {
      options.unshift({
        value: 'create_quick',
        label: (
          <div className='flex items-center gap-2 text-primary'>
            <Plus className='w-4 h-4' />
            <span>Tạo nhanh: "{searchValue}"</span>
          </div>
        ),
      });
    }

    return options;
  }, [filteredRestaurants, searchValue, restaurants]);

  // Get selected restaurant details
  const selectedRestaurant = useMemo(() => {
    return restaurants.find((r) => r.id === value);
  }, [restaurants, value]);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      cuisine: '',
      notes: '',
    });
    setErrors({});
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsDialogOpen(open);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRestaurant = async () => {
    if (!validateForm()) return;

    try {
      const newRestaurant = await addRestaurant({
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        cuisine: formData.cuisine.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      // Select the newly created restaurant
      onChange(newRestaurant.id);
      handleDialogOpenChange(false);
      setSearchValue('');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setErrors({
        submit: 'Không thể tạo nhà hàng. Vui lòng thử lại.',
      });
    }
  };

  const handleValueChange = (newValue: string) => {
    if (newValue === 'create_quick') {
      // Pre-fill form with search value
      setFormData((prev) => ({ ...prev, name: searchValue }));
      setIsDialogOpen(true);
    } else {
      onChange(newValue);
      setIsPopoverOpen(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setSearchValue('');
  };

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='flex items-center gap-2'>
        <Combobox
          options={restaurantOptions}
          value={value || ''}
          onChange={handleValueChange}
          placeholder={placeholder}
          searchPlaceholder='Tìm kiếm nhà hàng...'
          notFoundText='Không tìm thấy nhà hàng nào'
          disabled={disabled || loading}
          className='flex-1'
          onSearchChange={handleSearchChange}
        />

        {allowClear && value && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClear}
            disabled={disabled}
            className='shrink-0'
          >
            <X className='w-4 h-4' />
          </Button>
        )}

        {!disabled && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDialogOpen(true)}
            className='shrink-0'
          >
            <Plus className='w-4 h-4' />
          </Button>
        )}
      </div>

      {/* Restaurant Details */}
      {showDetails && selectedRestaurant && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='w-full justify-start text-left font-normal'
              disabled={disabled}
            >
              <ChevronDown className='w-4 h-4 mr-2' />
              Xem chi tiết nhà hàng
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80' align='start'>
            <div className='space-y-3'>
              <div>
                <h4 className='font-medium'>{selectedRestaurant.name}</h4>
                {selectedRestaurant.cuisine && (
                  <Badge variant='secondary' className='mt-1'>
                    {selectedRestaurant.cuisine}
                  </Badge>
                )}
              </div>

              {selectedRestaurant.address && (
                <div className='flex items-start gap-2 text-sm'>
                  <MapPin className='w-4 h-4 mt-0.5 shrink-0 text-muted-foreground' />
                  <span>{selectedRestaurant.address}</span>
                </div>
              )}

              {selectedRestaurant.phone && (
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='w-4 h-4 shrink-0 text-muted-foreground' />
                  <span>{selectedRestaurant.phone}</span>
                </div>
              )}

              {selectedRestaurant.rating && (
                <div className='flex items-center gap-2 text-sm'>
                  <Star className='w-4 h-4 shrink-0 text-yellow-400' />
                  <span>Đánh giá: {selectedRestaurant.rating}/5</span>
                </div>
              )}

              {selectedRestaurant.lastVisited && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <span>
                    Lần cuối ghé thăm:{' '}
                    {new Date(
                      selectedRestaurant.lastVisited
                    ).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}

              {selectedRestaurant.notes && (
                <div className='text-sm text-muted-foreground'>
                  <span className='font-medium'>Ghi chú:</span>
                  <p className='mt-1'>{selectedRestaurant.notes}</p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Create Restaurant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Thêm nhà hàng mới</DialogTitle>
            <DialogDescription>
              Tạo nhà hàng mới để sử dụng trong kế hoạch ăn uống của bạn.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
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

            <div className='grid grid-cols-2 gap-4'>
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
            <Button onClick={handleCreateRestaurant}>Tạo nhà hàng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
