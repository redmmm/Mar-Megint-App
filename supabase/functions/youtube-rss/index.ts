import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory cache with 5-minute TTL
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log(`Cache hit for: ${key}`);
    return entry.data;
  }
  if (entry) {
    cache.delete(key);
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`Cached: ${key}`);
}

// Parse YouTube RSS XML
function parseVideoXML(xml: string): any[] {
  const videos: any[] = [];
  
  // Extract entries using regex (Deno doesn't have DOMParser in edge functions)
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
    const author = entry.match(/<name>([^<]+)<\/name>/)?.[1] || '';
    
    // Extract description from media:group
    const mediaGroup = entry.match(/<media:group>([\s\S]*?)<\/media:group>/)?.[1] || '';
    const description = mediaGroup.match(/<media:description>([^<]*)<\/media:description>/)?.[1] || '';
    
    // Thumbnail URL
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    
    if (videoId) {
      videos.push({
        id: videoId,
        title: decodeXMLEntities(title),
        description: decodeXMLEntities(description),
        thumbnail,
        publishedAt: published,
        channelTitle: decodeXMLEntities(author),
      });
    }
  }
  
  return videos;
}

function decodeXMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // 'channel' or 'playlist'
    const id = url.searchParams.get('id');
    
    if (!type || !id) {
      return new Response(
        JSON.stringify({ error: 'Missing type or id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const cacheKey = `${type}:${id}`;
    
    // Check cache first
    const cached = getCached(cacheKey);
    if (cached) {
      return new Response(
        JSON.stringify({ videos: cached, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Build RSS URL
    let rssUrl: string;
    if (type === 'channel') {
      rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${id}`;
    } else if (type === 'playlist') {
      rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Use "channel" or "playlist"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Fetching RSS: ${rssUrl}`);
    
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSSFetcher/1.0)',
      },
    });
    
    if (!response.ok) {
      console.error(`RSS fetch failed: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `Failed to fetch RSS feed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const xml = await response.text();
    const videos = parseVideoXML(xml);
    
    console.log(`Parsed ${videos.length} videos from ${type}:${id}`);
    
    // Cache the result
    setCache(cacheKey, videos);
    
    return new Response(
      JSON.stringify({ videos, cached: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in youtube-rss function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
