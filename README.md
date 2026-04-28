---
title: MediaTrust
emoji: 🛡️
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# MediaTrust 🛡️

**MediaTrust** is an AI-powered media forensics tool designed to detect deepfakes, face-swaps, and digital manipulations in sports photos and video clips. 

Built for the hackathon, it uses **Google Gemini 1.5 Flash** (via Google AI Studio) to perform multi-modal analysis and provide a detailed credibility score with a forensic explanation.

## 🚀 Features
- **Instant Analysis:** Drag and drop images or video clips for immediate scanning.
- **AI Forensics:** Detects face-swapping boundaries, biometric inconsistencies, and temporal flickering.
- **Credibility Scoring:** Provides a 0-100 score with a color-coded UI (Green/Yellow/Red).
- **Video Support:** Natively processes video files using the Gemini File API.
- **Hugging Face Optimized:** Hosted on Hugging Face Spaces with Docker for "always-on" performance and no timeouts.

## 🛠️ Tech Stack
- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **AI Engine:** [Google Gemini API](https://aistudio.google.com/)
- **Styling:** Pure CSS (Vanilla) for a premium, lightweight design.
- **Deployment:** [Hugging Face Spaces](https://huggingface.co/spaces) (Docker)

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

## 🌍 Deployment (Hugging Face)

1. Create a new **Space** on [Hugging Face](https://huggingface.co/new-space).
2. Select **Docker** as the SDK.
3. In the Space **Settings**, add your `GEMINI_API_KEY` as a **Secret**.
4. Push this code to the Space using `git push hf main`.

## ⚖️ License
MIT
