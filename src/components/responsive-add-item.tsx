import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

type ResponsiveAddItemProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export function ResponsiveAddItem({
  open,
  onOpenChange,
  trigger,
  title,
  children,
}: ResponsiveAddItemProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <div className='sm:hidden'>{trigger}</div>
        <DrawerContent className='max-h-[90vh] rounded-t-2xl'>
          <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4' />
          <DrawerHeader className='text-left'>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className='px-4'>{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className='hidden sm:block'>{trigger}</div>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
