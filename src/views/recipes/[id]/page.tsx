import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { COMMON_TEXT, RECIPES_TEXT } from '@/lib/i18n-utils';
import type { Database } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ChefHat, Clock, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  image_url?: string | null;
};

export default function RecipeDetailPage() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recipeId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError(RECIPES_TEXT.recipeNotFound);
          } else {
            setError(RECIPES_TEXT.recipeLoadError);
          }
          return;
        }

        setRecipe({
          ...data,
          image_url: data.image_url ?? null,
        });
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(RECIPES_TEXT.recipeLoadError);
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
          <div className='px-4 py-4'>
            <div className='flex items-center gap-3'>
              <Link to='/recipes'>
                <Button variant='ghost' size='sm'>
                  <ArrowLeft className='w-4 h-4' />
                </Button>
              </Link>
              <h1 className='text-xl font-semibold text-gray-900'>
                {COMMON_TEXT.loading}
              </h1>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='w-8 h-8 animate-spin text-gray-400' />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
          <div className='px-4 py-4'>
            <div className='flex items-center gap-3'>
              <Link to='/recipes'>
                <Button variant='ghost' size='sm'>
                  <ArrowLeft className='w-4 h-4' />
                </Button>
              </Link>
              <h1 className='text-xl font-semibold text-gray-900'>Công thức</h1>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center py-20 px-4'>
          <ChefHat className='w-16 h-16 text-gray-400 mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            {error || RECIPES_TEXT.recipeNotFound}
          </h2>
          <p className='text-gray-500 text-center mb-6'>
            {RECIPES_TEXT.recipeNotExists}
          </p>
          <Link to='/recipes'>
            <Button>
              <ArrowLeft className='w-4 h-4 mr-2' />
              {RECIPES_TEXT.backToRecipes}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-xs border-b sticky top-0 z-10'>
        <div className='px-4 py-4'>
          <div className='flex items-center gap-3'>
            <Link to='/recipes'>
              <Button variant='ghost' size='sm'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
            </Link>
            <h1 className='text-xl font-semibold text-gray-900 truncate'>
              {recipe.name}
            </h1>
          </div>
        </div>
      </div>

      <div className='p-4 space-y-6'>
        {/* Recipe Image */}
        {recipe.image_url && (
          <div className='aspect-video w-full overflow-hidden rounded-lg bg-gray-100'>
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              width={800}
              height={450}
              className='w-full h-full object-cover'
            />
          </div>
        )}

        {/* Recipe Title and Basic Info */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>
            {recipe.name}
          </h1>

          <div className='grid grid-cols-2 gap-4 mb-6'>
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Clock className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>
                    {RECIPES_TEXT.prepTime}
                  </p>
                  <p className='font-semibold text-gray-900'>
                    {recipe.prep_time} {RECIPES_TEXT.minutes}
                  </p>
                </div>
              </div>
            </Card>

            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <Users className='w-5 h-5 text-green-600' />
                </div>
                <div>
                  <p className='text-sm text-gray-500'>
                    {RECIPES_TEXT.servings}
                  </p>
                  <p className='font-semibold text-gray-900'>
                    {recipe.servings} {RECIPES_TEXT.portions}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Ingredients */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-xl font-bold flex items-center gap-2'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <ChefHat className='w-5 h-5 text-orange-600' />
              </div>
              {RECIPES_TEXT.ingredients}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3'>
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'
                >
                  <div className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0'>
                    {index + 1}
                  </div>
                  <span className='text-gray-800 font-medium'>
                    {ingredient}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='text-xl font-bold flex items-center gap-2'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Clock className='w-5 h-5 text-purple-600' />
              </div>
              {RECIPES_TEXT.instructions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className='flex gap-4'>
                  <div className='flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg'>
                    {index + 1}
                  </div>
                  <div className='flex-1 pt-2'>
                    <p className='text-gray-800 leading-relaxed'>
                      {instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
