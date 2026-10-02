# NovaCut — AI Video Studio
> **Product Tagline:** Create Beyond Limits.  
> **Descriptor:** Next-Generation Browser AI Video Studio

---

## 🌟 Overview & Product Rule
**NovaCut** is a full-stack, browser-based video editing platform inspired by modern editors. 

### 🛡️ Critical Launch Rule: 100% Free VIP Access
- **Zero Watermark:** Renders are crisp and completely watermark-free.
- **Zero Paywalls:** Every single feature—including 4K exports, multi-track timelines, Bengali & English subtitles, and Gemini AI tools—is unlocked for all users.
- **Future-Ready Architecture:** An enterprise subscription entitlement model is pre-built and configured inside the Admin Panel, but remains **disabled by default at launch**.

---

## 🚀 Key Features

### 1. Multi-Track Video Workspace
- **Timeline Engine:** Dedicated tracks for Text & Titles, Bengali/English Subtitles, Overlays/Stickers, Video, and Audio/Music.
- **Precision Editing:** Clip moving, dragging, splitting at playhead (`S`), duplicating, and trimming start/end handles.
- **Real-Time Canvas Preview:** Interactive HTML5 Canvas player with aspect-ratio framing:
  - `16:9` (YouTube / Widescreen)
  - `9:16` (TikTok, Shorts, Reels)
  - `1:1` (Instagram Square)
  - `4:5` (Portrait)
  - `3:4` (Tablet)
- **Transform & Filters:** Position ($X, Y$), Scale, Rotation, Opacity, Speed ($0.5\times - 2.0\times$), Color Grading (Brightness, Contrast, Saturation), and Chroma Key (green-screen removal).

### 2. Real Client-Side Video Rendering & Download
- Real compositing using **HTML5 Canvas + Web Audio API + MediaRecorder**.
- Generates genuine, playable **WebM** and **MP4** files.
- Presets: **480p, 720p, 1080p Full HD, and 4K Ultra HD** at 24/30/60 FPS.
- Frame-by-frame progress tracking ($0\% - 100\%$) and instant direct browser download.

### 3. Server-Side Gemini AI Suite
- **Bengali & English Auto-Captions:** Timestamp-aligned subtitles with one-click **SRT file import and export**.
- **AI Video Script Assistant:** Viral 3-second hooks, scene breakdown, and voiceover text based on topic and tone.
- **AI Text-to-Speech (TTS) Voiceover:** Natural speech synthesis using `gemini-3.8-flash-lite-tts` (`Kore`, `Puck`, `Charon`, `Fenrir`, `Zephyr`).
- **Viral Metadata & SEO Suggester:** High-CTR titles, chapters, and trending hashtags.
- **AI Silence Gap Detector:** Detects dead air and pauses across audio tracks for fast jump-cut pacing.

### 4. Separate Protected Admin Panel
- Access route: `/admin` (server-verified for `skm958731@gmail.com`).
- Live system metrics: Registered users, active users, projects created, export jobs completed, and AI token tracking.
- Future Plan Management: Configure Free, Pro, and Studio/Agency pricing, currencies, trial days, and quotas.
- Subscription Enforcement Toggle: Guarded with confirmation modals and audit logging.
- Support Desk: Real-time ticket management and resolution workflow.

---

## 🛠️ Technology Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Motion.
- **Backend / API:** Node.js, Express, `tsx`.
- **AI SDK:** `@google/genai` (server-side with telemetry User-Agent header).
- **Video Engine:** HTML5 Canvas, Web Audio API, MediaRecorder API.
- **Data Persistence:** LocalStorage / IndexedDB + REST API with server audit logs.

---

## 💻 Local Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Deployment Guide (Google Cloud Run)

NovaCut is container-ready for **Google Cloud Run**:

```bash
# Build container image with Google Cloud Build
gcloud builds submit --tag gcr.io/PROJECT_ID/novacut-studio

# Deploy to Cloud Run
gcloud run deploy novacut-studio \
  --image gcr.io/PROJECT_ID/novacut-studio \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,NODE_ENV=production
```

---

## ⚡ Technical Performance & Honest Limitations
1. **Browser Memory & 4K Exports:** Rendering in 4K at 60 FPS requires significant memory. For devices with less than 8GB RAM, 1080p is recommended for optimal rendering speeds.
2. **Codec Support:** MediaRecorder formats depend on the user's browser. Modern Chrome/Edge/Firefox support VP9 WebM and H.264 MP4.
3. **AI Upstream Quotas:** If the server encounters temporary upstream rate limits on Gemini models, NovaCut automatically falls back to pre-computed structural templates so creators are never blocked.
