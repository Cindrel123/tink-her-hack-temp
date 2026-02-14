# 💰 Lifestyle Finance Mentor

A modern, gamified personal finance management application that helps users build healthy financial habits through education, goal tracking, and AI-powered insights.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-cyan)
![Supabase](https://img.shields.io/badge/Supabase-2.95.3-green)

---

## ✨ Features

### 🎯 Core Features
- **Smart Dashboard** - Real-time financial overview with AI insights
- **Goal Tracking** - Set and monitor financial goals with progress visualization
- **Financial Calculator** - Automatic budget allocation and savings recommendations
- **Education Hub** - Interactive lessons on personal finance topics
- **Daily Challenges** - Gamified tasks to build consistent financial habits
- **Streak System** - Reward daily engagement with XP bonuses

### 🎮 Gamification
- **XP & Levels** - Earn experience points and level up
- **Badges** - Unlock achievements for milestones
- **Financial Score** - Dynamic score based on savings and goals
- **Daily Streaks** - Build consistency with streak tracking

### 🤖 AI-Powered
- **AI Financial Advisor** - Personalized advice using OpenAI GPT
- **Smart Recommendations** - Context-aware financial guidance
- **Budget Optimization** - AI-suggested budget allocations

### 🔐 Security & Privacy
- **Supabase Authentication** - Secure email/password auth
- **Row Level Security** - Users can only access their own data
- **Environment Variables** - Sensitive data properly secured

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tink-her-hack-temp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Add your Supabase URL, anon key, and OpenAI API key

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

---

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in order:
   - `supabase/education_module.sql`
   - `supabase/challenges_streak.sql`
   - `supabase/rls_policies.sql`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📁 Project Structure

```
tink-her-hack-temp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── education/      # Education module components
│   │   ├── financial/      # Financial planning components
│   │   └── gamification/   # Gamification components
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.jsx     # Authentication hook
│   │   ├── useGamification.jsx  # Gamification state
│   │   └── useFinancialCalculator.jsx
│   ├── layouts/            # Layout components
│   ├── lib/                # Utilities and configurations
│   ├── pages/              # Page components (routes)
│   ├── services/           # API service layers
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── supabase/               # Database migrations
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── DEPLOYMENT.md           # Deployment guide
└── package.json            # Dependencies
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **Sonner** - Toast notifications

### Backend & Services
- **Supabase** - Backend as a Service (Auth, Database, Storage)
- **PostgreSQL** - Database (via Supabase)
- **OpenAI API** - AI-powered financial advice

### State Management
- **React Context** - Global state (Auth, Gamification, Calculator)
- **localStorage** - Client-side persistence

---

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Create production build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
```

---

## 🎨 Key Features Breakdown

### 1. Dashboard
- Financial health overview
- AI-powered insights
- Quick stats (balance, savings, goals, streak)
- Education progress widget
- Daily challenge preview

### 2. Goals System
- Create custom financial goals
- Track progress with visual indicators
- Set target amounts and deadlines
- Categorize goals (Emergency, Vacation, etc.)

### 3. Education Module
- Interactive financial literacy lessons
- Progress tracking
- XP rewards for completion
- Bento grid layout for modern UX

### 4. Challenges & Streaks
- Daily and weekly challenges
- Automatic streak tracking
- XP rewards for consistency
- Milestone bonuses (3, 7, 30 day streaks)

### 5. Financial Calculator
- Automatic emergency fund calculation
- Budget allocation recommendations
- Monthly investment suggestions
- Savings ratio analysis

### 6. Gamification
- Level progression (10 levels)
- XP system with thresholds
- Badge unlocking
- Financial health score (0-100)

---

## 🔒 Security Features

✅ **Implemented**:
- Supabase Row Level Security (RLS)
- Environment variable protection
- Secure authentication flow
- Client-side validation
- Protected routes

⚠️ **Best Practices**:
- Never commit `.env` to version control
- Use Supabase anon key (safe for client)
- Rotate API keys regularly
- Monitor usage and logs

---

## 🌐 Deployment

This app is optimized for deployment on:
- **Vercel** (Recommended)
- **Netlify**
- Any static hosting platform

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.

---

## 🐛 Known Issues & Limitations

- AI Advisor requires OpenAI API key and credits
- Financial data stored in localStorage (consider Supabase migration)
- No mobile app (PWA support could be added)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful components
- **Supabase** for backend infrastructure
- **OpenAI** for AI capabilities
- **Tailwind CSS** for styling system

---

## 📞 Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for setup help
- Review browser console for errors
- Verify Supabase configuration
- Test locally before deploying

---

**Built with ❤️ for better financial wellness**
