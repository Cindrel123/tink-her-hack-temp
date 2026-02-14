# Lifestyle Finance Mentor - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Supabase account and project created
- ✅ OpenAI API key (for AI Advisor feature)
- ✅ Git repository (for deployment platforms)

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

### Step 2: Run Database Migrations

Execute the following SQL files in your Supabase SQL Editor **in order**:

1. **`supabase/education_module.sql`** - Education system tables
2. **`supabase/challenges_streak.sql`** - Challenges and streak tracking

### Step 3: Enable Row Level Security (RLS)

Run this SQL to secure your data:

```sql
-- Enable RLS on all tables
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Gamification policies
CREATE POLICY "Users can view own gamification data"
  ON gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data"
  ON gamification FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification data"
  ON gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Challenges policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- User challenges policies
CREATE POLICY "Users can view own challenge progress"
  ON user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge progress"
  ON user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Lessons policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- Lesson progress policies
CREATE POLICY "Users can view own lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Step 4: Configure Authentication

In Supabase Dashboard:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set **Site URL** to your production domain

---

## 🔐 Environment Variables

### Step 1: Copy Environment Template

```bash
cp .env.example .env
```

### Step 2: Fill in Your Credentials

Edit `.env` with your actual values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_APP_NAME=Lifestyle Finance Mentor
VITE_APP_URL=https://your-domain.com
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- GitHub/GitLab/Bitbucket account
- Push your code to a repository

#### Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variables from your `.env` file
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   vercel
   # Follow prompts
   # Add environment variables when prompted
   ```

#### Environment Variables in Vercel

Add these in Project Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_APP_NAME`
- `VITE_APP_URL`

---

### Option 2: Netlify

#### Steps

1. **Install Netlify CLI** (optional)
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Add environment variables
   - Click "Deploy site"

3. **Deploy via CLI**
   ```bash
   netlify deploy --prod
   ```

#### Environment Variables in Netlify

Add these in Site Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_APP_NAME`
- `VITE_APP_URL`

---

## 🛠️ Local Development

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## ✅ Pre-Deployment Checklist

- [ ] All SQL migrations run successfully in Supabase
- [ ] Row Level Security (RLS) policies enabled
- [ ] Environment variables configured
- [ ] Production build tested locally (`npm run build && npm run preview`)
- [ ] No console errors in browser
- [ ] Authentication flow tested
- [ ] All features working (Goals, Education, Challenges, AI Advisor)
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] OpenAI API key has sufficient credits

---

## 🔍 Post-Deployment Verification

After deployment, test:

1. **Authentication**
   - Sign up with new account
   - Login/logout
   - Password reset (if configured)

2. **Core Features**
   - Dashboard loads correctly
   - Financial calculator works
   - Goals CRUD operations
   - Education lessons and progress tracking
   - Challenges and daily streak
   - AI Advisor generates advice
   - Gamification (XP, levels, badges)

3. **Performance**
   - Page load times < 3 seconds
   - No console errors
   - Smooth transitions

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build command fails with errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Connection Issues

**Issue**: "Failed to fetch" or authentication errors

**Solutions**:
1. Verify environment variables are set correctly
2. Check Supabase project is not paused
3. Verify Site URL in Supabase Auth settings matches your domain
4. Check browser console for CORS errors

### AI Advisor Not Working

**Issue**: AI advice not generating

**Solutions**:
1. Verify OpenAI API key is valid
2. Check API key has credits
3. Check browser console for API errors
4. Verify `VITE_OPENAI_API_KEY` is set in deployment platform

### Challenges/Streak Not Persisting

**Issue**: Streak resets or challenges don't save

**Solutions**:
1. Verify `challenges_streak.sql` migration was run
2. Check RLS policies are configured
3. Verify user is authenticated
4. Check browser console for database errors

---

## 📊 Monitoring & Analytics

### Recommended Tools

- **Vercel Analytics** (if using Vercel)
- **Google Analytics** (add to `index.html`)
- **Sentry** (for error tracking)
- **Supabase Dashboard** (for database monitoring)

---

## 🔒 Security Best Practices

✅ **Implemented**:
- Row Level Security (RLS) on all tables
- Environment variables for sensitive data
- Supabase anon key (safe for client-side)
- Protected routes with authentication

⚠️ **Important**:
- Never commit `.env` file to Git
- Rotate API keys periodically
- Monitor Supabase usage for anomalies
- Keep dependencies updated

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Review Supabase logs
- Verify environment variables
- Test locally first with `npm run dev`

---

## 🎉 Success!

Your Lifestyle Finance Mentor app is now live! 🚀

**Next Steps**:
1. Share the URL with users
2. Monitor performance and errors
3. Gather user feedback
4. Iterate and improve

---

**Built with**: React, Vite, Tailwind CSS, Supabase, shadcn/ui, OpenAI
