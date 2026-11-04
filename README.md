# TruthLens AI – AI-Powered Fake Content Detection

TruthLens AI is an AI-powered platform designed to help users identify potentially fake or manipulated digital content. It analyzes text, images, audio, and video to provide AI-generated predictions, confidence scores, and explanations.

## 🌐 Live Demo

- **Frontend:** https://truthlens-ai-vert.vercel.app/
- **Backend API:** https://truthlens-backend-a6wt.onrender.com
- **API Documentation:** https://truthlens-backend-a6wt.onrender.com/docs

## ✨ Features

- Text analysis for potentially misleading content
- Image analysis for potential manipulation
- Audio and video analysis
- AI-generated predictions and confidence scores
- Explainable analysis results
- Scan history and individual user scan isolation
- PDF report generation
- User authentication with Supabase
- Google OAuth authentication

## 🛠️ Technology Stack

- **Frontend:** React, JavaScript, HTML, CSS
- **Backend:** Python, FastAPI
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Deployment:** Vercel and Render

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10 or later
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

### 2. Frontend Setup

```bash
npm install
npm run dev
```

Create a frontend `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend API documentation is available at `/docs` when the server is running.

Configure the required backend environment variables before starting the application.

## 🔐 Authentication and Data Security

TruthLens AI uses Supabase Authentication for user access. Scan records are associated with individual users, and Row Level Security (RLS) can be used to restrict access to each user's records.

## 🎯 Project Objective

The objective of TruthLens AI is to make digital content verification more accessible by providing AI-based analysis and understandable results through a single platform.

## ⚠️ Disclaimer

TruthLens AI provides AI-generated predictions and analysis. Results are not guaranteed proof that content is genuine or manipulated. Users should verify important information using reliable sources.

## 👥 Team

**Project:** TruthLens AI  
**Hackathon:** Neural Storm 2026

**Team Members:**
- Ashwini
- Anushree
- Sandeepan

