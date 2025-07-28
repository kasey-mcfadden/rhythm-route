import axios from 'axios';
import { StravaActivity } from '../types';

const STRAVA_CLIENT_ID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'https://kaseym.com/rhythm-route/#/auth/callback';

class StravaService {
  private baseURL = 'https://www.strava.com/api/v3';

  getAuthURL(): string {
    const params = new URLSearchParams({
      client_id: STRAVA_CLIENT_ID || '',
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'read,activity:read_all',
      approval_prompt: 'force',
    });
    return `https://www.strava.com/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }> {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }> {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });
    return response.data;
  }

  async getActivities(accessToken: string, page = 1, perPage = 30): Promise<StravaActivity[]> {
    const response = await axios.get(`${this.baseURL}/athlete/activities`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data;
  }

  async getActivity(accessToken: string, activityId: number): Promise<StravaActivity> {
    const response = await axios.get(`${this.baseURL}/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  formatDistance(distance: number): string {
    const km = distance / 1000;
    return `${km.toFixed(2)} km`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  formatPace(speed: number): string {
    const paceSeconds = 1000 / speed; // seconds per km
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = Math.floor(paceSeconds % 60);
    return `${paceMinutes}:${paceSecs.toString().padStart(2, '0')} /km`;
  }
}

const stravaService = new StravaService();
export default stravaService; 