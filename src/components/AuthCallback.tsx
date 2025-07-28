import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import stravaService from '../services/stravaService';
import spotifyService from '../services/spotifyService';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      console.log('AuthCallback: Starting authentication process');
      console.log('Current URL:', window.location.href);
      
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');
      
      console.log('Code:', code);
      console.log('Error:', error);
      console.log('State:', state);

      if (error) {
        console.error('Authentication error received:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        setStatus('error');
        setMessage('No authorization code received');
        return;
      }

      try {
        // Determine which service this callback is for based on the URL or state
        const isSpotify = window.location.pathname.includes('spotify');
        console.log('Is Spotify callback:', isSpotify);
        
        if (isSpotify) {
          console.log('Processing Spotify authentication...');
          const tokenData = await spotifyService.exchangeCodeForToken(code);
          localStorage.setItem('spotify_access_token', tokenData.access_token);
          localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
          localStorage.setItem('spotify_expires_at', (Date.now() + tokenData.expires_in * 1000).toString());
          console.log('Spotify authentication successful');
        } else {
          console.log('Processing Strava authentication...');
          const tokenData = await stravaService.exchangeCodeForToken(code);
          localStorage.setItem('strava_access_token', tokenData.access_token);
          localStorage.setItem('strava_refresh_token', tokenData.refresh_token);
          localStorage.setItem('strava_expires_at', tokenData.expires_at.toString());
          console.log('Strava authentication successful');
        }

        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect back to the main app
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 