# Quick Setup Guide for paie Landing Page

## 🚀 Quick Start (5 minutes)

### 1. Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run this query to create the waitlist table:

```sql
CREATE TABLE waitlist (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  interest_level TEXT
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for waitlist signups
CREATE POLICY "Allow public inserts" ON waitlist
FOR INSERT TO public
WITH CHECK (true);
```

### 2. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy the Project URL and anon public key

3. Update `.env.local`:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Start the Application

```bash
npm install
npm start
```

The landing page will open at http://localhost:3000

## ✨ What You Get

- **Modern Web3 Design**: Glassmorphism effects, gradients, animations
- **Interactive Elements**: Custom cursor follower, floating particles
- **Waitlist Form**: Email collection with optional phone number
- **Responsive Design**: Works on all devices
- **Brand Integration**: Uses paie colors (#1571e2, #f7f5f2)

## 🎨 Unique Features

1. **Animated Background**: Floating orbs and particles
2. **Progressive Form**: Phone field reveals on demand
3. **Micro-interactions**: Hover effects and smooth transitions
4. **Success Feedback**: Animated notifications
5. **SMS Demo**: Shows how paie SMS commands work

## 🔧 Customization

- **Colors**: Edit `tailwind.config.js`
- **Content**: Update text in `src/App.tsx`
- **Features**: Modify `src/components/FeatureCards.tsx`
- **Animations**: Adjust Framer Motion settings

## 📊 View Waitlist Data

In your Supabase dashboard:
1. Go to Table Editor
2. Select the `waitlist` table
3. View all signups with timestamps

## 🚀 Deploy

**Vercel (Recommended):**
```bash
npm run build
npx vercel --prod
```

**Netlify:**
```bash
npm run build
# Upload build folder to Netlify
```

Don't forget to add environment variables in your deployment platform!

---

**Need help?** Check the full README.md for detailed instructions. 