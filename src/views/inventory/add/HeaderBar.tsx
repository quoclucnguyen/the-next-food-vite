import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

export default function HeaderBar({ isEditMode }: { isEditMode: boolean }) {
  return (
    <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
      <div className='px-4 py-4'>
        <div className='flex items-center gap-3'>
          <Link to='/inventory'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='w-4 h-4' />
            </Button>
          </Link>
          <h1 className='text-xl font-bold text-gray-900'>
            {isEditMode ? 'Chỉnh sửa thực phẩm' : 'Thêm thực phẩm'}
          </h1>
        </div>
      </div>
    </div>
  );
}
