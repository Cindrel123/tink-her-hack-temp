# Lifestyle Finance Mentor - Technical Documentation

## Technical Details

### Technologies/Components Used

**For Software:**
- **Languages used:** JavaScript (ES6+), HTML5, CSS3
- **Frameworks used:** React (v19), Vite (v7), Tailwind CSS (v4)
- **Libraries used:** 
  - `@supabase/supabase-js` (Backend & Real-time Database)
  - `lucide-react` (Premium Iconography)
  - `react-markdown` (AI Response Rendering)
  - `react-router-dom` (Sophisticated SPA Routing)
  - `sonner` (Interactive Notifications)
  - `Radix UI` (Accessible Component Primitives)
  - `canvas-confetti` (Engagement Visuals)
- **Tools used:** VS Code, Git, npm, PostCSS, ESLint, Supabase Console

**For Hardware:**
- **Main components:** Development Workstation (PC/Mac), Modern Web Browser (Chrome/Edge/Firefox)
- **Specifications:** 
  - CPU: Quad-core 2.0GHz+ empfohlen
  - RAM: 8GB+ for optimal development performance
  - Connectivity: Active High-speed Internet for Cloud Services (AI & DB)
- **Tools required:** Node.js (v18.0.0+), Terminal/PowerShell, npm

---

## Features

- **AI Financial Mentor**: A deeply integrated chat experience using **Google Gemini 1.5 Flash** that provides personalized advice based on real user financial data.
- **Advanced Financial Engine**: Automatically calculates emergency funds, savings ratios, and budget allocations (50/30/20 rule) in real-time.
- **Gamified Financial Journey**: Enhances user engagement through an XP system, leveling, visual badges, and daily usage streaks.
- **Intelligent Goal Tracking**: Dynamic visualization of progress for major purchases and life goals with AI-driven timeline estimations.
- **Real-time Persistence**: Secure Auth and database integration via Supabase to keep chat history and financial profiles synced across sessions.

---

## Implementation

### For Software:

#### Installation
```bash
# Clone the repository
git clone [your-repo-link]

# Install all necessary dependencies
npm install
```

#### Run
```bash
# Launch the local development server
npm run dev
```

### For Hardware:

#### Components Required
- **Workstation**: Any modern PC/Laptop running Windows, macOS, or Linux.
- **Web Browser**: Latest version of Google Chrome, Brave, or Firefox for optimal CSS4/Grid support.
- **API Access**: A valid **Google AI Studio** Key (for Gemini) and a **Supabase** Project URL/Key.

#### Circuit Setup (Environment Configuration)
- **Database Connection**: Configure your **Supabase** project with a `chat_messages` table and Row Level Security (RLS).
- **Environment Gateway**: Create a `.env` file in the root directory to bridge your application with the cloud services:
  ```env
  VITE_SUPABASE_URL=your_project_url
  VITE_SUPABASE_ANON_KEY=your_anon_key
  VITE_GEMINI_API_KEY=your_gemini_key
  ```
- **Port Mapping**: The application typically runs on **Port 5173**; ensure your local firewall allows inbound traffic on this port for browser access.
