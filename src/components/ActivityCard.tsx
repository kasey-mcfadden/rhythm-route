import React from 'react';
import { StravaActivity, SpotifyTrack } from '../types';
import { Play, Clock, MapPin, TrendingUp } from 'lucide-react';

interface ActivityCardProps {
  activity: StravaActivity;
  tracks: SpotifyTrack[];
  onActivityClick: (activity: StravaActivity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, tracks, onActivityClick }) => {
  const formatDistance = (distance: number) => {
    const km = distance / 1000;
    return `${km.toFixed(2)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (speed: number) => {
    const paceSeconds = 1000 / speed; // seconds per km
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecs = Math.floor(paceSeconds % 60);
    return `${paceMinutes}:${paceSecs.toString().padStart(2, '0')} /km`;
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
        return '🏃‍♂️';
      case 'ride':
      case 'cycling':
        return '🚴‍♂️';
      case 'walk':
        return '🚶‍♂️';
      case 'swim':
        return '🏊‍♂️';
      case 'hike':
        return '🥾';
      default:
        return '🏃‍♂️';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onActivityClick(activity)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getActivityIcon(activity.type)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
              <p className="text-sm text-gray-500">{activity.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {new Date(activity.start_date_local).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(activity.start_date_local).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MapPin className="w-4 h-4 text-blue-500 mr-1" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatDistance(activity.distance)}</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-green-500 mr-1" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatDuration(activity.moving_time)}</p>
            <p className="text-xs text-gray-500">Duration</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatPace(activity.average_speed)}</p>
            <p className="text-xs text-gray-500">Pace</p>
          </div>
        </div>

        {tracks.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center mb-3">
              <Play className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {tracks.length} track{tracks.length !== 1 ? 's' : ''} played
              </span>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {tracks.slice(0, 5).map((track) => (
                <div key={track.id} className="flex-shrink-0">
                                     <img
                     src={track.album.images[0]?.url || '/placeholder-album.svg'}
                     alt={track.album.name}
                     className="w-12 h-12 rounded-lg object-cover shadow-sm"
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.src = '/placeholder-album.svg';
                     }}
                   />
                </div>
              ))}
              {tracks.length > 5 && (
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">+{tracks.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard; 