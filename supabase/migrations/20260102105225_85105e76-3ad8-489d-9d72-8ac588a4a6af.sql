-- Create news_posts table
CREATE TABLE public.news_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  channel_tag TEXT NOT NULL CHECK (channel_tag IN ('marmegint', 'marmegint_jatszunk'))
);

-- Enable Row Level Security
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

-- Public can read all news
CREATE POLICY "Anyone can read news"
ON public.news_posts
FOR SELECT
USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can create news"
ON public.news_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
ON public.news_posts
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete news"
ON public.news_posts
FOR DELETE
TO authenticated
USING (true);

-- Insert some initial sample news
INSERT INTO public.news_posts (title, content, image_url, channel_tag) VALUES
('Új sorozat indul!', 'Hamarosan elindítjuk az új sorozatunkat, ami mindenkit le fog nyűgözni! Kövessetek minket a részletekért.', 'https://picsum.photos/seed/news1/800/450', 'marmegint'),
('Közösségi esemény', 'Találkozzunk élőben! A közösségünk számára szervezünk egy különleges eseményt. Részletek hamarosan.', 'https://picsum.photos/seed/news2/800/450', 'marmegint_jatszunk'),
('Mérföldkő: 100k feliratkozó!', 'Elértük a 100.000 feliratkozót! Köszönjük a támogatást mindenkinek! Ez egy hatalmas mérföldkő számunkra.', 'https://picsum.photos/seed/news3/800/450', 'marmegint');