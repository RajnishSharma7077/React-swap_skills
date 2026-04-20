# 🛠️ SkillSwap Tech Stack

The technologies and libraries leveraged to build the SkillSwap platform.

## Core Framework
- **React (Vite)**: High-performance frontend framework with extremely fast hot-reloading.
- **JavaScript (ES6+)**: Clean, modular code structure.

## Backend & Database (Supabase)
- **PostgreSQL**: Robust relational database for profiles, sessions, and reviews.
- **GoTrue**: Supabase's authentication engine for secure user management.
- **PostgREST**: Instant RESTful API generation from the database schema.
- **RLS (Row Level Security)**: Advanced database policies to ensure users can only access/modify their own data.

## Libraries & Tools
- **@supabase/supabase-js**: Official client library for database and auth interaction.
- **React Router Dom**: Client-side routing for seamless page transitions.
- **Lucide React**: Clean and consistent iconography.
- **Google Fonts**:
  - `Inter`: Primary sans-serif font for readability.
  - `Space Grotesk`: Display font for a modern, tech-forward aesthetic.

## Design System
- **Vanilla CSS3**: Custom design system using CSS Variables for tokens (colors, shadows, radius, transitions).
- **Flexbox & CSS Grid**: Advanced layouts for responsive design.
- **Backdrop Filter**: Used for glassmorphism effects.
- **Keyframe Animations**: Custom entrance and micro-interaction animations.

## Development Workflow
- **NPM**: Package management.
- **Environment Variables**: Secure storage of API keys via `.env` files.
- **Postgres Triggers**: Automating profile creation and timestamp updates within the database.
