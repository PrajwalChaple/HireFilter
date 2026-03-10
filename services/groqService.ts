// Groq API Service — FREE, fast, reliable AI engine
// Uses Llama 3.3 70B for deep, accurate resume analysis
// Free tier: 30 req/min, 14,400 req/day (more than enough)

import { Job, AIAnalysis } from '../types';

const GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
];

/**
 * Deep resume analysis using Groq's free API.
 * Groq uses the same OpenAI-compatible chat format.
 */
export const analyzeWithGroq = async (resumeText: string, job: Job): Promise<AIAnalysis> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key is missing");

    const truncatedResume = resumeText.substring(0, 8000);

    const systemPrompt = `You are an expert AI recruiter. You must analyze resumes with 100% accuracy. Read EVERY line of the resume — projects, work experience, skills section, education, certifications. Look for both EXPLICIT skills (written directly) and IMPLIED skills (e.g., "built REST APIs with Express" implies Node.js, JavaScript, Express, REST, backend). Return ONLY valid JSON, no explanation.`;

    const userPrompt = `Analyze this resume against the job requirements:

JOB:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description}
- Required Skills: ${job.requiredSkills.join(', ')}
- Preferred Skills: ${job.preferredSkills.join(', ')}
- Min Experience: ${job.minExperience} years
- Match Threshold: ${job.matchThreshold}%

RESUME:
${truncatedResume}

Return ONLY this JSON:
{"overallMatch":<0-100>,"summary":"<detailed 2-3 sentence summary>","skillAnalysis":{"matched":["skills found in resume"],"missing":["skills NOT found"],"partial":["partially matched"]},"experienceMatch":"<experience analysis with years>","educationMatch":"<education analysis>","gapAnalysis":["specific gap 1","gap 2"],"evidence":["quote or evidence from resume"],"recommendation":"ACCEPTED or REJECTED based on ${job.matchThreshold}% threshold"}`;

    for (const model of GROQ_MODELS) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.1,
                    max_tokens: 1000,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errBody = await response.text();
                console.warn(`Groq model ${model} failed (${response.status}):`, errBody);
                continue;
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';

            if (!text) {
                console.warn(`Empty response from Groq model ${model}`);
                continue;
            }

            const parsed: AIAnalysis = JSON.parse(text);

            // Enforce recommendation
            parsed.recommendation = parsed.overallMatch >= job.matchThreshold ? 'ACCEPTED' : 'REJECTED';

            return parsed;

        } catch (err: any) {
            console.warn(`Groq ${model} error:`, err.message);
            continue;
        }
    }

    throw new Error("All Groq models failed");
};
