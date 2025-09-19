import { cn } from '@/lib/utils';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { supabase } from '@/lib/supabase';
import { Camera, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  onImageReadyForAI?: (base64Image: string, mimeType: string) => void; // New prop for AI analysis
  className?: string;
  type: 'food-item' | 'recipe' | 'cosmetic';
  disabled?: boolean; // New prop to disable upload
}

export function ImageUpload({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  onImageReadyForAI,
  className = '',
  type,
  disabled = false,
}: Readonly<ImageUploadProps>) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`;

      // Resize image if it's too large
      const resizedFile = await resizeImage(file, 800, 600);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('food-images')
        .upload(fileName, resizedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('food-images').getPublicUrl(data.path);

      onImageUpload(publicUrl);
      setPreviewUrl(null); // Clear preview after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resizeImage = (
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();
      img.crossOrigin = 'anonymous'; // Important for CORS when drawing images to canvas

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg', // Always convert to JPEG for consistency and compression
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              // Fallback to original file if blob creation fails
              resolve(file);
            }
          },
          'image/jpeg',
          0.8 // Compression quality
        );
      };

      img.onerror = () => {
        console.error('Error loading image for resize.');
        resolve(file); // Resolve with original file on error
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB.');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreviewUrl(dataUrl);

        // Extract base64 and mimeType for AI analysis
        const [mimeTypePart, base64Data] = dataUrl.split(';');
        const mimeType = mimeTypePart.split(':')[1];
        const base64 = base64Data.split(',')[1];

        if (onImageReadyForAI) {
          onImageReadyForAI(base64, mimeType);
        }
      };
      reader.readAsDataURL(file);

      // Upload image to Supabase
      uploadImage(file);
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl) {
      try {
        // Extract file path from URL
        const url = new URL(currentImageUrl);
        // Supabase public URL path is /storage/v1/object/public/bucket_name/user_id/type/filename
        // We need user_id/type/filename
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('food-images');
        if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          await supabase.storage.from('food-images').remove([filePath]);
        } else {
          console.warn(
            'Could not parse file path from URL for deletion:',
            currentImageUrl
          );
        }
      } catch (error) {
        console.error('Error removing image from storage:', error);
      }
    }

    onImageRemove();
    setPreviewUrl(null);
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
        className='hidden'
      />

      {displayImageUrl ? (
        <Card className='relative'>
          <CardContent className='p-2'>
            <Dialog>
              <DialogTrigger asChild>
                <div className='relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in'>
                  <Image
                    src={displayImageUrl || '/placeholder.svg'}
                    alt='Food item'
                    className='object-cover object-center'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                  {uploading && (
                    <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                      <Loader2 className='w-6 h-6 text-white animate-spin' />
                      <div className='text-white text-sm ml-2'>
                        Uploading...
                      </div>
                    </div>
                  )}
                </div>
              </DialogTrigger>

              <DialogContent className='max-w-3xl w-full'>
                <DialogHeader>
                  <DialogTitle>Ảnh</DialogTitle>
                </DialogHeader>
                <div className='flex justify-center items-center'>
                  <Image
                    src={displayImageUrl || '/placeholder.svg'}
                    alt='Food item full size'
                    className='object-contain max-h-[80vh] w-auto'
                  />
                </div>
                <div className='mt-4 flex justify-end'>
                  <a
                    href={displayImageUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-600 underline'
                  >
                    Mở ảnh trong tab mới
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemoveImage}
              className='absolute top-1 right-1 h-8 w-8 p-0 bg-white shadow-md hover:bg-gray-100'
              disabled={uploading || disabled}
            >
              <X className='w-4 h-4' />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className='border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors'>
          <CardContent className='p-6'>
            <div
              role='button'
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              aria-label='Upload image'
              onKeyDown={(e: React.KeyboardEvent) => {
                if (disabled) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerFileInput();
                }
              }}
              className={cn(
                'flex flex-col items-center justify-center text-center',
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              )}
              onClick={triggerFileInput}
            >
              <div className='p-3 bg-gray-100 rounded-full mb-3'>
                <ImageIcon className='w-6 h-6 text-gray-600' />
              </div>
              <p className='text-sm font-medium text-gray-900 mb-1'>
                Add Photo
              </p>
              <p className='text-xs text-gray-500 mb-3'>
                Tap to upload an image
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={uploading || disabled}
                  className='bg-transparent'
                >
                  <Camera className='w-4 h-4 mr-2' />
                  Camera
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={uploading || disabled}
                  className='bg-transparent'
                >
                  <Upload className='w-4 h-4 mr-2' />
                  Gallery
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
