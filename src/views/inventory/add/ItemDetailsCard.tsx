import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Control } from 'react-hook-form';
import type { InventoryFormValues } from './types';

export default function ItemDetailsCard({
  control,
  units,
  unitsLoading,
  categories,
  categoriesLoading,
  todayStr,
  QUANTITY_MAX,
}: Readonly<{
  control: Control<InventoryFormValues>;
  units: { id: string | number; name: string; display_name: string }[];
  unitsLoading: boolean;
  categories: { id: string | number; display_name: string }[];
  categoriesLoading: boolean;
  todayStr: string;
  QUANTITY_MAX: number;
}>) {
  return (
    <div>
      <div className='card'>
        {/* keep Card markup consistent with other files */}
      </div>

      <div>
        <div className='space-y-4'>
          <div>
            <FormField
              control={control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='name'>Tên mặt hàng</FormLabel>
                  <FormControl>
                    <Input
                      id='name'
                      placeholder='ví dụ: Chuối, Sữa, Ức gà'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                required: 'Vui lòng nhập tên mặt hàng',
              }}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={control}
              name='quantity'
              rules={{
                required: 'Số lượng phải lớn hơn 0',
                min: {
                  value: 0.000001,
                  message: 'Số lượng phải lớn hơn 0',
                },
                max: {
                  value: QUANTITY_MAX,
                  message: `Số lượng quá lớn (tối đa ${QUANTITY_MAX})`,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='quantity'>Số lượng</FormLabel>
                  <FormControl>
                    <Input
                      id='quantity'
                      type='number'
                      step='0.1'
                      min='0.1'
                      max={QUANTITY_MAX}
                      placeholder='1.5'
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        const value = isNaN(parsed) ? 0 : parsed;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='unit'
              rules={{ required: 'Vui lòng chọn đơn vị' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='unit'>Đơn vị</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v: string) => field.onChange(v)}
                      disabled={unitsLoading}
                    >
                      <SelectTrigger
                        className={field.value ? '' : ''}
                        aria-invalid={!!field}
                      >
                        <SelectValue
                          placeholder={
                            unitsLoading ? 'Đang tải đơn vị...' : 'Chọn đơn vị'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem
                            key={unit.id}
                            value={unit.name.toLocaleLowerCase()}
                          >
                            {unit.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name='category'
            rules={{ required: 'Vui lòng chọn danh mục' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='category'>Danh mục</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v: string) => field.onChange(v)}
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger aria-invalid={!!field}>
                      <SelectValue
                        placeholder={
                          categoriesLoading
                            ? 'Đang tải danh mục...'
                            : 'Chọn danh mục'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.display_name.toLocaleLowerCase()}
                        >
                          {category.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='expirationDate'
            rules={{
              required: 'Vui lòng chọn ngày hết hạn',
              validate: (val) =>
                !val || val >= todayStr || 'Ngày hết hạn không được ở quá khứ',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='expirationDate'>Ngày hết hạn</FormLabel>
                <FormControl>
                  <Input
                    id='expirationDate'
                    type='date'
                    min={todayStr}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
