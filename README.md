# HireFilter - AI-Powered Hiring Platform

![HireFilter Banner Placeholder](https://via.placeholder.com/1200x400/0f172a/ffffff?text=HireFilter+-+AI+Applicant+Tracking)

## 📖 Overview
HireFilter is an advanced, AI-powered Applicant Tracking System (ATS) designed to revolutionize the recruitment process. Unlike traditional hiring platforms that rely heavily on rigid keyword matching, HireFilter leverages state-of-the-art Large Language Models (LLMs) to perform semantic, context-aware analysis of applicant resumes against job requirements. It provides rich, explainable insights to recruiters, saving time while ensuring no qualified candidate is overlooked due to formatting or phrasing differences.

## ✨ Key Features
- **Role-Based Workflows**: Dedicated interfaces and dashboards for both **Recruiters (Admins)** and **Candidates**, ensuring a tailored experience for each user.
- **Explainable AI (XAI) Resume Analysis**: Goes beyond a simple match percentage. It breaks down the evaluation into:
  - **Overall Match Score**
  - **Skill Analysis** (Matched, Missing, and Partial matches)
  - **Gap Analysis** (Actionable insights into candidate shortcomings)
  - **Evidence Extraction** (Direct quotes from the resume that justify the score)
- **Dynamic Job Criteria Weighting**: Recruiters can define custom importance weights for various matching criteria (e.g., Skills: 50%, Experience: 30%, Education: 10%, Tools: 10%).
- **Multi-Engine AI Parsing**: Uses **Google Gemini (2.5 Flash)** alongside complementary integrations (Groq, Hugging Face, and a custom NLP Engine) to accurately extract and evaluate resume data.
- **Secure Cloud Setup**: Seamlessly integrates **Firebase** for robust User Authentication and Database Management, paired with **Cloudinary** for secure, persistent PDF resume storage.

## 🛠️ Tech Stack
### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7)
- **Build Tool**: Vite

### Backend & Services
- **Authentication & Database**: Firebase (v12)
- **File Storage**: Cloudinary
- **AI Processing**: 
  - `@google/genai` (Gemini 2.5 Flash)
  - Groq API Integration
  - Hugging Face Inference
  - PDF Parsing (`pdfService.ts`)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- API Keys for the following services:
  - Firebase config (Auth, Firestore)
  - Cloudinary
  - Google Gemini API (`VITE_GEMINI_API_KEY`)

### Installation & Execution
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hirefilter.git
   cd hirefilter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_GEMINI_API_KEY=your_gemini_api_key
   # Add any other required keys (e.g., GROQ, Hugging Face)
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 📂 Project Architecture
- `src/components/`: Reusable UI elements (Navbar, Cards, AnalysisResult views).
- `src/pages/`: Main route views spanning candidate application, recruiter dashboards, and job details.
- `src/services/`: Core logic and third-party integrations (Firebase, AI routing, PDF extraction).
- `src/types.ts`: Comprehensive TypeScript interfaces governing data structures like `User`, `Job`, `Application`, and `AIAnalysis`.

## 🔮 Future Scope
- **Real Backend Migration**: Transition simulated backend logic to a full-fledged FastAPI/Python service with PostgreSQL.
- **Optical Character Recognition (OCR)**: Enhanced support for evaluating image-based resumes.
- **Automated Interview Chatbots**: AI-conducted preliminary screening via chat.

## 📄 License
This project is proprietary.
