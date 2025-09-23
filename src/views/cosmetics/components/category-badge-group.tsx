import { Badge } from '@/components/ui/badge'
import type { CategoryWithType } from '@/hooks/use-categories'

type CategoryBadgeGroupProps = Readonly<{
  label: string
  categories: CategoryWithType[]
  activeCategory: string | 'all'
  onSelect: (categoryId: string) => void
  mobile?: boolean
}>

export function CategoryBadgeGroup({
  label,
  categories,
  activeCategory,
  onSelect,
  mobile,
}: CategoryBadgeGroupProps) {
  if (!categories.length) {
    return null
  }

  return (
    <div>
      <p className='text-xs font-medium uppercase text-gray-500 mb-1'>{label}</p>
      <div
        className={
          mobile
            ? 'flex flex-nowrap gap-2 overflow-x-auto pb-2'
            : 'flex flex-wrap gap-2'
        }
      >
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            className={
              'cursor-pointer' +
              (mobile ? ' whitespace-nowrap text-xs px-2 py-1' : '')
            }
            onClick={() => onSelect(category.id)}
          >
            {category.display_name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
