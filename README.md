# 💻 Job Board Frontend Client

The web frontend client for `jobs.dev.com` — a modern, responsive job search application built with **React** and **TypeScript**. It provides job seekers with intuitive search, filter, and application interfaces, alongside dedicated management dashboards for employers.

---

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
- [Key Pages & Workflows](#-key-pages--workflows)
- [Author](#-author)

---

## ✨ Features

- 🔍 **Interactive Job Search:** Real-time search by title, keyword, location, and employment type.
- 🎨 **Modern & Responsive UI:** Optimized for desktop, tablet, and mobile devices using Tailwind CSS.
- 🔐 **Authentication Flows:** User registration, login, and protected routes for job seekers & employers.
- 📋 **Job Seeker Dashboard:** Track submitted applications, save favorite jobs, and update user profiles/resumes.
- 📊 **Employer Workspace:** Create job posts, manage candidate applications, and update listing status.
- ⚡ **Optimized State Management:** Smooth data fetching, loading states, and notification toasts.

---

## 🛠 Tech Stack

- **Framework / Library:** React.js (Vite / Next.js)
- **Language:** TypeScript
- **Styling:** Tailwind CSS / Lucide Icons
- **State & Data Fetching:** React Query (TanStack Query) / Axios / Zustand
- **Routing:** React Router DOM
- **Form Handling:** React Hook Form + Zod

---

## 📁 Project Architecture

```text
[frontend-jobs.dev.com/](https://frontend-jobs.dev.com/)
├── src/
│   ├── assets/          # Images, icons, and static assets
│   ├── components/      # Reusable UI components (Navbar, Footer, JobCard, Modal)
│   ├── context/         # Auth and App Context providers
│   ├── hooks/           # Custom React hooks (useAuth, useJobs)
│   ├── pages/           # Page views (Home, Jobs, JobDetails, Login, Dashboard)
│   ├── services/        # API integration (Axios client setup & endpoints)
│   ├── types/           # TypeScript interfaces & types
│   └── utils/           # Helper functions & formatters
├── .env.example
├── package.json
└── README.md
