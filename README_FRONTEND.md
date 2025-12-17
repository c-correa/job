# 🚀 HireTech - Frontend

> Modern job platform connecting companies with talented developers

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 Overview

**HireTech** is a Single Page Application (SPA) built with React 19 that connects companies with developers through an intuitive job platform.

### User Roles
- **🏢 Company**: Post jobs, manage applications, search candidates
- **👨‍💻 Coder**: Browse jobs, apply to positions, track applications
- **⚙️ Admin**: Manage users, companies, and platform operations

### 🎨 Design
**[View Figma Wireframe →](https://www.figma.com/design/il9WkCwEAKkGtCJT4dWvdY/HireTech?node-id=0-1&t=FlxhdpyZ1SuGgTQb-1)**

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | React 19.2, Vite 7.2, React Router 7.10 |
| **HTTP Client** | Axios 1.13 |
| **Styling** | Tailwind CSS 3.4, Lucide Icons |
| **Notifications** | Sonner 2.0 |
| **Auth** | JWT (Bearer token) |
| **Dev Tools** | ESLint, PostCSS, Autoprefixer |

---

## ✨ Key Features

### Authentication & Security
- JWT-based authentication with Bearer token
- Role-based access control
- Protected routes with localStorage persistence

### Company Dashboard
- Create and manage job postings
- View and filter applicants
- Advanced candidate search by skills
- Real-time application notifications

### Coder Dashboard
- Browse jobs with advanced filters (location, salary, skills)
- One-click job applications
- Application status tracking
- Profile and resume management

### Additional Features
- 🤖 **HireBot**: AI chatbot assistant
- � Fully responsive design
- 🔔 Toast notifications
- 📊 Analytics and statistics

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone and navigate
cd Job.Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5001/api" > .env

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Badge, etc.)
│   ├── dashboard/       # Company dashboard components
│   ├── coder/          # Coder-specific components
│   └── ChatBot.jsx     # AI assistant
├── pages/              # Route pages (Landing, Login, Dashboards)
├── services/
│   └── api.js          # API service layer (Axios)
└── App.jsx             # Routes configuration
```

---

## 🔌 API Integration

All API calls are centralized in `src/services/api.js` with automatic JWT token injection.

### Available Services

```javascript
// Authentication
authService.login(username, password)
authService.register(userData)
authService.getMe()

// Companies
companyService.getAll(filters)
companyService.create(companyData)
companyService.update(id, companyData)

// Jobs
jobService.getAll(filters)
jobService.create(jobData)
jobService.updateStatus(id, isActive)

// Applications
applicationService.create(applicationData)
applicationService.updateStatus(id, status)
applicationService.getByCandidateId(candidateId)

// Candidates
candidateService.getMyCandidate(userId)
candidateService.addSkill(candidateId, skillData)
candidateService.update(id, profileData)

// Files
fileService.upload(file)
```

### Authentication Flow
1. Login → JWT token stored in `localStorage`
2. Axios interceptor adds `Authorization: Bearer <token>` to all requests
3. Protected routes validate token existence
4. Logout removes token and redirects

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production (`dist/` folder) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🌍 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5001/api
```

Access in code: `import.meta.env.VITE_API_URL`

---

## 🐳 Deployment

### Docker
```bash
docker build -t hiretech-frontend .
docker run -p 3000:80 hiretech-frontend
```

### Production Build
```bash
npm run build
# Deploy 'dist/' folder to:
# - Vercel, Netlify, AWS S3, etc.
```

### Docker Compose (Full Stack)
```bash
docker-compose up --build
```

---

## 🎨 Styling Guide

**Color Palette:**
- Primary: `#191e4a` (Dark Navy)
- Accent: `#655be9` (Purple)
- Success: `#55c79e` (Green)

**Conventions:**
- Utility-first with Tailwind CSS
- Consistent spacing: `p-4`, `p-6`
- Rounded corners: `rounded-lg`, `rounded-xl`
- Shadows: `shadow-sm`, `shadow-md`

---

##  Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

**Code Style:**
- Follow ESLint rules
- Use functional components with Hooks
- Keep components small and focused

---

## 📚 Resources

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios Docs](https://axios-http.com/)

---

**Built with ❤️ using React + Vite + Tailwind CSS**
