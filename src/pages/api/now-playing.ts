import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const runtime = locals.runtime as { env: Record<string, string> } | undefined;
  const API_KEY = runtime?.env?.LASTFM_API_KEY || import.meta.env.LASTFM_API_KEY;
  const USERNAME = runtime?.env?.LASTFM_USERNAME || import.meta.env.LASTFM_USERNAME || 'your_username';

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`
    );

    const data = await res.json();
    const track = data.recenttracks?.track?.[0];

    if (!track) {
      return new Response(JSON.stringify({ nowPlaying: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      song: track.name,
      artist: track.artist['#text'],
      album: track.album['#text'],
      image: track.image?.[2]?.['#text'] || null,
      songUrl: track.url || null,
      artistUrl: `https://www.last.fm/music/${encodeURIComponent(track.artist['#text'])}`,
      nowPlaying: track['@attr']?.nowplaying === 'true'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
