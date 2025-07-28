import React from 'react';
import { ExternalLink } from 'lucide-react';

interface AuthButtonProps {
  provider: 'strava' | 'spotify';
  onClick: () => void;
  isAuthenticated: boolean;
  isLoading?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  provider, 
  onClick, 
  isAuthenticated, 
  isLoading = false 
}) => {
  const getProviderInfo = () => {
    switch (provider) {
      case 'strava':
        return {
          name: 'Strava',
          color: 'bg-orange-500 hover:bg-orange-600',
          icon: '🏃‍♂️',
          description: 'Connect your Strava account to sync your activities'
        };
      case 'spotify':
        return {
          name: 'Spotify',
          color: 'bg-green-500 hover:bg-green-600',
          icon: '🎵',
          description: 'Connect your Spotify account to see your listening history'
        };
      default:
        return {
          name: 'Unknown',
          color: 'bg-gray-500 hover:bg-gray-600',
          icon: '❓',
          description: 'Connect your account'
        };
    }
  };

  const providerInfo = getProviderInfo();

  if (isAuthenticated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{providerInfo.icon}</span>
          <div>
            <h3 className="font-semibold text-green-800">
              {providerInfo.name} Connected
            </h3>
            <p className="text-sm text-green-600">
              Your {providerInfo.name} account is connected
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg
        text-white font-medium transition-all duration-200
        ${providerInfo.color}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'}
      `}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <>
          <span className="text-xl">{providerInfo.icon}</span>
          <span>Connect {providerInfo.name}</span>
          <ExternalLink className="w-4 h-4" />
        </>
      )}
    </button>
  );
};

export default AuthButton; 