// Comprehensive skill synonym map
export const SKILL_SYNONYMS: Record<string, string[]> = {
    "javascript": ["javascript", "js", "ecmascript", "es6", "es5"],
    "typescript": ["typescript", "ts"],
    "react": ["react", "react.js", "reactjs", "react js"],
    "react native": ["react native", "react-native", "reactnative"],
    "next.js": ["next.js", "nextjs", "next js"],
    "vue": ["vue", "vue.js", "vuejs", "vue js"],
    "angular": ["angular", "angularjs", "angular.js"],
    "node.js": ["node.js", "nodejs", "node js", "node"],
    "express": ["express", "express.js", "expressjs"],
    "python": ["python", "python3", "py"],
    "java": ["java", "jdk", "jre", "j2ee", "java 8", "java 11", "java 17"],
    "c++": ["c++", "cpp", "c plus plus"],
    "c#": ["c#", "csharp", "c sharp"],
    "html": ["html", "html5", "html/css"],
    "css": ["css", "css3", "html/css"],
    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
    "bootstrap": ["bootstrap"],
    "sass": ["sass", "scss"],
    "mongodb": ["mongodb", "mongo", "mongo db"],
    "mysql": ["mysql", "my sql"],
    "postgresql": ["postgresql", "postgres", "psql"],
    "oracle": ["oracle", "oracle db", "oracledb"],
    "firebase": ["firebase", "firestore"],
    "sql": ["sql", "structured query language", "mysql", "postgresql", "postgres", "sqlite", "oracle"],
    "nosql": ["nosql", "no sql", "no-sql", "mongodb", "dynamodb"],
    "git": ["git", "github", "gitlab", "bitbucket", "version control"],
    "docker": ["docker", "containerization", "containers"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services", "amazon cloud", "ec2", "s3", "lambda"],
    "gcp": ["gcp", "google cloud", "google cloud platform"],
    "azure": ["azure", "microsoft azure"],
    "cloud": ["cloud", "aws", "azure", "gcp", "google cloud", "amazon web services"],
    "graphql": ["graphql", "graph ql"],
    "rest": ["rest", "restapi", "rest api", "restful", "rest apis"],
    "rest apis": ["rest apis", "rest api", "restful api", "restful apis", "restful"],
    "django": ["django"],
    "flask": ["flask"],
    "spring": ["spring", "spring boot", "springboot", "spring framework"],
    "hibernate": ["hibernate", "jpa"],
    "ruby on rails": ["ruby on rails", "rails", "ror"],
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning", "dl"],
    "artificial intelligence": ["artificial intelligence", "ai"],
    "data science": ["data science", "data analysis", "data analytics"],
    "tensorflow": ["tensorflow", "tf"],
    "pytorch": ["pytorch", "torch"],
    "flutter": ["flutter"],
    "dart": ["dart"],
    "swift": ["swift"],
    "kotlin": ["kotlin"],
    "go": ["golang", "go lang"],
    "rust": ["rust"],
    "php": ["php"],
    "laravel": ["laravel"],
    "redis": ["redis"],
    "elasticsearch": ["elasticsearch", "elastic search", "elastic"],
    "figma": ["figma"],
    "photoshop": ["photoshop", "adobe photoshop"],
    "illustrator": ["illustrator", "adobe illustrator"],
    "agile": ["agile"],
    "scrum": ["scrum"],
    "jira": ["jira"],
    "jenkins": ["jenkins"],
    "maven": ["maven"],
    "ci/cd": ["ci/cd", "ci cd", "cicd", "continuous integration", "continuous deployment"],
    "linux": ["linux", "ubuntu", "debian", "centos"],
    "nginx": ["nginx"],
    "terraform": ["terraform"],
    "webpack": ["webpack"],
    "vite": ["vite"],
    "jest": ["jest"],
    "cypress": ["cypress"],
    "seo": ["seo", "search engine optimization"],
    "solidity": ["solidity"],
    "web3": ["web3", "web3.js"],
    "blockchain": ["blockchain", "block chain"],
};

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Cleans up a skill string by removing stray parentheses, brackets, etc.
 */
function cleanSkillString(skill: string): string {
    return skill
        .replace(/^[\s()\[\]]+/, '')  // Remove leading junk
        .replace(/[\s()\[\]]+$/, '')  // Remove trailing junk
        .trim();
}

/**
 * Splits compound skills like "SQL (PostgreSQL, Oracle)" into individual parts:
 * -> ["SQL", "PostgreSQL", "Oracle"]
 * Also handles "HTML/ CSS" -> ["HTML", "CSS"]
 * Also handles "Cloud (AWS, Azure)" -> ["Cloud", "AWS", "Azure"]
 */
function splitCompoundSkill(skill: string): string[] {
    const parts: string[] = [];

    // Extract main skill and parenthetical content
    const parenMatch = skill.match(/^([^(]+)\(([^)]+)\)/);
    if (parenMatch) {
        // Main part before parentheses
        const mainPart = cleanSkillString(parenMatch[1]);
        if (mainPart) parts.push(mainPart);

        // Individual items inside parentheses
        const innerParts = parenMatch[2].split(/[,•·]+/).map(s => cleanSkillString(s)).filter(Boolean);
        parts.push(...innerParts);
    }

    // Handle slash-separated: "HTML/ CSS" or "HTML/CSS"
    if (parts.length === 0 && skill.includes('/')) {
        const slashParts = skill.split(/\s*\/\s*/).map(s => cleanSkillString(s)).filter(Boolean);
        parts.push(...slashParts);
    }

    // Handle bullet-separated: "REST APIs • GraphQL"
    if (parts.length === 0 && (skill.includes('•') || skill.includes('·'))) {
        const bulletParts = skill.split(/\s*[•·]\s*/).map(s => cleanSkillString(s)).filter(Boolean);
        parts.push(...bulletParts);
    }

    // If nothing was split, return the cleaned original
    if (parts.length === 0) {
        parts.push(cleanSkillString(skill));
    }

    return parts.filter(p => p.length > 0);
}

/**
 * Checks if a required skill is present in the resume text.
 * Handles compound skills, synonyms, and variations.
 */
export const isSkillInResume = (skill: string, resumeText: string): boolean => {
    const resumeLower = resumeText.toLowerCase();

    // Split compound skills into individual parts
    const skillParts = splitCompoundSkill(skill);

    // If ANY part of the compound skill is found -> matched
    for (const part of skillParts) {
        const partLower = part.toLowerCase().trim();
        if (!partLower) continue;

        // 1. Direct string match
        if (resumeLower.includes(partLower)) return true;

        // 2. Check synonyms
        for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
            if (canonical === partLower || synonyms.includes(partLower)) {
                for (const syn of synonyms) {
                    if (resumeLower.includes(syn)) return true;
                }
                if (resumeLower.includes(canonical)) return true;
            }
        }

        // 3. Word boundary check for short skills (avoid "go" matching "good")
        if (partLower.length <= 3) {
            const wordBoundaryRegex = new RegExp(`\\b${escapeRegex(partLower)}\\b`, 'i');
            if (wordBoundaryRegex.test(resumeText)) return true;
        }
    }

    return false;
};

// Extracts years of experience by analyzing dates
export const extractExperienceYears = (text: string): number => {
    const content = text.toLowerCase();
    let maxYears = 0;

    // Pattern 1: Explicit like "5+ years", "3 yrs of experience"
    const explicitRegex = /(\d+)(?:\+| -)?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/gi;
    let match;
    while ((match = explicitRegex.exec(content)) !== null) {
        const years = parseInt(match[1], 10);
        if (years > maxYears && years < 30) maxYears = years;
    }

    // Pattern 2: Date ranges like "2018 - 2022" or "2020 - Present"
    const dateRangeRegex = /(20\d{2}|19\d{2})\s*(?:-|to|–|—)\s*(present|current|now|20\d{2})/gi;
    while ((match = dateRangeRegex.exec(content)) !== null) {
        const startYear = parseInt(match[1], 10);
        const endYearStr = match[2].toLowerCase();
        const endYear = (['present', 'current', 'now'].includes(endYearStr))
            ? new Date().getFullYear()
            : parseInt(endYearStr, 10);
        const years = endYear - startYear;
        if (years > maxYears && years > 0 && years < 30) maxYears = years;
    }

    return maxYears;
};
