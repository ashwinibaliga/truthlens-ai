# TruthLens AI

> **"See Beyond What Looks Real."**

TruthLens AI is an end-to-end forensic multi-modal synthetic media detection suite engineered for high-stakes verification across **Images**, **Audio / Voice**, **Video**, and **Written Text**.

Built with a luxury editorial aesthetic, TruthLens AI pairs rigorous mathematical signal processing (2D Fourier Transforms, Error Level Analysis, acoustic vocoder rolloff, syntactic burstiness) with genuine neural inference APIs (Resemble Detect, Hugging Face Vision & RoBERTa models).

---

## Brand Identity & Aesthetic

TruthLens AI deliberately rejects generic blue cybersecurity templates and vineyard clichés in favor of a luxury editorial identity:

- **Warm Ivory (`#F8F0E9`)**: Editorial paper canvas background.
- **Deep Wine (`#681B28`)**: Primary brand identity and analytical focus.
- **Burgundy (`#4A1028`)**: Structural contrast and deep cards.
- **Dusty Rose (`#D8B4AD`)**: Accent rules, borders, and subtle glows.
- **Dark Charcoal (`#282124`)**: High-contrast, readable typography.
- **Typography**: Oversized classical serif headings (*Cormorant Garamond* / *Playfair Display*) balanced by clean modern geometric body sans (*Inter*).

---

## Core Detection Modalities

### 1. Image Forensics
- **Supported Formats**: JPG, JPEG, PNG, WEBP.
- **2D Fast Fourier Transform (FFT)**: Computes frequency domain power spectrum to detect periodic grid artifacts and high-frequency energy dispersion characteristic of diffusion latent upscalers.
- **Error Level Analysis (ELA)**: Recompresses images at standard 95% JPEG quality to measure quantization discrepancies across pixel quadrants.
- **Camera Sensor EXIF Provenance**: Validates optical camera hardware tags (Make, Model, Exposure) vs synthetic generator signatures (Midjourney, Stable Diffusion, DALL-E, Firefly).
- **Hugging Face Inference API**: Integrates pretrained vision transformers (`dima806/deepfake_vs_real_image_detection`) when `HUGGINGFACE_API_KEY` is configured.

### 2. Audio & Voice Forensics
- **Supported Formats**: MP3, WAV, M4A, OGG, FLAC.
- **Interactive Audio Player**: Built-in waveform bar visualizer with playback scrubber.
- **Zero-Crossing Rate (ZCR) Jitter**: Measures micro-perturbations of biological vocal folds versus robotic synthetic stability.
- **Upper-Harmonic Vocoder Rolloff**: Audits sharp cutoffs above 8kHz–11kHz typical of neural TTS vocoders (HiFi-GAN, VITS, Tacotron).
- **Resemble Detect API**: Directly integrates commercial neural audio deepfake classification when `RESEMBLE_API_KEY` is provided.

### 3. Video Keyframe & Temporal Forensics
- **Supported Formats**: MP4, MOV, WEBM.
- **OpenCV Keyframe Sampling**: Automatically extracts keyframes at 1 fps intervals (up to 12 frames).
- **Spatial Keyframe Scrutiny**: Passes each keyframe through the computer vision forensic pipeline.
- **Inter-Frame Temporal Consistency**: Measures pixel difference variance across frame sequences to isolate facial boundary flickering and generative temporal warping.
- **Methodology Transparency**: Strictly distinguishes sampled keyframe evaluations from continuous video authentication.

### 4. Text & Authorship Forensics
- **Input Methods**: Direct copy-paste, sample presets, or document upload (`.txt`, `.docx`, `.md`).
- **Syntactic Burstiness**: Evaluates the standard deviation of sentence lengths. Autoregressive language models generate uniform cadence (low burstiness), whereas human writers exhibit rhythmic variation.
- **Shannon Informational Entropy**: Computes token dispersion and vocabulary predictability.
- **Lexical Diversity**: Measures Type-Token Ratio (TTR) and Root TTR.
- **RLHF Discourse Marker Audit**: Flags formulaic conversational boilerplate (`"delve"`, `"tapestry"`, `"in conclusion"`, `"furthermore"`).
- **Pretrained RoBERTa Detector**: Integrates `openai-community/roberta-base-openai-detector` via Hugging Face.

---

## Ethical Standards & Critical Non-Claims

TruthLens AI operates under radical empirical transparency:

1. **No Fabricated Confidence Scores**: Every metric is mathematically derived from pixel arrays, audio waveforms, or linguistic structures. If an external API is not configured, it is labeled as `unavailable` rather than faked.
2. **Authorship Limitation**: AI text detection is strictly probabilistic. TruthLens AI **never** claims to identify specific human writers or prove individual authorship.
3. **Intent vs Origin**: Detecting synthetic media does **not** prove malicious intent or disinformation. Synthetic tools are frequently used for artistic and educational purposes.
4. **Zero Media Retention**: Uploaded media is analyzed in memory buffers and purged immediately following telemetry extraction.

---

## Architecture & Technology Stack

```
truthlens-ai/
├── backend/                  # FastAPI Python Backend
│   ├── main.py               # Application entry point & CORS
│   ├── config.py             # Settings & Environment variables
│   ├── database.py           # Supabase PostgreSQL + SQLite Fallback
│   ├── models.py             # Pydantic schemas & response models
│   ├── supabase_schema.sql   # PostgreSQL Schema & RLS policies
│   ├── services/
│   │   ├── forensics_image.py # 2D FFT, ELA, EXIF, HF Vision
│   │   ├── forensics_audio.py # ZCR jitter, spectral rolloff, Resemble API
│   │   ├── forensics_video.py # OpenCV frame extractor & temporal consistency
│   │   └── forensics_text.py  # Burstiness, Shannon entropy, TTR, RoBERTa
│   └── routers/
│       ├── scans.py          # Upload, retrieve, list, delete scans
│       ├── text.py           # Text analysis & document upload
│       ├── stats.py          # Real-time database telemetry
│       └── providers.py      # Live provider connection monitor
├── frontend/                 # React 18 + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/       # Navbar, Footer, VerdictBadge, AudioPlayer,
│   │   │                     # ConfidenceGauge, VideoTimeline, ReportModal
│   │   ├── views/            # HomeView, DetectView, ResultsView,
│   │   │                     # HistoryView, AboutView
│   │   ├── services/         # api.ts, reportGenerator.ts (jsPDF)
│   │   └── types.ts          # Unified TypeScript interfaces
│   ├── vercel.json           # Vercel SPA routing
│   └── tailwind.config.js    # Luxury editorial theme configuration
├── render.yaml               # Render backend deployment manifest
└── Procfile                  # Production server command
```

---

## Getting Started Locally

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to project root
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn backend.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000`. Interactive OpenAPI documentation available at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## Authentication & User Isolation (Supabase Auth & RLS)

TruthLens AI includes a complete split-screen authentication architecture with individual user scan isolation and Row Level Security:

- **Split-Screen Design**:
  - **Left Panel**: Editorial ivory/cream card (`#F8F0E9`, `#FFFFFF`) with rounded input fields, password toggle, terms validation, and burgundy buttons (`#4A1028` to `#681B28`).
  - **Right Panel**: Luxury deep wine background (`#681B28`, `#4A1028`, `#D8B4AD`) featuring 2D Fourier and Acoustic spectral feature showcases.
- **Modes**: Sign Up, Sign In, and Password Recovery.
- **Route Protection**: The Detection Console and History Archive require authentication. Unauthenticated users can explore the Home page, methodology, and technology deep-dives; attempting to scan prompts the authentication flow.
- **Per-User Isolation**: Every scan record is linked to the authenticated user's `user_id`. Users can view and delete only their own scan archives.
- **Supabase Row Level Security (RLS)**: Enforces `auth.uid() = user_id` across PostgreSQL `SELECT`, `INSERT`, and `DELETE`.
- **Google OAuth**: Integrated and active when Google authentication is enabled in the Supabase Dashboard.

### Supabase Auth Configuration Steps:
1. In your Supabase Project Dashboard, go to **Authentication -> Providers**.
2. **Email**: Enabled by default. You can toggle *Confirm email* under **Email Auth**.
3. **Google OAuth (Optional)**:
   - Enable **Google** in the Providers list.
   - Enter your **Google Client ID** and **Google Client Secret** from [Google Cloud Console](https://console.cloud.google.com).
   - Add the Supabase Redirect URL (`https://<project-id>.supabase.co/auth/v1/callback`) to your Google Cloud Authorized Redirect URIs.
4. Set credentials in `.env` and `frontend/.env`:
   ```env
   # Backend .env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-or-anon-key

   # Frontend frontend/.env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
*(Note: If Supabase keys are not set yet, TruthLens runs seamlessly in local sandbox mode with isolated developer sessions so you can test all features offline).*

---

## Database Configuration (Supabase PostgreSQL)

TruthLens AI supports **Supabase PostgreSQL** out of the box with zero code changes required. It automatically falls back to local SQLite (`truthlens.db`) if Supabase credentials are not provided.

### To Connect Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`backend/supabase_schema.sql`](backend/supabase_schema.sql).
4. Add your project credentials to `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-or-anon-key
   ```

---

## Deployment Guide

### Frontend Deployment (Vercel)
1. Push this repository to GitHub.
2. In Vercel, click **New Project** and select the repository.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://truthlens-backend.onrender.com`).
5. Deploy.

### Backend Deployment (Render)
1. Connect your repository to [Render](https://render.com).
2. Select **Web Service** or use the included `render.yaml`.
3. Set:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables in Render:
   - `ENV`: `production`
   - `MAX_UPLOAD_SIZE_MB`: `50`
   - `SUPABASE_URL`: *(optional)* Your Supabase project URL
   - `SUPABASE_KEY`: *(optional)* Your Supabase API key
   - `HUGGINGFACE_API_KEY`: *(optional)* For neural Hugging Face endpoints
   - `RESEMBLE_API_KEY`: *(optional)* For Resemble Detect API

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Health check and system metadata |
| `/api/scans` | `POST` | Multipart upload for Image, Audio, or Video |
| `/api/scans` | `GET` | Query scan history with filtering |
| `/api/scans/{id}` | `GET` | Retrieve single forensic dossier |
| `/api/scans/{id}` | `DELETE` | Delete scan record from database |
| `/api/text/analyze` | `POST` | Execute linguistic & AI text analysis |
| `/api/text/upload` | `POST` | Upload `.txt` or `.docx` for text analysis |
| `/api/stats` | `GET` | Aggregate database telemetrics for dashboard |
| `/api/providers` | `GET` | Live verification of integrated AI engines |

---

## License
MIT License. Developed for TruthLens AI.

