# RhythmRoute 🎵🏃‍♂️

RhythmRoute is a web application that integrates with Strava and Spotify to display the media you listen to during your Strava activities, complete with album artwork.

## Features

- **Strava Integration**: Connect your Strava account to fetch your activities
- **Spotify Integration**: Connect your Spotify account to access your listening history
- **Activity-Track Matching**: Automatically match tracks played during your activities
- **Beautiful UI**: Modern, responsive design with album artwork display
- **Real-time Data**: View your recent activities and the music you listened to

## Prerequisites

Before running this application, you'll need to set up API access for both Strava and Spotify:

### Strava API Setup

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Set the Authorization Callback Domain to `localhost` (for development)
4. Note your Client ID and Client Secret

### Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:3000/auth/spotify/callback` to your Redirect URIs
4. Note your Client ID and Client Secret

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_STRAVA_CLIENT_ID=your_strava_client_id
REACT_APP_STRAVA_CLIENT_SECRET=your_strava_client_secret
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rhythm-route
```

2. Install dependencies:
```bash
npm install
```

3. Create the `.env` file with your API credentials (see above)

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Connect Accounts**: Click the "Connect Strava" and "Connect Spotify" buttons to authorize the application
2. **View Activities**: Once both accounts are connected, your recent Strava activities will be displayed
3. **Explore Tracks**: Click on any activity to see the tracks you listened to during that activity
4. **View Album Art**: Each track displays its album artwork and links to Spotify

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Project Structure

```
src/
├── components/          # React components
│   ├── ActivityCard.tsx
│   ├── AuthButton.tsx
│   └── TrackList.tsx
├── services/           # API services
│   ├── stravaService.ts
│   └── spotifyService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## API Integration

### Strava API
- Fetches user activities with detailed information
- Handles OAuth 2.0 authentication
- Supports token refresh

### Spotify API
- Retrieves recently played tracks
- Matches tracks to activity timeframes
- Displays album artwork and track metadata

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Strava API](https://developers.strava.com/) for activity data
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons 