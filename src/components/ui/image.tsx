import { type ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fallbackSrc?: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      fallbackSrc = '/placeholder.svg',
      ...props
    },
    ref
  ) => {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      if (fallbackSrc && target.src !== fallbackSrc) {
        target.src = fallbackSrc;
      }
    };

    return (
      <img
        ref={ref}
        src={src || fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn('object-cover', className)}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export { Image };
