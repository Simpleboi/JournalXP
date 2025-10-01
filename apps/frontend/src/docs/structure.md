# File Structure

/
├── public/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── auth/            # 🔐 Login, Signup, Auth logic
│   ├── components/      # 🧩 Reusable UI (buttons, modals, etc.)
│   ├── context/         # 🌍 Global state/context providers
│   ├── data/            # 🧠 Static JSON or local mock data
│   ├── features/        # 🌟 Feature-based folders (scales beautifully)
│   │   ├── journal/     # Pages + logic for journaling
│   │   ├── mood/        # Mood tracker
│   │   ├── prompts/     # Prompts + quote logic
│   │   ├── dashboard/   # Main user dashboard
│   │   ├── profile/     # Profile page + components
│   │   ├── achievements/# Badges, progress bars, XP
│   ├── hooks/           # 🪝 Custom hooks (useAuth, useJournal, etc.)
│   ├── lib/             # 🧰 Firebase, utility functions, API handlers
│   ├── models/          # 📦 Firestore types or class-based models
│   ├── pages/           # 📄 Top-level routes if not using React Router v6
│   ├── routes/          # 🧭 React Router configs
│   ├── services/        # 🔌 External APIs / Firestore / auth utils
│   ├── styles/          # 🎨 Global styles, Tailwind extensions
│   ├── tempobook/       # 📘 Special module (could be merged under /features if it's app-specific)
│   ├── types/           # 🔡 Global TypeScript types
│   ├── docs/            # 📚 Internal markdown or feature docs
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
├── .env
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.js
├── readme.md
├── tempo.config.json
