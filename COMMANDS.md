# 🚀 Deployment Commands Reference

Quick reference for all deployment-related commands.

---

## 📦 Installation

```bash
# Install all dependencies
npm install

# Clean install (if issues)
rm -rf node_modules package-lock.json && npm install
```

---

## 🔧 Development

```bash
# Start development server
npm run dev

# Run with specific port
npm run dev -- --port 3000

# Run linter
npm run lint
```

---

## 🏗️ Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Build and preview
npm run build && npm run preview
```

---

## 🌐 Deployment

### Vercel

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls
```

### Netlify

```bash
# Install Netlify CLI globally
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod

# Deploy to preview
netlify deploy

# Check deployment status
netlify status
```

---

## 🗄️ Database (Supabase)

```bash
# No CLI commands needed - use Supabase Dashboard

# SQL Migrations (run in Supabase SQL Editor):
# 1. supabase/education_module.sql
# 2. supabase/challenges_streak.sql
# 3. supabase/rls_policies.sql
```

---

## 🔐 Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (use your editor)
nano .env
# or
code .env
```

---

## 🧹 Cleanup

```bash
# Remove build artifacts
rm -rf dist

# Remove node_modules
rm -rf node_modules

# Remove lock file
rm package-lock.json

# Full cleanup
rm -rf node_modules package-lock.json dist
```

---

## 🔍 Verification

```bash
# Check build output size
npm run build
# Look for "dist/" output in terminal

# Test production build locally
npm run preview
# Visit http://localhost:4173

# Check for console errors
# Open browser DevTools → Console
```

---

## 📊 Monitoring

```bash
# Check Vercel logs
vercel logs <deployment-url>

# Check Netlify logs
netlify logs

# Monitor build
vercel --prod --logs
```

---

## 🐛 Troubleshooting

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Verify Node version
node --version
# Should be 18+

# Verify npm version
npm --version
```

---

## 🎯 Quick Deploy Workflow

```bash
# 1. Ensure code is ready
npm run build

# 2. Test locally
npm run preview

# 3. Commit changes
git add .
git commit -m "Ready for production"
git push origin main

# 4. Deploy (Vercel)
vercel --prod

# OR Deploy (Netlify)
netlify deploy --prod
```

---

## 📝 Notes

- All `npm` commands should be run from project root
- Ensure `.env` file exists before running dev server
- Production build creates `dist/` folder
- Preview server runs on port 4173 by default

---

**Keep this reference handy for quick deployment! 🚀**
