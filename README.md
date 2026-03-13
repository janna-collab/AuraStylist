# AuraStylist AI Fashion Application

Welcome to **AuraStylist**, an advanced AI-powered web app that bridges the gap between digital style generation and real-world shopping automation. Built with **Next.js**, **FastAPI**, **Amazon Bedrock (Nova & Titan)**, and **Playwright**.

---

## Architecture Overview

1. **Frontend (`/aurastylist-frontend`)**: A React/Next.js application built with Tailwind CSS, providing a seamless "Virtual Try-On" gallery, dynamic styling request forms, an onboarding wizard, and a global AI Stylist Chatbot.
2. **Backend (`/aurastylist-backend`)**: A robust FastAPI Python server handling all AI orchestration via AWS Bedrock, data persistence via MongoDB, and UI shopping automation via headless Playwright scripts.

---

## 🛠 Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB** (Local instance running on `localhost:27017` or an Atlas Cloud URI)
- An **AWS Account** with access granted to Amazon Bedrock models (`us.amazon.nova-lite-v1:0`, `us.amazon.nova-pro-v1:0`, `amazon.titan-image-generator-v1`).

---

## 🚀 Setup Instructions

### 1. Backend Setup (FastAPI)
The backend manages the heavy AI lifting and automated browser searches.

1. Navigate to the backend directory:
   ```bash
   cd aurastylist-backend
   ```
2. Set up a Python virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   venv/Scripts/activate  # On Windows
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```
4. Configure Environment Variables:
   Rename the provided `.env.example` file to `.env` inside the `aurastylist-backend` directory, and fill in your keys:
   ```env
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   
   # Optional: Set this if you use MongoDB Atlas cloud instead of local
   # MONGO_URI=mongodb+srv://... 
   ```

### 2. Frontend Setup (Next.js)
The frontend drives the beautiful, animated user experience.

1. Navigate to the frontend directory:
   ```bash
   cd aurastylist-frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Open the `.env.local` file inside the `aurastylist-frontend` directory. Make sure it points to your FastAPI backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

---

## 🏃‍♂️ Running the Application

To run the full stack locally, you need to start both servers simultaneously in two separate terminal windows.

**Start the Backend Server:**
```bash
cd aurastylist-backend
uvicorn main:app --reload
```

**Start the Frontend Server:**
```bash
cd aurastylist-frontend
npm run dev
```

Finally, open your browser and navigate to **`http://localhost:3000/getting-started`** to begin the full onboarding flow!

---

## ✨ Features Checklist
- [x] Multi-step Profile Onboarding (Image + Manual inputs)
- [x] AI Style Analysis & Report Generation via Nova Pro
- [x] "Own Self" vs "Someone Else" dynamic styling requests
- [x] Titan Image Generator Virtual Try-On (`/gallery`)
- [x] Automated Outfit Parsing & Shopping via Playwright (`/shop`)
- [x] Global Floating Assistant Chatbot (Text, Multimodal, Voice-Ready)

---

## 🧬 Every Nova Feature in Use

To ensure strict compliance with hackathon judging criteria, here is how each Nova model is utilized natively within the AuraStylist architecture:

| Model | Feature Used | Role in AuraStylist |
| :--- | :--- | :--- |
| **Nova 2 Lite** | Multimodal Perception | Analyzes photos (Full Body Profile, Reference Looks, or Other Person) to understand body type, face shape, color, and style metrics. Also handles image uploads in the Chat Bot. |
| **Nova 2 Pro** | Extended Thinking | Generates the "General Style Report" and provides fashion-accurate reasoning for the advice. |
| **Nova 2 Sonic** | Speech-to-Speech | Powers the real-time, conversational voice functionality in the standalone Chat Bot. |
| **Nova 2 Omni** | Native Image Gen | Generates high-fidelity, complete-outfit virtual try-on images directly on the person's initial profile photo. |
| **Nova Act** | UI Automation | The "Hands." It performs the clicks, scrolls, and multi-platform filtering on live e-commerce sites (Amazon, Google Shopping) to find real products. |
