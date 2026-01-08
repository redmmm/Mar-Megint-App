import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewVideosBadgeProps {
  onClick: () => void;
  className?: string;
}

export const NewVideosBadge = ({ onClick, className }: NewVideosBadgeProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-40',
        'flex items-center gap-2 px-5 py-3 rounded-full',
        'premium-glass border-primary/30',
        'text-primary shadow-lg glow-green',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        'hover:scale-105 transition-transform',
        className
      )}
    >
      <Bell className="w-4 h-4 animate-pulse" />
      <span className="font-medium text-sm">Új videó elérhető!</span>
    </button>
  );
};
