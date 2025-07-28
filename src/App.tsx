import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StravaActivity, SpotifyTrack, AuthState } from './types';
import stravaService from './services/stravaService';
import spotifyService from './services/spotifyService';
import ActivityCard from './components/ActivityCard';
import TrackList from './components/TrackList';
import AuthButton from './components/AuthButton';
import AuthCallback from './components/AuthCallback';
import { Music, Activity, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    strava: { isAuthenticated: false },
    spotify: { isAuthenticated: false }
  });
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [recentTracks, setRecentTracks] = useState<Array<{ track: SpotifyTrack; played_at: string }>>([]);
  const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null);
  const [activityTracks, setActivityTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  const loadActivities = useCallback(async () => {
    if (!authState.strava.accessToken) return;
    
    try {
      setLoading(true);
      const activitiesData = await stravaService.getActivities(authState.strava.accessToken);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading activities:', error);
      // Handle token refresh or re-authentication
    } finally {
      setLoading(false);
    }
  }, [authState.strava.accessToken]);

  const loadRecentTracks = useCallback(async () => {
    if (!authState.spotify.accessToken) return;
    
    try {
      const tracksData = await spotifyService.getRecentlyPlayed(authState.spotify.accessToken, 100);
      setRecentTracks(tracksData.items);
    } catch (error) {
      console.error('Error loading recent tracks:', error);
    }
  }, [authState.spotify.accessToken]);

  useEffect(() => {
    // Check for existing tokens in localStorage
    const stravaToken = localStorage.getItem('strava_access_token');
    const spotifyToken = localStorage.getItem('spotify_access_token');
    
    if (stravaToken) {
      setAuthState(prev => ({
        ...prev,
        strava: { 
          isAuthenticated: true, 
          accessToken: stravaToken,
          refreshToken: localStorage.getItem('strava_refresh_token') || undefined,
          expiresAt: Number(localStorage.getItem('strava_expires_at') || 0)
        }
      }));
    }
    
    if (spotifyToken) {
      setAuthState(prev => ({
        ...prev,
        spotify: { 
          isAuthenticated: true, 
          accessToken: spotifyToken,
          refreshToken: localStorage.getItem('spotify_refresh_token') || undefined,
          expiresAt: Number(localStorage.getItem('spotify_expires_at') || 0)
        }
      }));
    }
  }, []);

  useEffect(() => {
    if (authState.strava.isAuthenticated && authState.strava.accessToken) {
      loadActivities();
    }
  }, [authState.strava.isAuthenticated, authState.strava.accessToken, loadActivities]);

  useEffect(() => {
    if (authState.spotify.isAuthenticated && authState.spotify.accessToken) {
      loadRecentTracks();
    }
  }, [authState.spotify.isAuthenticated, authState.spotify.accessToken, loadRecentTracks]);

  const handleStravaAuth = () => {
    const authUrl = stravaService.getAuthURL();
    window.location.href = authUrl;
  };

  const handleSpotifyAuth = () => {
    const authUrl = spotifyService.getAuthURL();
    window.location.href = authUrl;
  };

  const handleActivityClick = (activity: StravaActivity) => {
    setSelectedActivity(activity);
    
    // Find tracks that were played during this activity
    const activityStart = new Date(activity.start_date);
    const activityEnd = new Date(activityStart.getTime() + activity.elapsed_time * 1000);
    
    const tracksInActivity = spotifyService.getTracksInTimeRange(
      recentTracks,
      activityStart,
      activityEnd
    );
    
    setActivityTracks(tracksInActivity);
  };

  const handleBackToActivities = () => {
    setSelectedActivity(null);
    setActivityTracks([]);
  };

  const getActivitiesWithTracks = () => {
    return activities.map(activity => {
      const activityStart = new Date(activity.start_date);
      const activityEnd = new Date(activityStart.getTime() + activity.elapsed_time * 1000);
      
      const tracks = spotifyService.getTracksInTimeRange(
        recentTracks,
        activityStart,
        activityEnd
      );
      
      return { activity, tracks };
    });
  };

  const activitiesWithTracks = getActivitiesWithTracks();

  const renderMainContent = () => {
    if (!authState.strava.isAuthenticated || !authState.spotify.isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-purple-600 mr-2" />
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">RhythmRoute</h1>
              <p className="text-gray-600">
                Connect your Strava activities with your Spotify listening history
              </p>
            </div>
            
            <div className="space-y-4">
              <AuthButton
                provider="strava"
                onClick={handleStravaAuth}
                isAuthenticated={authState.strava.isAuthenticated}
              />
              <AuthButton
                provider="spotify"
                onClick={handleSpotifyAuth}
                isAuthenticated={authState.spotify.isAuthenticated}
              />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Connect both accounts to start exploring your rhythm and route data
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {selectedActivity ? (
            <div>
              <button
                onClick={handleBackToActivities}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Activities
              </button>
              <TrackList tracks={activityTracks} activityName={selectedActivity.name} />
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Activities</h1>
                <p className="text-gray-600">
                  Click on an activity to see the tracks you listened to
                </p>
              </div>
              
              {loading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activitiesWithTracks.map(({ activity, tracks }) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      tracks={tracks}
                      onActivityClick={handleActivityClick}
                    />
                  ))}
                </div>
              )}
              
              {activities.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                  <p className="text-gray-500">
                    Your Strava activities will appear here once you have some recent activities.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/spotify/callback" element={<AuthCallback />} />
        <Route path="*" element={renderMainContent()} />
      </Routes>
    </Router>
  );
};

export default App; 