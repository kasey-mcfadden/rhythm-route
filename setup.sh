#!/bin/bash

echo "🎵🏃‍♂️ Welcome to RhythmRoute Setup! 🎵🏃‍♂️"
echo ""
echo "This script will help you set up your RhythmRoute application."
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit the .env file with your API credentials:"
    echo "   - Get your Strava API credentials from: https://www.strava.com/settings/api"
    echo "   - Get your Spotify API credentials from: https://developer.spotify.com/dashboard"
    echo ""
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies already installed"
else
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your API credentials"
echo "2. Run 'npm start' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀" 