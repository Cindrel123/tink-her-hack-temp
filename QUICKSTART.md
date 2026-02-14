# 🚀 Quick Start Guide

Get your Lifestyle Finance Mentor app running in **5 minutes**!

---

## 📦 Step 1: Install Dependencies

```bash
npm install
```

**Expected output**: All packages installed successfully

---

## 🔐 Step 2: Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env
```

**Edit `.env` and add your credentials:**

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-proj-xxxxx (optional)
```

**Where to get these:**
- **Supabase**: [supabase.com](https://supabase.com) → Create Project → Settings → API
- **OpenAI**: [platform.openai.com](https://platform.openai.com) → API Keys

---

## 🗄️ Step 3: Set Up Database

1. Go to your Supabase project
2. Click **SQL Editor**
3. Run these files **in order**:

```sql
-- 1. Education Module
-- Copy and paste contents of: supabase/education_module.sql

-- 2. Challenges & Streaks
-- Copy and paste contents of: supabase/challenges_streak.sql

-- 3. Security Policies
-- Copy and paste contents of: supabase/rls_policies.sql
```

**Verify**: Check **Table Editor** to see `lessons`, `challenges`, `gamification` tables

---

## ▶️ Step 4: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
VITE v7.3.1  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Step 5: Test the App

1. **Open browser**: `http://localhost:5173`
2. **Sign up**: Create a new account
3. **Explore**: Check Dashboard, Goals, Education, Challenges

---

## 🎉 You're Done!

Your app is now running locally. 

### Next Steps:

- **Customize**: Modify colors, content, features
- **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- **Learn**: Check [README.md](./README.md) for full documentation

---

## 🐛 Troubleshooting

### "Supabase credentials missing" warning

**Fix**: Make sure `.env` file exists and has correct values

### "Failed to fetch" errors

**Fix**: 
1. Check Supabase project is active (not paused)
2. Verify URL and anon key are correct
3. Run the SQL migrations

### Build fails

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### AI Advisor not working

**Fix**: Add `VITE_OPENAI_API_KEY` to `.env` (optional feature)

---

## 📚 Need Help?

- **Full Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- **README**: [README.md](./README.md)

---

**Happy coding! 💰✨**
