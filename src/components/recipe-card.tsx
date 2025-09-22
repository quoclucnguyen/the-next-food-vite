import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Clock, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router';

interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    ingredients: string[];
    instructions: string[];
    prep_time: number;
    servings: number;
    image_url: string | null;
  };
  onDelete: (id: string) => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-lg'>{recipe.name}</CardTitle>
          <Button variant='ghost' size='sm' onClick={() => onDelete(recipe.id)}>
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Recipe Image */}
        {recipe.image_url && (
          <div className='mb-4'>
            <div className='aspect-video w-full overflow-hidden rounded-lg bg-gray-100'>
              <Image
                src={recipe.image_url || '/placeholder.svg'}
                alt={recipe.name}
                width={400}
                height={225}
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        )}

        <div className='flex items-center gap-4 mb-3'>
          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <Clock className='w-4 h-4' />
            {recipe.prep_time} min
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <Users className='w-4 h-4' />
            {recipe.servings} servings
          </div>
        </div>

        <div className='mb-3'>
          <h4 className='font-medium text-sm mb-2'>Ingredients:</h4>
          <div className='flex flex-wrap gap-1'>
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <Badge key={index} variant='secondary' className='text-xs'>
                {ingredient}
              </Badge>
            ))}
            {recipe.ingredients.length > 3 && (
              <Badge variant='outline' className='text-xs'>
                +{recipe.ingredients.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Link to={`/recipes/${recipe.id}`}>
          <Button variant='outline' size='sm' className='w-full bg-transparent'>
            View Recipe
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
