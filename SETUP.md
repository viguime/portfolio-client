# Quick Setup Guide

## ✅ Your Portfolio is Ready!

Both servers are currently running:
- **Frontend**: http://localhost:5173
- **API Server**: http://localhost:3000

## 🎨 Customize Your Portfolio

Before sharing your portfolio, update these files with your information:

### 1. Hero Section
**File**: `src/components/Hero.tsx`
```typescript
// Line 17: Change "Your Name" to your actual name
<h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
  Your Name  {/* ← Change this */}
</h1>

// Line 11: Customize your tech stack
const techs = ['React', 'TypeScript', 'Node'];  {/* ← Add your technologies */}
```

### 2. GitHub Integration
**File**: `src/components/GitHubReadme.tsx`
```typescript
// Line 13: Replace YOUR_USERNAME with your GitHub username
fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_USERNAME/readme')
```

**File**: `src/components/Projects.tsx`
```typescript
// Line 28: Replace YOUR_USERNAME with your GitHub username
fetch('https://api.github.com/users/YOUR_USERNAME/repos?sort=updated&per_page=3')
```

### 3. Footer Links
**File**: `src/components/Footer.tsx`
```typescript
// Line 11: Update your email
href="mailto:your@email.com"  {/* ← Change email */}

// Line 18: Update your GitHub URL
href="https://github.com/YOUR_USERNAME"  {/* ← Change GitHub username */}
```

## 🚀 Running the Portfolio

### Start Both Servers

**Terminal 1 - Frontend:**
```bash
nvm use node  # Ensure you're using Node 20+
npm run dev
```

**Terminal 2 - API Server:**
```bash
node server.js
```

### Single Command Alternative
Add this to `package.json` scripts:
```json
"dev:all": "concurrently \"npm run dev\" \"node server.js\""
```

Then install concurrently:
```bash
npm install -D concurrently
```

And run:
```bash
npm run dev:all
```

## 🌐 Features Included

- ✅ Dark mode toggle (top right) - persists in localStorage
- ✅ Animated hero with tech stack fade-in
- ✅ GitHub README rendering with react-markdown
- ✅ Latest 3 repos from GitHub with:
  - Language breakdown bars
  - Star counts
  - Descriptions
- ✅ Schedule call drawer with:
  - Available time slots from API
  - Contact form with validation
  - Toast notifications
- ✅ Responsive design
- ✅ Smooth animations

## 📱 Testing the Schedule Feature

1. Open http://localhost:5173
2. Scroll to "Let's Work Together" section
3. Click "Schedule a Call"
4. Select a time slot
5. Fill out the form and submit
6. See the success toast!

The API server logs bookings to the console.

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 or 3000 is in use:
- Frontend: Vite will automatically try 5174, 5175, etc.
- API: Change the port in `server.js` line 22

### Node Version Issues
Make sure you're using Node.js 20+ :
```bash
node --version  # Should be 20.19+ or 22.12+
nvm use node    # If using nvm
```

### GitHub API Rate Limiting
GitHub limits unauthenticated API requests to 60/hour. For more, add a personal access token:
```typescript
fetch('https://api.github.com/...', {
  headers: {
    'Authorization': 'token YOUR_GITHUB_TOKEN'
  }
})
```

## 📚 Next Steps

1. Customize the colors in `tailwind.config.js`
2. Add more projects manually if needed
3. Create a GitHub repo with your username to display a README
4. Replace the mock API with a real booking system (Calendly, etc.)
5. Add Google Analytics
6. Set up a custom domain

Enjoy your new portfolio! 🎉
