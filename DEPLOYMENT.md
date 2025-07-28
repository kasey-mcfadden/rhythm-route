# 🚀 Deployment Guide for RhythmRoute

## GitHub Pages Deployment

### **Step 1: Prepare Your Repository**

1. **Update package.json homepage**:
   ```json
   "homepage": "https://yourusername.github.io/rhythm-route"
   ```
   Replace `yourusername` with your actual GitHub username.

2. **Create a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/rhythm-route.git
   git push -u origin main
   ```

### **Step 2: Configure Environment Variables**

**IMPORTANT**: Never commit your `.env` file to GitHub!

1. **For GitHub Pages**, you'll need to set environment variables in your repository settings:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following repository secrets:
     - `REACT_APP_STRAVA_CLIENT_ID`
     - `REACT_APP_STRAVA_CLIENT_SECRET`
     - `REACT_APP_SPOTIFY_CLIENT_ID`
     - `REACT_APP_SPOTIFY_CLIENT_SECRET`

2. **Update redirect URIs** in your API apps:
   - **Strava**: Add `https://yourusername.github.io/auth/callback`
   - **Spotify**: Add `https://yourusername.github.io/auth/spotify/callback`

### **Step 3: Create GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Create .env file
      run: |
        echo "REACT_APP_STRAVA_CLIENT_ID=${{ secrets.REACT_APP_STRAVA_CLIENT_ID }}" >> .env
        echo "REACT_APP_STRAVA_CLIENT_SECRET=${{ secrets.REACT_APP_STRAVA_CLIENT_SECRET }}" >> .env
        echo "REACT_APP_SPOTIFY_CLIENT_ID=${{ secrets.REACT_APP_SPOTIFY_CLIENT_ID }}" >> .env
        echo "REACT_APP_SPOTIFY_CLIENT_SECRET=${{ secrets.REACT_APP_SPOTIFY_CLIENT_SECRET }}" >> .env
        echo "REACT_APP_REDIRECT_URI=https://yourusername.github.io/auth/callback" >> .env
        echo "REACT_APP_SPOTIFY_REDIRECT_URI=https://yourusername.github.io/auth/spotify/callback" >> .env
        
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

### **Step 4: Enable GitHub Pages**

1. Go to your repository → Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` (will be created automatically)
4. **Folder**: `/ (root)`
5. Click **Save**

### **Step 5: Deploy**

```bash
npm run deploy
```

## Custom Domain Setup

### **For a subdomain of your personal site:**

1. **Add CNAME record** to your domain:
   ```
   rhythm.yourdomain.com CNAME yourusername.github.io
   ```

2. **Update package.json**:
   ```json
   "homepage": "https://rhythm.yourdomain.com"
   ```

3. **Update redirect URIs**:
   - **Strava**: `https://rhythm.yourdomain.com/auth/callback`
   - **Spotify**: `https://rhythm.yourdomain.com/auth/spotify/callback`

4. **Configure GitHub Pages**:
   - Go to repository Settings → Pages
   - Add your custom domain: `rhythm.yourdomain.com`
   - Check "Enforce HTTPS"

## Production Considerations

### **Security:**
- ✅ Environment variables are secure (not in client-side code)
- ✅ OAuth tokens are stored in localStorage (user's browser)
- ✅ No sensitive data in the repository

### **API Limits:**
- **Strava**: 1000 requests per day, 100 per 15 minutes
- **Spotify**: 25 requests per second

### **Performance:**
- React app is optimized for production builds
- Static assets are served via CDN
- No server-side processing required

## Troubleshooting

### **Common Issues:**

1. **404 errors on refresh**: This is normal for SPA routing
   - Solution: Add a `404.html` that redirects to `index.html`

2. **CORS issues**: Shouldn't occur with GitHub Pages
   - All requests are to external APIs

3. **Environment variables not working**:
   - Check GitHub Secrets are set correctly
   - Verify the workflow creates the `.env` file

### **Testing:**
- Test locally with production URLs
- Verify OAuth flows work with production redirect URIs
- Check that all features work in the deployed version

## Alternative Deployment Options

### **Netlify:**
- Free tier available
- Automatic deployments from GitHub
- Custom domain support
- Environment variables in dashboard

### **Vercel:**
- Excellent for React apps
- Automatic deployments
- Custom domain support
- Built-in analytics

### **Firebase Hosting:**
- Google's hosting solution
- Good performance
- Custom domain support
- Easy SSL certificates 