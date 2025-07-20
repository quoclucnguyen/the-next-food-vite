import { BottomNav } from '@/components/bottom-nav';
import { RecipeCard } from '@/components/recipe-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRecipes } from '@/hooks/use-recipes';
import { ChefHat, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export default function RecipesPage() {
  const { recipes, deleteRecipe, loading } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe(id);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 leading-tight'>
                Công thức nấu ăn
              </h1>
            </div>

            {/* Mobile action button */}
            <div className='flex sm:hidden'>
              <Link to='/recipes/add'>
                <Button
                  size='sm'
                  className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </Link>
            </div>

            {/* Desktop action button */}
            <div className='hidden sm:flex'>
              <Link to='/recipes/add'>
                <Button
                  size='sm'
                  className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Thêm công thức
                </Button>
              </Link>
            </div>
          </div>

          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder='Tìm kiếm công thức hoặc nguyên liệu...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>
      </div>

      <div className='p-4'>
        {filteredRecipes.length > 0 ? (
          <div className='space-y-4'>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <ChefHat className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {searchTerm
                ? 'Không tìm thấy công thức nào'
                : 'Chưa có công thức nào'}
            </h3>
            <p className='text-gray-500 mb-4'>
              {searchTerm
                ? 'Thử điều chỉnh từ khóa tìm kiếm'
                : 'Bắt đầu xây dựng bộ sưu tập công thức của bạn'}
            </p>
            <Link to='/recipes/add'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Thêm công thức
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
