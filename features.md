# 🚀 SkillSwap Features

Detailed breakdown of the core functionalities implemented in the SkillSwap platform.

## 1. Authentication & User Profiles
- **Supabase Auth**: Secure email/password authentication.
- **Auto-Profile Generation**: Automatic creation of a database profile upon registration using Postgres triggers.
- **Customizable Profiles**: Users can edit their bio, location, availability, and specific skills they offer or want to learn.
- **Skill Badges**: Visual distinction between "Offered" (green) and "Desired" (purple) skills.

## 2. Smart Matching System
- **Compatibility Scoring**: A custom algorithm that compares your desired skills against others' offered skills.
- **Perfect Matches**: Highlights users where a mutual exchange is possible (I have what you want, and you have what I want).
- **Match Filtering**: Filter potential partners by "Perfect Match," "Can Teach Me," or "Wants My Skills."
- **Live Search**: Instant search through the match list by skill name.

## 3. Swap Session Management (CRUD)
- **Booking**: Interactive modal to schedule a session with a partner, including date, time, duration, and specific topics.
- **Editing**: Full control to update session details if plans change.
- **Status Tracking**: Sessions move through `upcoming`, `completed`, or `cancelled` states.
- **Dashboard Overview**: A quick glance at your next 3 sessions and key performance stats.

## 4. Reputation & Gamification
- **Skill Points (⚡)**: 
  - `+50` for booking a session.
  - `+100` for completing a session.
  - `-25` for cancelling a session.
- **Reviews & Ratings**: Peer-to-peer review system where users can leave star ratings and comments after sessions.
- **Global Rankings**: Users are ordered on the match page by their Skill Points and ratings.

## 5. UI/UX Excellence
- **Glassmorphism**: Modern frosted-glass card designs.
- **Responsive Layout**: Optimized for desktop, tablet, and mobile viewing.
- **Toast Notifications**: Real-time feedback for every action (success, error, info).
- **Smooth Animations**: CSS-driven entrance and hover animations for a premium feel.
