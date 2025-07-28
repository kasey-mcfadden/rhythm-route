#!/bin/bash

echo "🚀 RhythmRoute GitHub Pages Deployment Setup"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
    echo ""
fi

# Get GitHub username
echo "🔧 Configuration"
echo "Please enter your GitHub username:"
read github_username

# Update package.json homepage
sed -i '' "s/yourusername/$github_username/g" package.json

echo ""
echo "✅ Updated package.json with your GitHub username"
echo ""

echo "📋 Next Steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: rhythm-route"
echo "   - Make it public"
echo "   - Don't initialize with README (we already have one)"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/$github_username/rhythm-route.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Set up GitHub Secrets:"
echo "   - Go to your repository → Settings → Secrets and variables → Actions"
echo "   - Add these repository secrets:"
echo "     - REACT_APP_STRAVA_CLIENT_ID"
echo "     - REACT_APP_STRAVA_CLIENT_SECRET"
echo "     - REACT_APP_SPOTIFY_CLIENT_ID"
echo "     - REACT_APP_SPOTIFY_CLIENT_SECRET"
echo ""
echo "4. Update API redirect URIs:"
echo "   - Strava: https://$github_username.github.io/auth/callback"
echo "   - Spotify: https://$github_username.github.io/auth/spotify/callback"
echo ""
echo "5. Enable GitHub Pages:"
echo "   - Go to repository Settings → Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: gh-pages"
echo "   - Folder: / (root)"
echo ""
echo "6. Deploy:"
echo "   npm run deploy"
echo ""
echo "🎉 Your app will be live at: https://$github_username.github.io/rhythm-route"
echo ""
echo "For custom domain setup, see DEPLOYMENT.md" 