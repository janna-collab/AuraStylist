# AuraStylist: Advanced AI Fashion Orchestration

Welcome to **AuraStylist**, a premium AI-powered fashion ecosystem built for the **Amazon Nova AI Hackathon**. AuraStylist bridges the gap between digital style inspiration and real-world shopping by leveraging high-fidelity multimodal intelligence to analyze, curate, and source the perfect ensemble.

---

## 🏗 High-Level Architecture

1.  **Aesthetic Frontend (`/aurastylist-frontend`)**: A luxury-themed **Next.js** application featuring a "Golden Liner" design system. Includes a dynamic style consultation engine, a persistent saved collection gallery, and a high-detail individual look viewer.
2.  **Orchestration Backend (`/aurastylist-backend`)**: A high-performance **FastAPI** server that manages multi-layered AI workflows. It integrates natively with the **Amazon Nova** family via **AWS Bedrock** and powers a high-precision shopping agent using **AWS OpenSearch**.

---

## 🛠 Tech Stack

-   **Frontend**: Next.js, React, Tailwind CSS, Lucide React, Framer Motion, Axios.
-   **Backend**: Python, FastAPI, Boto3 (AWS SDK), Pymongo, Pillow, HTTPX.
-   **Infrastructure**: AWS Bedrock, Amazon OpenSearch, MongoDB.

---

## 🧬 The Amazon Nova Engine

AuraStylist utilizes the full capabilities of the **Amazon Nova** family to deliver a unified multimodal experience:

| Model | Application in AuraStylist |
| :--- | :--- |
| **Nova Omni** | **Multi-Modal Brain**: Orchestrates high-precision outfit parsing, generates complex image prompts for try-ons, and provides advanced stylistic reasoning. |
| **Nova Pro** | **Strategy & Reasoning**: Generates comprehensive Style Reports, actionable fashion recommendations, and extracts structured search metadata. |
| **Nova Lite** | **Edge Vision & Speed**: Performs rapid analysis of consultation photos and reference images to extract "Aesthetic DNA" and physical markers (undertones, proportions). |
| **Nova Canvas** | **Virtual Studio**: Generates photorealistic, editorial-grade fashion images for the Virtual Try-On experience. |
| **Multimodal Embeddings** | **Semantic Search**: Powers the Shopping Agent by converting visual and textual search context into high-dimensional vectors for OpenSearch retrieval. |

---

## ✨ Core Features

-   [x] **Physical Profile Intelligence**: Analyzes skin undertones, body proportions, and face shapes via Nova Vision.
-   [x] **Multimodal Consultation**: Processes text-based constraints and reference images to define a user's unique vibe.
-   [x] **Virtual Try-On 2.0**: Generates high-fidelity ensembles tailored to the user's specific consultation profile.
-   [x] **Persistent High-Fashion Archive**: Save curated looks to a private gallery with dedicated high-detail look pages.
-   [x] **High-Precision Shopping Agent**: A 4-layer multimodal pipeline (Parsing → Vectorization → OpenSearch Retrieval → Style Ranking) to find real-world matches.
-   [x] **Intelligent Assistant**: A persistent AI stylist capable of understanding visual uploads and voice intent.

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18+) & **Python** (v3.10+)
-   **MongoDB** (Local or Atlas)
-   **AWS Account** with Bedrock access to the **Nova Family** (Omni, Pro, Lite, Canvas, Embeddings) and **OpenSearch**.

### Installation

1.  **Backend**:
    ```bash
    cd aurastylist-backend
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
2.  **Frontend**:
    ```bash
    cd aurastylist-frontend
    npm install
    npm run dev
    ```

Navigate to `http://localhost:3000` to begin your journey into high-precision fashion.