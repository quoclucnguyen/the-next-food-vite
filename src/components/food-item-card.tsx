import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { Link } from 'react-router';

interface FoodItemCardProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    expiration_date: string;
    category: string;
    image_url?: string;
  };
  onDelete: (id: string) => void;
}

export function FoodItemCard({ item, onDelete }: FoodItemCardProps) {
  const getExpirationStatus = (
    expirationDate: string
  ): {
    status: string;
    color: 'default' | 'secondary' | 'destructive' | 'outline';
  } => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiration = Math.ceil(
      (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration < 0)
      return { status: 'Hết hạn', color: 'destructive' };
    if (daysUntilExpiration <= 3)
      return { status: 'Sắp hết hạn', color: 'destructive' };
    if (daysUntilExpiration <= 7)
      return { status: 'Sắp hết hạn', color: 'secondary' };
    return { status: 'Tươi', color: 'default' };
  };

  const expiration = getExpirationStatus(item.expiration_date);

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex gap-3'>
          {/* Image */}
          <div className='shrink-0'>
            <div className='w-16 h-16 rounded-lg overflow-hidden bg-gray-100'>
              {item.image_url ? (
                <Image
                  src={item.image_url || '/placeholder.svg'}
                  alt={item.name}
                  width={64}
                  height={64}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <span className='text-xs'>Không có hình</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='font-semibold truncate'>{item.name}</h3>
              <Badge variant='outline' className='text-xs shrink-0'>
                {item.category}
              </Badge>
            </div>
            <p className='text-sm text-gray-600 mb-2'>
              {item.quantity} {item.unit}
            </p>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-gray-500'>
                Hết hạn: {new Date(item.expiration_date).toLocaleDateString()}
              </span>
              <Badge variant={expiration.color} className='text-xs'>
                {expiration.status}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className='flex flex-col gap-2'>
            <Link to={`/inventory/edit/${item.id}`}>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <Edit className='w-4 h-4' />
              </Button>
            </Link>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onDelete(item.id)}
              className='h-8 w-8 p-0'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
