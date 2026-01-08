import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNews, addNews, updateNews, deleteNews } from '@/services/newsService';
import { ChannelTag } from '@/lib/youtube';

export interface NewsPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  category: 'marmegint' | 'jatszunk';
}

export interface CreateNewsPost {
  title: string;
  content: string;
  image_url?: string;
  category: 'marmegint' | 'jatszunk';
}

export const useNews = (channelTag?: ChannelTag | 'all') => {
  return useQuery<NewsPost[]>({
    queryKey: ['news', channelTag],
    queryFn: async () => {
      const category = channelTag === 'marmegint_jatszunk' ? 'jatszunk' : channelTag;
      return await getNews(category as any);
    },
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: CreateNewsPost) => {
      return await addNews(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...post }: Partial<CreateNewsPost> & { id: string }) => {
      return await updateNews({ id, ...post });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteNews(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};
