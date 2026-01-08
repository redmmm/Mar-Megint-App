import { Calendar, Tag } from 'lucide-react';
import { NewsPost } from '@/hooks/useNews';
import { formatDistanceToNow } from 'date-fns';
import { hu } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  post: NewsPost;
  onClick: () => void;
  showTag?: boolean;
  tall?: boolean;
}

export const NewsCard = ({ post, showTag = false, tall = false, onClick }: NewsCardProps) => {
  const variant = post.category === 'marmegint' ? 'a' : 'b';
  const channelName = post.category === 'marmegint' ? 'Már megint?' : 'Már megint játszunk?';

  return (
    <article
      className={cn(
        'premium-glass premium-glass-hover overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300',
        tall && 'md:row-span-2'
      )}
      onClick={onClick}
    >
      {/* Image */}
      {post.image_url && (
        <div className={cn(
          'overflow-hidden',
          tall ? 'aspect-[4/3]' : 'aspect-video'
        )}>
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      
      {/* Content */}
      <div className={cn('p-5', tall && 'p-6')}>
        {/* Tags */}
        <div className="flex items-center gap-3 mb-3">
          {showTag && (
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
              variant === 'a' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-secondary/20 text-secondary'
            )}>
              <Tag className="w-3 h-3" />
              {channelName}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(post.created_at), { 
              addSuffix: true, 
              locale: hu 
            })}
          </span>
        </div>
        
        {/* Title */}
        <h3 className={cn(
          'font-bold mb-2 line-clamp-2 text-gradient',
          tall ? 'text-xl' : 'text-lg'
        )}>
          {post.title}
        </h3>
        
        {/* Content preview */}
        <p className={cn(
          'text-muted-foreground text-sm',
          tall ? 'line-clamp-4' : 'line-clamp-3'
        )}>
          {post.content}
        </p>
      </div>
    </article>
  );
};