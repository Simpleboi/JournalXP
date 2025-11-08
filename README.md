<div align="left">
<div id="top">


# JournalXP🧠

**JournalXP** is a game-like mental health journaling app that helps users build healthy habits, track their mood, and reflect through daily journaling - all while earning points and leveling up their wellness journey.

*Transforming Mindfulness into Empowered Daily Growth*

<!-- BADGES -->
<img src="https://img.shields.io/github/last-commit/Simpleboi/JournalXP?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/Simpleboi/JournalXP?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/Simpleboi/JournalXP?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white" alt="Markdown">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white" alt="Autoprefixer">
<img src="https://img.shields.io/badge/Firebase-DD2C00.svg?style=flat&logo=Firebase&logoColor=white" alt="Firebase">
<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
<img src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black" alt=".ENV">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white" alt="Nodemon">
<img src="https://img.shields.io/badge/GNU%20Bash-4EAA25.svg?style=flat&logo=GNU-Bash&logoColor=white" alt="GNU%20Bash">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<br>
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style=flat&logo=ts-node&logoColor=white" alt="tsnode">
<img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat&logo=Zod&logoColor=white" alt="Zod">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/OpenAI-412991.svg?style=flat&logo=OpenAI&logoColor=white" alt="OpenAI">
<img src="https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white" alt="datefns">
<img src="https://img.shields.io/badge/Sass-CC6699.svg?style=flat&logo=Sass&logoColor=white" alt="Sass">
<img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=flat&logo=React-Hook-Form&logoColor=white" alt="React%20Hook%20Form">
<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" alt="YAML">
<img src="https://img.shields.io/badge/React%20Router-CA4245.svg?style=flat&logo=React-Router&logoColor=white" alt="React%20Router">

</div>
<br>


---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#license)

---

## 🌟 Features

### 🪞 Core Experience

- **Daily Journal** | Reflect and write freely in a private, secure space.
- **AI Companion (Sunday)** | Get conversational support and personalized prompts powered by GPT integration.
- **Mood Tracker** | Record how you feel, and visualize emotional trends over time.
- **XP & Levels** | Earn XP for journaling, completing tasks, and self-care streaks.
- **Habit Tracker** | Build healthy habits with streak tracking and XP rewards.
- **Task System** | Create and complete daily tasks to earn XP and build momentum.
- **Rank System** | Progress through ranks from Bronze to Diamond as you level up.
- **Meditation Room** | Learn breathing and grounding techniques, read uplifting quotes, and journal your emotions.
- **Weekly Summary** | Review mood patterns, XP growth, and reflections.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Vite + TypeScript + TailwindCSS |
| **Backend** | Firebase Cloud Functions + Express.js + Node.js |
| **Database** | Firestore |
| **Authentication** | Firebase Auth |
| **Storage** | Firebase Cloud Storage |
| **Hosting** | Firebase Hosting |
| **AI Integration** | OpenAI API (GPT-4/Sunday AI) |
| **CI/CD** | Firebase CLI + GitHub Actions |

---

## 📁 Project Structure

JournalXP is organized as a monorepo with the following structure:

```md
JournalXP/
├── frontend/           # React + Vite frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Feature-specific modules
│   │   ├── pages/      # Route-level components
│   │   ├── context/    # React contexts (Auth, UserData, etc.)
│   │   └── lib/        # Utilities and Firebase config
│   └── package.json
│
├── functions/          # Firebase Cloud Functions
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── middleware/ # Auth and error handling
│   │   ├── lib/        # Utilities and Firebase Admin
│   │   └── scripts/    # Migration and maintenance scripts
│   └── package.json
│
├── shared/             # Shared TypeScript types and utilities
│   ├── types/          # Common type definitions
│   └── utils/          # Shared utility functions
│
└── backend/            # Legacy standalone server (archival)
```

### Key Directories

- **frontend/**: React SPA using Firebase Web SDK for auth and client-side operations
- **functions/**: Firebase Cloud Functions hosting a single Express app exported as the `api` function
- **shared/**: Common TypeScript types and utilities used by both frontend and functions

---

## 🌟 Future Features

- 🔒 Enhanced security features
- 🌙 Light/Dark mode toggle
- 🧘‍♀️ Advanced meditation/breathing tools
- 📱 Mobile-first UI improvements
- 📊 Advanced analytics and insights
- 🎨 Customizable themes and avatars
- 🌐 Internationalization (i18n)

---

## 🙌 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to JournalXP.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test them
4. Commit with clear messages: `git commit -m "feat: add amazing feature"`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

## License

MIT License. Use it freely, improve it, and spread positivity.
