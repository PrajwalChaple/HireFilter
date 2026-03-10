# HireFilter - AI-Powered Hiring Platform

## Problem Statement
Traditional hiring platforms rely on keyword matching which often misses qualified candidates or ranks poorly based on formatting. Recruiters lack transparency on *why* a candidate was matched.

## Solution
HireFilter is a React-based platform using Google Gemini 2.5 Flash to provide **Explainable AI** resume analysis. It parses resumes, compares them semantically against job descriptions with weighted criteria (Skills, Experience, Education), and provides instant feedback.

## Architecture
- **Frontend:** React 18, TypeScript, Tailwind CSS.
- **Backend (Simulated):** LocalStorage service handles data persistence, role-based access control, and job isolation logic to mimic a FastAPI backend structure.
- **AI Engine:** Google Gemini API (`gemini-2.5-flash-preview`) processes resumes (PDF Base64) and outputs structured JSON analysis.

## AI Explainability
The core feature is the `AnalysisResult` component. It breaks down the AI score into:
1. **Matched/Missing Skills:** Clear visual indicators.
2. **Gap Analysis:** Actionable advice for candidates.
3. **Evidence:** Quotes extracted directly from the resume to justify the score.

## Setup
1. Clone repository.
2. Create a `.env` file with `API_KEY=your_gemini_api_key`.
3. Run `npm install` and `npm start`.

## Future Scope
- Real Python FastAPI backend with PostgreSQL.
- OCR for image-based resumes.
- Interview chatbot integration.
