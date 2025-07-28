import axios from 'axios';
import { SpotifyTrack } from '../types';

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || 'https://kaseym.com/rhythm-route/auth/spotify/callback';

class SpotifyService {
  private baseURL = 'https://api.spotify.com/v1';

  getAuthURL(): string {
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID || '',
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'user-read-recently-played user-read-private user-read-email',
      show_dialog: 'true',
    });
    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  }

  async getRecentlyPlayed(accessToken: string, limit = 50): Promise<{
    items: Array<{
      track: SpotifyTrack;
      played_at: string;
    }>;
  }> {
    const response = await axios.get(`${this.baseURL}/me/player/recently-played`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit,
      },
    });
    return response.data;
  }

  async getCurrentUser(accessToken: string): Promise<{
    id: string;
    display_name: string;
    email: string;
    images: Array<{ url: string; height: number; width: number }>;
  }> {
    const response = await axios.get(`${this.baseURL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getTracksInTimeRange(
    tracks: Array<{ track: SpotifyTrack; played_at: string }>,
    startTime: Date,
    endTime: Date
  ): SpotifyTrack[] {
    return tracks
      .filter(({ played_at }) => {
        const playedAt = new Date(played_at);
        return playedAt >= startTime && playedAt <= endTime;
      })
      .map(({ track, played_at }) => ({
        ...track,
        played_at: played_at,
      }));
  }
}

const spotifyService = new SpotifyService();
export default spotifyService; 