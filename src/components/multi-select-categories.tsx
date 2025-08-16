import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface Category {
  name: string;
  display_name?: string;
}

interface MultiSelectCategoriesProps {
  categories: string[];
  userCategories: Category[];
  selectedCategories: string[];
  onSelectionChange: (categories: string[]) => void;
}

export function MultiSelectCategories({
  categories,
  userCategories,
  selectedCategories,
  onSelectionChange,
}: MultiSelectCategoriesProps) {
  const [open, setOpen] = useState(false);

  const getDisplayName = (category: string) => {
    if (category === 'all') return 'Tất cả';
    const userCategory = userCategories.find((cat) => cat.name === category);
    return (
      userCategory?.display_name ||
      category.charAt(0).toUpperCase() + category.slice(1)
    );
  };

  const handleSelect = (category: string) => {
    if (category === 'all') {
      // If "All" is selected, clear all other selections
      onSelectionChange(['all']);
    } else {
      // Remove "all" if it's selected and add the new category
      const newSelection = selectedCategories.filter((cat) => cat !== 'all');

      if (selectedCategories.includes(category)) {
        // Remove category if already selected
        const filtered = newSelection.filter((cat) => cat !== category);
        onSelectionChange(filtered.length === 0 ? ['all'] : filtered);
      } else {
        // Add category
        onSelectionChange([...newSelection, category]);
      }
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const filtered = selectedCategories.filter(
      (cat) => cat !== categoryToRemove
    );
    onSelectionChange(filtered.length === 0 ? ['all'] : filtered);
  };

  const clearAll = () => {
    onSelectionChange(['all']);
  };

  const getButtonText = () => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) {
      return 'Tất cả danh mục';
    }
    if (selectedCategories.length === 1) {
      return getDisplayName(selectedCategories[0]);
    }
    return `${selectedCategories.length} danh mục đã chọn`;
  };

  return (
    <div className='space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {getButtonText()}
            <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput placeholder='Tìm kiếm danh mục...' />
            <CommandList>
              <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={() => handleSelect(category)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedCategories.includes(category) ||
                        (category !== 'all' &&
                          selectedCategories.includes('all'))
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    />
                    {getDisplayName(category)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected categories badges */}
      {!selectedCategories.includes('all') && selectedCategories.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant='secondary'
              className='text-xs px-2 py-1'
            >
              {getDisplayName(category)}
              <button
                onClick={() => removeCategory(category)}
                className='ml-1 hover:bg-gray-200 rounded-full p-0.5'
                aria-label={`Remove ${getDisplayName(category)}`}
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ))}
          <Button
            variant='ghost'
            size='sm'
            onClick={clearAll}
            className='h-6 px-2 text-xs text-gray-500 hover:text-gray-700'
          >
            Xóa tất cả
          </Button>
        </div>
      )}
    </div>
  );
}
