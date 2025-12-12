import express from 'express';
import cors from 'cors';
import { getSpotifyClient } from './spotify.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/spotify/search', async (req, res) => {
  try {
    const { q, type = 'track', limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const spotify = await getSpotifyClient();
    const results = await spotify.search(q, [type], undefined, limit);
    
    if (type === 'track' && results.tracks) {
      const tracks = results.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        image: track.album.images[0]?.url || '',
        previewUrl: track.preview_url,
        externalUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        uri: track.uri
      }));
      
      return res.json({ tracks, total: results.tracks.total });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Spotify search error:', error);
    res.status(500).json({ error: error.message || 'Failed to search Spotify' });
  }
});

app.get('/api/spotify/featured', async (req, res) => {
  try {
    const spotify = await getSpotifyClient();
    const featured = await spotify.browse.getFeaturedPlaylists();
    
    const playlists = featured.playlists.items.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images[0]?.url || '',
      tracksCount: playlist.tracks.total
    }));
    
    res.json({ playlists });
  } catch (error) {
    console.error('Featured playlists error:', error);
    res.status(500).json({ error: error.message || 'Failed to get featured playlists' });
  }
});

app.get('/api/spotify/new-releases', async (req, res) => {
  try {
    const spotify = await getSpotifyClient();
    const releases = await spotify.browse.getNewReleases();
    
    const albums = releases.albums.items.map(album => ({
      id: album.id,
      name: album.name,
      artist: album.artists.map(a => a.name).join(', '),
      image: album.images[0]?.url || '',
      releaseDate: album.release_date,
      totalTracks: album.total_tracks
    }));
    
    res.json({ albums });
  } catch (error) {
    console.error('New releases error:', error);
    res.status(500).json({ error: error.message || 'Failed to get new releases' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Spotify API server running on port ${PORT}`);
});
