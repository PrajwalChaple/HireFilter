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

    const systemPrompt = `You are an expert AI recruiter AND a fraud detection system. Your job is to analyze resumes with 100% accuracy AND detect manipulation tactics.

RULES:
1. READ EVERY LINE — projects, work experience, skills section, education, certifications.
2. CONTEXT VERIFICATION (CRITICAL): A skill is only "Matched" if you find CLEAR EVIDENCE of it being used in a project, work experience, or certification. A skill just listed in a "Skills" section without ANY supporting context in experience/projects should go to "partial" NOT "matched".
3. KEYWORD STUFFING DETECTION: If you see a large block of skills/keywords that are NOT supported by work experience or projects, flag it as a warning. This is a common cheating tactic where candidates add invisible/white text with keywords.
4. FORMATTING/PARSING QUALITY: If the resume text looks garbled, jumbled, has random characters running together, or sections appear out of order (common with multi-column or table-based PDF layouts), flag it as a formatting warning.
5. Return ONLY valid JSON, no explanation.`;

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

IMPORTANT ANALYSIS INSTRUCTIONS:
- Only count a skill as "matched" if there is EVIDENCE in the work experience, projects, or certifications that the candidate actually used it.
- If a skill is only listed in a "Skills" section without context, put it in "partial".
- If you find a suspicious block of keywords (many skills listed without any supporting experience), add "Potential keyword stuffing detected: [X] skills found without supporting experience" to warnings.
- If the resume text appears garbled/jumbled/unreadable in parts, add "Resume formatting issues detected: text may not have parsed correctly from the PDF" to warnings.
- If everything looks clean and legitimate, return an empty warnings array.

Return ONLY this JSON:
{"overallMatch":<0-100>,"summary":"<detailed 2-3 sentence summary>","skillAnalysis":{"matched":["skills with evidence"],"missing":["skills NOT found"],"partial":["skills listed but without evidence"]},"experienceMatch":"<experience analysis with years>","educationMatch":"<education analysis>","gapAnalysis":["specific gap 1","gap 2"],"evidence":["quote or evidence from resume"],"recommendation":"ACCEPTED or REJECTED based on ${job.matchThreshold}% threshold","warnings":["warning1","warning2"]}`;


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
            // Ensure warnings is always an array
            if (!Array.isArray(parsed.warnings)) parsed.warnings = [];

            return parsed;

        } catch (err: any) {
            console.warn(`Groq ${model} error:`, err.message);
            continue;
        }
    }

    throw new Error("All Groq models failed");
};
