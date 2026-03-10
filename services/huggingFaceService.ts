// Hugging Face Inference API Service
// Uses open-source LLMs for DEEP resume analysis (like Gemini but FREE forever)

import { Job, AIAnalysis } from '../types';

const HF_MODELS = [
    "mistralai/Mistral-7B-Instruct-v0.3",
    "google/gemma-2-2b-it",
];

let currentModelIndex = 0;

function getNextModel(): string {
    const model = HF_MODELS[currentModelIndex];
    currentModelIndex = (currentModelIndex + 1) % HF_MODELS.length;
    return model;
}

/**
 * Deep resume analysis using Hugging Face's free LLM inference.
 * Sends the same detailed prompt as Gemini but to a free open-source model.
 */
export const analyzeWithHuggingFace = async (resumeText: string, job: Job): Promise<AIAnalysis> => {
    const HfToken = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    if (!HfToken) throw new Error("Hugging Face API key is missing");

    // Truncate resume to stay within model context limits
    const truncatedResume = resumeText.substring(0, 5000);

    const prompt = `You are an expert AI recruiter. Analyze the following resume against the job requirements. Return ONLY valid JSON.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description}
- Required Skills: ${job.requiredSkills.join(', ')}
- Preferred Skills: ${job.preferredSkills.join(', ')}
- Minimum Experience: ${job.minExperience} years
- Match Threshold: ${job.matchThreshold}%

RESUME TEXT:
${truncatedResume}

INSTRUCTIONS:
1. Read the ENTIRE resume carefully, including project descriptions, work experience, and education.
2. Look for BOTH explicit skill mentions AND implied skills (e.g., "built REST APIs" implies knowledge of REST, APIs, backend development).
3. Calculate experience by analyzing date ranges in work history.
4. Be thorough - check every line of the resume for relevant information.

Return ONLY this JSON (no markdown, no explanation, no code fences):
{"overallMatch":<number 0-100>,"summary":"<2-3 sentence detailed summary>","skillAnalysis":{"matched":["skill1"],"missing":["skill2"],"partial":["skill3"]},"experienceMatch":"<detailed experience analysis>","educationMatch":"<education analysis>","gapAnalysis":["gap1","gap2"],"evidence":["evidence1","evidence2"],"recommendation":"<ACCEPTED if overallMatch >= ${job.matchThreshold}, else REJECTED>"}`;

    // Try each HF model
    for (let attempt = 0; attempt < HF_MODELS.length; attempt++) {
        const model = getNextModel();
        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HfToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 800,
                        temperature: 0.1,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                const errBody = await response.text();
                console.warn(`HF Model ${model} failed (${response.status}):`, errBody);
                continue;
            }

            const data = await response.json();

            // HF text generation returns [{generated_text: "..."}]
            let generatedText = '';
            if (Array.isArray(data) && data[0]?.generated_text) {
                generatedText = data[0].generated_text;
            } else if (typeof data === 'string') {
                generatedText = data;
            } else {
                console.warn(`Unexpected HF response format from ${model}:`, data);
                continue;
            }

            // Extract JSON from the generated text
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.warn(`No JSON found in HF response from ${model}`);
                continue;
            }

            const parsed: AIAnalysis = JSON.parse(jsonMatch[0]);

            // Enforce recommendation based on threshold
            if (parsed.overallMatch >= job.matchThreshold) {
                parsed.recommendation = 'ACCEPTED';
            } else {
                parsed.recommendation = 'REJECTED';
            }

            return parsed;

        } catch (err: any) {
            console.warn(`HF Model ${model} error:`, err.message);
            continue;
        }
    }

    throw new Error("All Hugging Face models failed");
};
