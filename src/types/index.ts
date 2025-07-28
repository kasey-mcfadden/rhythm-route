export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  elev_high?: number;
  elev_low?: number;
  upload_id?: number;
  external_id?: string;
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  private?: boolean;
  flagged?: boolean;
  workout_type?: number;
  average_temp?: number;
  has_kudoed?: boolean;
  suffer_score?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  played_at?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface ActivityWithTracks {
  activity: StravaActivity;
  tracks: SpotifyTrack[];
}

export interface AuthState {
  strava: {
    isAuthenticated: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };
  spotify: {
    isAuthenticated: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  };
} 