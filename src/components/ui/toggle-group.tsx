import type {
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from '@radix-ui/react-toggle-group';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { toggleVariants } from '@/components/ui/toggle-variants';
import { cn } from '@/lib/utils';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: 'default',
  variant: 'default',
});

type ToggleGroupProps =
  | (ToggleGroupSingleProps & VariantProps<typeof toggleVariants>)
  | (ToggleGroupMultipleProps & VariantProps<typeof toggleVariants>);

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, type = 'single', ...props }, ref) => {
  const commonProps = {
    ref,
    className: cn('flex items-center justify-center gap-1', className),
    disabled: props.disabled,
    rovingFocus: props.rovingFocus,
  };

  // Use conditional rendering to ensure proper type discrimination
  if (type === 'multiple') {
    return (
      <ToggleGroupPrimitive.Root
        {...commonProps}
        value={props.value as string[] | undefined}
        defaultValue={props.defaultValue as string[] | undefined}
        onValueChange={
          props.onValueChange as ((value: string[]) => void) | undefined
        }
        type='multiple'
      >
        <ToggleGroupContext.Provider value={{ variant, size }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  }

  return (
    <ToggleGroupPrimitive.Root
      {...commonProps}
      value={props.value as string | undefined}
      defaultValue={props.defaultValue as string | undefined}
      onValueChange={
        props.onValueChange as ((value: string) => void) | undefined
      }
      type='single'
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, value = '', ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      value={value}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
