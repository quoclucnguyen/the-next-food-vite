import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useNavigate, useSearchParams } from 'react-router';
import { useRecipes } from '@/hooks/use-recipes';
import { useMealPlans } from '@/hooks/use-meal-plans';

export default function AddMealPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    meal: searchParams.get('meal') || '',
    recipeId: '',
  });

  const { recipes } = useRecipes();
  const { addMealPlan } = useMealPlans();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.meal || !formData.recipeId) {
      alert('Vui lòng điền vào tất cả các trường');
      return;
    }

    try {
      await addMealPlan({
        date: formData.date,
        meal_type: formData.meal as 'breakfast' | 'lunch' | 'dinner',
        recipe_id: formData.recipeId,
      });

      navigate('/meal-planning');
    } catch (error) {
      console.error('Không thể thêm kế hoạch bữa ăn:', error);
      alert('Không thể thêm kế hoạch bữa ăn. Vui lòng thử lại.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center gap-3'>
            <Link to='/meal-planning'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
            </Link>
            <h1 className='text-xl font-bold text-gray-900'>Thêm bữa ăn</h1>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết bữa ăn</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='date'>Ngày</Label>
                <Input
                  id='date'
                  type='date'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor='meal'>Loại bữa ăn</Label>
                <Select
                  value={formData.meal}
                  onValueChange={(value) =>
                    setFormData({ ...formData, meal: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn loại bữa ăn' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='breakfast'>Sáng</SelectItem>
                    <SelectItem value='lunch'>Trưa</SelectItem>
                    <SelectItem value='dinner'>Tối</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='recipe'>Công thức</Label>
                <Select
                  value={formData.recipeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, recipeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn công thức' />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {recipes.length === 0 && (
                <div className='text-center py-4 text-gray-500'>
                  <p>
                    Không có công thức nào. Hãy thêm một số công thức trước.
                  </p>
                  <Link to='/recipes/add'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='mt-2 bg-transparent'
                    >
                      Thêm công thức
                    </Button>
                  </Link>
                </div>
              )}

              <div className='flex gap-3 pt-4'>
                <Link to='/meal-planning' className='flex-1'>
                  <Button variant='outline' className='w-full bg-transparent'>
                    Hủy
                  </Button>
                </Link>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={recipes.length === 0}
                >
                  Thêm bữa ăn
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
