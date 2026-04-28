# MediaTrust 🛡️

**MediaTrust** is an AI-powered media forensics tool designed to detect deepfakes, face-swaps, and digital manipulations in sports photos and video clips. 

Built for the hackathon, it uses **Google Gemini 1.5 Flash** (via Google AI Studio) to perform multi-modal analysis and provide a detailed credibility score with a forensic explanation.

## 🚀 Features
- **Instant Analysis:** Drag and drop images or video clips for immediate scanning.
- **AI Forensics:** Detects face-swapping boundaries, biometric inconsistencies, and temporal flickering.
- **Credibility Scoring:** Provides a 0-100 score with a color-coded UI (Green/Yellow/Red).
- **Video Support:** Natively processes video files using the Gemini File API.
- **Vercel Optimized:** Ready for deployment with configured serverless timeouts.

## 🛠️ Tech Stack
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **AI Engine:** [Google Gemini API](https://aistudio.google.com/)
- **Styling:** Pure CSS (Vanilla) for a premium, lightweight design.
- **Deployment:** [Vercel](https://vercel.com/)

## 🏁 Getting Started

### 1. Prerequisites
- A Google account to get a free API key from [Google AI Studio](https://aistudio.google.com/).

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Installation
```bash
npm install
npm run dev
```

## 🌍 Deployment

### Deploy to Vercel
1. Push this code to a GitHub repository.
2. Connect your repo to Vercel.
3. Add your `GEMINI_API_KEY` to the Vercel **Environment Variables** settings.
4. Deploy!

## ⚖️ License
MIT
