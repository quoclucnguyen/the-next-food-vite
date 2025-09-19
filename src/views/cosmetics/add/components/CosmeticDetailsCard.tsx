import { Card, CardContent } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import type { Database } from '@/lib/supabase';
import type { UseFormReturn } from 'react-hook-form';
import { STATUS_OPTIONS } from '../constants';
import type { CosmeticFormValues } from '../types';

const STATUS_LABEL: Record<string, string> = {
  active: 'Đang dùng',
  warning: 'Sắp hết hạn',
  expired: 'Đã hết hạn',
  discarded: 'Đã bỏ',
  archived: 'Lưu trữ',
};

type Category = Database['public']['Tables']['categories']['Row'];
type Unit = Database['public']['Tables']['units']['Row'];

type CosmeticDetailsCardProps = {
  form: UseFormReturn<CosmeticFormValues>;
  categories: Category[];
  units: Unit[];
};

export function CosmeticDetailsCard({
  form,
  categories,
  units,
}: Readonly<CosmeticDetailsCardProps>) {
  const { control } = form;

  return (
    <Card>
      <CardContent className='space-y-4 pt-6'>
        <FormField
          control={control}
          name='name'
          rules={{ required: 'Tên sản phẩm không được bỏ trống' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sản phẩm</FormLabel>
              <FormControl>
                <Input placeholder='Ví dụ: Kem dưỡng ẩm' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={control}
            name='brand'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thương hiệu</FormLabel>
                <FormControl>
                  <Input placeholder='Ví dụ: La Roche-Posay' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn danh mục' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <FormField
            control={control}
            name='size'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kích thước</FormLabel>
                <FormControl>
                  <Input
                    inputMode='decimal'
                    placeholder='Ví dụ: 50'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='unit'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đơn vị</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn đơn vị' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.name}>
                        {unit.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='batch_code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lô sản xuất</FormLabel>
                <FormControl>
                  <Input placeholder='Mã lô / Serial' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <FormField
            control={control}
            name='purchase_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày mua</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='opened_at'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày mở nắp</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='expiry_date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hạn sử dụng (in trên bao bì)</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={control}
            name='pao_months'
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAO (tháng)</FormLabel>
                <FormControl>
                  <Input
                    inputMode='numeric'
                    placeholder='Ví dụ: 12'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn trạng thái' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABEL[status] ?? status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder='Cách sử dụng, phản ứng, lưu ý cho thành viên khác...'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
