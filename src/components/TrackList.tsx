import React from 'react';
import { SpotifyTrack } from '../types';
import { Play, Clock, ExternalLink } from 'lucide-react';

interface TrackListProps {
  tracks: SpotifyTrack[];
  activityName: string;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, activityName }) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPlayedAt = (playedAt: string) => {
    return new Date(playedAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks found</h3>
        <p className="text-gray-500">
          No Spotify tracks were played during this activity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Tracks from "{activityName}"
        </h2>
        <span className="text-sm text-gray-500">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                                 <img
                   src={track.album.images[0]?.url || '/placeholder-album.svg'}
                   alt={track.album.name}
                   className="w-16 h-16 rounded-lg object-cover shadow-sm"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.src = '/placeholder-album.svg';
                   }}
                 />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {track.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {track.album.name}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(track.duration_ms)}
                    </div>
                    
                    {track.played_at && (
                      <div className="text-sm text-gray-500">
                        {formatPlayedAt(track.played_at)}
                      </div>
                    )}
                    
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList; 