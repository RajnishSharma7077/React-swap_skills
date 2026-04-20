# 🔄 SkillSwap — Peer-to-Peer Learning Network

SkillSwap is a premium, community-driven platform where users trade skills instead of money. Built with a modern tech stack and high-end design aesthetics, it solves the problem of high tutoring costs by connecting people for mutual, collaborative learning.

## 🌟 Overview

SkillSwap allows you to offer your expertise (e.g., "I teach you React") in exchange for learning something new (e.g., "You teach me Spanish"). The platform facilitates matching, booking, and reputation building without any monetary transactions.

## 🚀 Key Highlights

- **Premium Design**: Dark-themed, glassmorphic interface with vibrant gradients and smooth animations.
- **Smart Matching**: A custom algorithm that calculates compatibility scores based on your "Offered" vs "Desired" skills.
- **Reputation System**: Earn "Skill Points" and reviews for every successful swap.
- **Full CRUD**: Complete management of user profiles and swap sessions.

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- A Supabase account

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Ensure you run the SQL migration script in your Supabase SQL Editor to create the `profiles`, `sessions`, and `reviews` tables.

### 5. Run Development Server
```bash
npm run dev
```

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Navbar, Modals, Toasts)
├── context/        # AppContext (Data/CRUD) & AuthContext (Supabase Auth)
├── data/           # Mock data and utility constants
├── lib/            # Supabase client configuration
├── pages/          # Full page components (Dashboard, Matches, etc.)
├── App.jsx         # Routing and Provider setup
└── index.css       # Global design system and utility styles
```

## 📄 Documentation
- [features.md](./features.md) - Deep dive into platform functionality.
- [tech_stack.md](./tech_stack.md) - Details on tools and libraries used.
