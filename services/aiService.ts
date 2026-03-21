import { GoogleGenAI } from '@google/genai';
import { Job, AIAnalysis } from '../types';
import { analyzeWithGroq } from './groqService';
import { extractExperienceYears, isSkillInResume } from './nlpEngine';

const API_KEYS = [
    import.meta.env.VITE_GEMINI_API_KEY_1,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_GEMINI_API_KEY_3,
    import.meta.env.VITE_GEMINI_API_KEY_4,
    import.meta.env.VITE_GEMINI_API_KEY_5,
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getNextClient(): GoogleGenAI {
    const key = API_KEYS[currentKeyIndex];
    return new GoogleGenAI({ apiKey: key });
}

function rotateKey(): void {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
}

/**
 * Local NLP fallback — last resort when ALL APIs fail.
 */
function generateLocalAnalysis(resumeText: string, job: Job): AIAnalysis {
    const matched = job.requiredSkills.filter(s => isSkillInResume(s, resumeText));
    const missing = job.requiredSkills.filter(s => !isSkillInResume(s, resumeText));
    const partialPreferred = job.preferredSkills.filter(s => isSkillInResume(s, resumeText));

    const skillRatio = job.requiredSkills.length > 0
        ? (matched.length / job.requiredSkills.length) * 100
        : 100;

    const candidateExpYears = extractExperienceYears(resumeText);
    const requiredExp = job.minExperience;
    let expScore = 0;
    let expMessage = '';
    const gaps: string[] = [];

    if (candidateExpYears >= requiredExp) {
        expScore = 25;
        expMessage = `Candidate has ${candidateExpYears} years of experience, meeting the ${requiredExp} year requirement.`;
    } else if (candidateExpYears > 0) {
        expScore = (candidateExpYears / requiredExp) * 25;
        expMessage = `Short on experience: Requires ${requiredExp} years, found ~${candidateExpYears} years.`;
        gaps.push(expMessage);
    } else {
        expMessage = `Could not verify ${requiredExp} years of required experience from the resume.`;
        gaps.push(expMessage);
    }

    const eduKeywords = ['bachelor', 'master', 'degree', 'university', 'college', 'b.tech', 'b.e', 'm.tech', 'mba', 'phd', 'bsc', 'msc'];
    const resumeLower = resumeText.toLowerCase();
    const eduScore = eduKeywords.filter(k => resumeLower.includes(k)).length > 0 ? 15 : 0;

    const overallMatch = Math.min(100, Math.round(skillRatio * 0.6 + expScore + eduScore + partialPreferred.length * 2));
    const recommendation: 'ACCEPTED' | 'REJECTED' = overallMatch >= job.matchThreshold ? 'ACCEPTED' : 'REJECTED';

    if (missing.length > 0) gaps.push(`Missing ${missing.length} Core Skill(s): ${missing.join(', ')}`);
    if (eduScore === 0) gaps.push("No formal education degree keywords detected.");
    if (gaps.length === 0) gaps.push("No major gaps found.");

    // Basic keyword stuffing heuristic for local NLP
    const localWarnings: string[] = [];
    const skillsSectionMatch = resumeText.match(/skills[:\s]*(.*?)(?=experience|projects|education|$)/is);
    if (skillsSectionMatch) {
        const skillsBlock = skillsSectionMatch[1];
        const commaCount = (skillsBlock.match(/,/g) || []).length;
        if (commaCount > 15) {
            localWarnings.push(`Potential keyword stuffing detected: Skills section contains ${commaCount + 1} comma-separated items without supporting context.`);
        }
    }

    return {
        overallMatch,
        summary: `(Local NLP) Found ${matched.length}/${job.requiredSkills.length} required skills. Experience: ~${candidateExpYears} years.`,
        skillAnalysis: { matched, missing, partial: partialPreferred },
        experienceMatch: expMessage,
        educationMatch: eduScore > 0 ? 'Educational qualifications detected.' : 'No educational qualifications found.',
        gapAnalysis: gaps,
        evidence: [`Processed via Local NLP Engine (keyword + synonym matching).`],
        recommendation,
        warnings: localWarnings,
    };
}

/**
 * MAIN ANALYSIS FUNCTION
 * 
 * Priority Order:
 *   1. ⭐ Groq (Llama 3.3 70B) — FREE, fast, deep analysis, 14,400 req/day
 *   2. Gemini API (5 keys) — Deep but limited free tier
 *   3. Local NLP Engine — Keyword+synonym matching, always works offline
 */
export async function analyzeResume(resumeText: string, job: Job): Promise<AIAnalysis> {

    // ============ PRIORITY 1: Groq Free LLM ============
    try {
        console.log("⭐ Priority 1: Deep analysis via Groq (Llama 3.3 70B)...");
        const groqResult = await analyzeWithGroq(resumeText, job);
        console.log("✅ Groq analysis successful!");
        return groqResult;
    } catch (groqError: any) {
        console.warn("⚠️ Groq failed:", groqError.message);
    }

    // ============ PRIORITY 2: Gemini API (5 keys) ============
    console.log("🟡 Priority 2: Falling back to Gemini API...");
    const prompt = `You are an expert AI recruiter AND a fraud detection system. Analyze the following resume against the job requirements with deep context verification.

RULES:
1. Read the ENTIRE resume — every project, job, skill, certification.
2. CONTEXT VERIFICATION (CRITICAL): A skill is only "Matched" if you find CLEAR EVIDENCE of it being used in a project, work experience, or certification. A skill just listed in a "Skills" section without ANY supporting context should go to "partial" NOT "matched".
3. KEYWORD STUFFING DETECTION: If you see a large block of skills/keywords NOT supported by work experience or projects, flag it as a warning.
4. FORMATTING/PARSING QUALITY: If the resume text looks garbled or jumbled, flag it as a formatting warning.

JOB:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description}
- Required Skills: ${job.requiredSkills.join(', ')}
- Preferred Skills: ${job.preferredSkills.join(', ')}
- Min Experience: ${job.minExperience} years
- Match Threshold: ${job.matchThreshold}%

RESUME:
${resumeText}

Return ONLY valid JSON (no markdown, no code fences):
{
  "overallMatch": <number 0-100>,
  "summary": "<detailed 2-3 sentence summary>",
  "skillAnalysis": {
    "matched": ["skills with evidence in experience/projects"],
    "missing": ["skills NOT found"],
    "partial": ["skills listed but without evidence"]
  },
  "experienceMatch": "<experience analysis>",
  "educationMatch": "<education analysis>",
  "gapAnalysis": ["gap1", "gap2"],
  "evidence": ["evidence1", "evidence2"],
  "recommendation": "<ACCEPTED if overallMatch >= ${job.matchThreshold}, else REJECTED>",
  "warnings": ["any warnings about stuffing or formatting, or empty array if clean"]
}`;

    for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
        try {
            const ai = getNextClient();
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
            });

            const text = response.text || '';
            const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed: AIAnalysis = JSON.parse(cleaned);
            parsed.recommendation = parsed.overallMatch >= job.matchThreshold ? 'ACCEPTED' : 'REJECTED';
            if (!Array.isArray(parsed.warnings)) parsed.warnings = [];
            console.log("✅ Gemini analysis successful!");
            return parsed;
        } catch (err: any) {
            console.warn(`Gemini key #${currentKeyIndex + 1} failed:`, err.message || err);
            rotateKey();
        }
    }

    // ============ PRIORITY 3: Local NLP Engine ============
    console.warn('🔴 All AI APIs exhausted. Using Local NLP Engine.');
    return generateLocalAnalysis(resumeText, job);
}
