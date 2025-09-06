# patos Landing Page

A modern, animated React landing page for patos with waitlist functionality powered by Supabase.

## 🚀 Features

- **Modern Web3 Design**: Sleek, animated interface with glassmorphism effects
- **Unique UI/UX**: Custom cursor follower, floating elements, and smooth animations
- **Waitlist Integration**: Connected to Supabase database for email collection
- **Responsive Design**: Works perfectly on all devices
- **Brand Colors**: Incorporates patos brand colors (#f7f5f2 and #1571e2)
- **Interactive Elements**: Hover effects, micro-animations, and transitions

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to **Table Editor** and create a new table called `waitlist` with the following columns:
   - `id` (int8, primary key, auto-increment)
   - `email` (text, required)
   - `phone` (text, optional)
   - `created_at` (timestamptz, default: now())
   - `interest_level` (text, optional)

### 3. Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

   You can find these values in your Supabase project settings under **API**.

### 4. Set up Row Level Security (RLS)

In your Supabase SQL editor, run:

```sql
-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for waitlist signups)
CREATE POLICY "Allow public inserts" ON waitlist
FOR INSERT TO public
WITH CHECK (true);

-- Allow public reads (optional, for admin dashboard)
CREATE POLICY "Allow public reads" ON waitlist
FOR SELECT TO public
USING (true);
```

### 5. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## 🎨 Design Features

### Unique UI/UX Elements

1. **Custom Cursor Follower**: Interactive cursor that follows mouse movement
2. **Floating Background Elements**: Animated orbs and particles for depth
3. **Glassmorphism Effects**: Modern glass-like components with backdrop blur
4. **Gradient Text**: Dynamic gradient text effects for branding
5. **Micro-animations**: Smooth hover effects and transitions
6. **Progressive Form**: Optional phone number field with smooth reveal
7. **Success Notifications**: Animated feedback for user actions

### Brand Integration

- **Primary Color**: `#1571e2` (patos Blue)
- **Secondary Color**: `#f7f5f2` (patos Cream)
- **Typography**: Inter font family for modern look
- **Logo**: MessageSquare icon with gradient background

## 📱 Components

- **WaitlistForm**: Interactive form with validation and Supabase integration
- **FloatingElements**: Animated background elements
- **FeatureCards**: Showcase key patos features
- **App**: Main landing page with hero section and navigation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🔧 Customization

### Colors

Update colors in `tailwind.config.js`:

```javascript
colors: {
  'patos-cream': '#f7f5f2',
  'patos-blue': '#1571e2',
}
```

### Animations

Modify animations in `src/index.css` and component files using Framer Motion.

### Content

Update text content, features, and demo examples in `src/App.tsx`.

## 📊 Analytics

To add analytics, integrate with:
- Google Analytics
- Mixpanel
- PostHog

Add tracking events for:
- Waitlist signups
- Feature card interactions
- Navigation clicks

## 🔒 Security

- Environment variables are properly configured
- Supabase RLS policies protect data
- Form validation prevents invalid submissions
- No sensitive data exposed to client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
