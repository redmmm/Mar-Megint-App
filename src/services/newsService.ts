// News Service for Supabase database operations
import { supabase } from '@/integrations/supabase/client';

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

export interface UpdateNewsPost extends Partial<CreateNewsPost> {
  id: string;
}

/**
 * Get all news posts, optionally filtered by category
 */
export const getNews = async (category?: 'marmegint' | 'jatszunk' | 'all'): Promise<NewsPost[]> => {
  try {
    let query = supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    return (data || []) as NewsPost[];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
};

/**
 * Add a new news post
 */
export const addNews = async (post: CreateNewsPost): Promise<NewsPost | null> => {
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .insert([{
        title: post.title,
        content: post.content,
        image_url: post.image_url || null,
        category: post.category
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding news:', error);
      throw error;
    }

    return data as NewsPost;
  } catch (error) {
    console.error('Failed to add news:', error);
    return null;
  }
};

/**
 * Update an existing news post
 */
export const updateNews = async (post: UpdateNewsPost): Promise<NewsPost | null> => {
  try {
    const { id, ...updateData } = post;

    const { data, error } = await supabase
      .from('news_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating news:', error);
      throw error;
    }

    return data as NewsPost;
  } catch (error) {
    console.error('Failed to update news:', error);
    return null;
  }
};

/**
 * Delete a news post
 */
export const deleteNews = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting news:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete news:', error);
    return false;
  }
};
