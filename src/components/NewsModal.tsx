import { X } from 'lucide-react';
import { NewsPost } from '@/hooks/useNews';
import { formatDistanceToNow } from 'date-fns';
import { hu } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NewsModalProps {
  post: NewsPost;
  onClose: () => void;
}

export const NewsModal = ({ post, onClose }: NewsModalProps) => {
  const variant = post.category === 'marmegint' ? 'a' : 'b';
  const channelName = post.category === 'marmegint' ? 'Már megint?' : 'Már megint játszunk?';

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Image */}
        {post.image_url && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Metadata */}
          <div className="flex items-center gap-3 mb-4">
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
              variant === 'a'
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/20 text-secondary'
            )}>
              {channelName}
            </span>
            <span className="text-gray-400 text-sm">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
                locale: hu
              })}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h2>

          {/* Body Text */}
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};
