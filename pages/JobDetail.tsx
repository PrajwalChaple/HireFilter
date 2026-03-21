import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Job, Application, AIAnalysis } from '../types';
import { storageService } from '../services/storageService';
import { extractTextFromPdf } from '../services/pdfService';
import { analyzeResume } from '../services/aiService';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { ArrowLeft, MapPin, Briefcase, Clock, Target, Check, CloudUpload, Info, PartyPopper, ClipboardList, XCircle, CheckCircle2, GraduationCap, Lightbulb, Zap } from 'lucide-react';

interface JobDetailProps {
    user: User;
    jobId: string;
    onBack: () => void;
}

type AnalysisState = 'idle' | 'extracting' | 'analyzing' | 'done' | 'error';

const JobDetail: React.FC<JobDetailProps> = ({ user, jobId, onBack }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [existingApp, setExistingApp] = useState<Application | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const found = await storageService.getJob(jobId);
                if (found) setJob(found);

                if (user.role === UserRole.CANDIDATE) {
                    const apps = await storageService.getApplicationsByCandidate(user.id);
                    const existing = apps.find(a => a.jobId === jobId);
                    if (existing) {
                        setExistingApp(existing);
                        setAnalysis(existing.aiAnalysis || null);
                        setAnalysisState('done');
                    }
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId, user.id, user.role]);

    const handleFile = (f: File) => {
        if (f.type !== 'application/pdf') {
            setError('Please upload a PDF file only.');
            return;
        }
        setFile(f);
        setError('');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleApply = async () => {
        if (!file || !job) return;
        setError('');

        try {
            // Step 1: Upload to Cloudinary
            setAnalysisState('extracting'); // Reusing this state visually but can add text
            const securePdfUrl = await uploadToCloudinary(file);

            // Step 2: Extract PDF text
            const resumeText = await extractTextFromPdf(file);

            if (!resumeText.trim()) {
                setError('Could not extract text from the PDF. Please ensure it is not a scanned image.');
                setAnalysisState('idle');
                return;
            }

            // Step 3: AI Analysis
            setAnalysisState('analyzing');
            const result = await analyzeResume(resumeText, job);
            setAnalysis(result);

            // Step 4: Save application to Firestore
            const app: Application = {
                id: Math.random().toString(36).substring(2, 9),
                jobId,
                candidateId: user.id,
                candidateName: user.name,
                candidateEmail: user.email,
                resumeFileName: file.name,
                resumeText,
                resumeUrl: securePdfUrl,
                appliedAt: Date.now(),
                status: result.recommendation,
                aiAnalysis: result,
            };
            await storageService.saveApplication(app);
            setExistingApp(app);
            setAnalysisState('done');
        } catch (err: any) {
            setError(err.message || 'Something went wrong during application processing.');
            setAnalysisState('error');
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading job details...</p></div>;
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-800 font-medium">&larr; Back</button>
            </div>
        );
    }

    /* ... The rest of the return body is exactly the same UI styling ... */
    return (
        <div className="bg-gray-50 min-h-[calc(100vh-4rem)] py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={onBack} className="group mb-6 inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                    <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Job Info Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    <div className="p-8 sm:p-10 border-b border-gray-100 relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full filter blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200 flex items-center justify-center font-extrabold text-blue-600 text-3xl shadow-inner flex-shrink-0">
                                    {job.company.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{job.title}</h1>
                                    <p className="text-lg text-blue-600 font-medium">{job.company}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                    {job.location}
                                </span>
                                <span className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                    <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
                                    {job.type}
                                </span>
                                <span className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                    {job.minExperience}+ yrs exp
                                </span>
                                <span className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 font-semibold">
                                    <Target className="w-4 h-4 mr-1.5" /> Min Match: {job.matchThreshold}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-10">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About the Role</h3>
                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed mb-8">{job.description}</p>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {job.requiredSkills.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg border border-blue-100 text-sm">{s}</span>
                            ))}
                        </div>
                        {job.preferredSkills.length > 0 && (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Preferred Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.preferredSkills.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 font-medium rounded-lg border border-gray-200 text-sm">{s}</span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Candidate Apply Section */}
                {user.role === UserRole.CANDIDATE && (
                    <>
                        {analysisState === 'done' && analysis ? (
                            <ResultCard analysis={analysis} job={job} />
                        ) : (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="p-8 sm:p-10">
                                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Apply for this Role</h2>
                                    <p className="text-gray-500 mb-8">Upload your resume (PDF) for instant AI-powered analysis</p>

                                    <div
                                        className={`dropzone ${dragOver ? 'active' : ''} ${file ? '!border-green-400 !bg-green-50' : ''}`}
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                                        {file ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                                                    <Check className="w-8 h-8" strokeWidth={3} />
                                                </div>
                                                <p className="text-lg font-bold text-green-800">{file.name}</p>
                                                <p className="text-sm text-green-600 mt-1">{(file.size / 1024).toFixed(1)} KB — Ready to analyze</p>
                                                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-3 text-sm text-gray-500 hover:text-red-600 transition-colors">Remove</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                                                    <CloudUpload className="w-8 h-8" strokeWidth={1.5} />
                                                </div>
                                                <p className="text-lg font-bold text-gray-700">Drag & drop your resume PDF here</p>
                                                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                                            </div>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">{error}</div>
                                    )}

                                    {(analysisState === 'extracting' || analysisState === 'analyzing') && (
                                        <div className="mt-8 text-center">
                                            <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100">
                                                <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-blue-700 font-semibold">
                                                    {analysisState === 'extracting' ? '📄 Extracting text from PDF...' : '🤖 AI is analyzing your resume...'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {analysisState === 'idle' && file && (
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={handleApply}
                                                className="px-10 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105"
                                            >
                                                🚀 Submit & Analyze Resume
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {user.role === UserRole.ADMIN && job.creatorId === user.id && (
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-4">
                        <p className="text-gray-500 font-medium flex items-center gap-2">
                            <Info className="w-5 h-5 text-gray-400" />
                            This is your job posting. View applicants from the dashboard.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Result Card — Candidate sees this after applying
const ResultCard: React.FC<{ analysis: AIAnalysis; job: Job }> = ({ analysis, job }) => {
    const accepted = analysis.recommendation === 'ACCEPTED';
    const hasWarnings = analysis.warnings && analysis.warnings.length > 0;

    // Warnings alert block — shared between accepted and rejected
    const WarningsBlock = () => hasWarnings ? (
        <div className="mx-8 sm:mx-10 my-6 p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl">
            <h3 className="font-bold text-amber-900 text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center text-amber-700">⚠️</span>
                Resume Warnings Detected
            </h3>
            <ul className="space-y-2 mb-4">
                {analysis.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-800 text-sm">
                        <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span className="leading-relaxed">{w}</span>
                    </li>
                ))}
            </ul>
            <p className="text-amber-700 text-xs font-medium leading-relaxed">
                <strong>Tip:</strong> Use a clean, single-column resume layout. Ensure all skills listed are backed by relevant experience or projects. Avoid using hidden or white-colored text.
            </p>
        </div>
    ) : null;

    if (accepted) {
        // ✅ ACCEPTED: Simple, elegant congratulations — no detailed breakdown needed
        return (
            <div className="rounded-3xl shadow-xl border border-green-200 overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white text-center py-16 px-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                        <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-white rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="text-white drop-shadow-lg mb-6 flex justify-center"><PartyPopper size={72} strokeWidth={1.5} /></div>
                        <h2 className="text-4xl font-extrabold mb-3">Congratulations!</h2>
                        <p className="text-xl text-white/90 mb-8">Your profile is a strong match for this role!</p>
                        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl">
                            <span className="text-5xl font-extrabold">{analysis.overallMatch}%</span>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white/80">Match Score</div>
                                <div className="text-xs text-white/60">Min required: {job.matchThreshold}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <WarningsBlock />
                <div className="bg-green-50 px-8 py-6 text-center">
                    <p className="text-green-800 font-medium flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Your application has been submitted successfully. The recruiter will review your profile shortly.
                    </p>
                </div>
            </div>
        );
    }

    // ❌ REJECTED: Detailed gap analysis report so candidate knows what to improve
    return (
        <div className="rounded-3xl shadow-xl border border-red-200 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-center py-10 px-8">
                <div className="text-white drop-shadow-lg mb-4 flex justify-center"><ClipboardList size={56} strokeWidth={1.5} /></div>
                <h2 className="text-3xl font-extrabold mb-2">Application Review Report</h2>
                <p className="text-lg text-white/80">Your profile didn't meet the minimum requirements for this role.</p>
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl mt-6">
                    <span className="text-4xl font-extrabold">{analysis.overallMatch}%</span>
                    <div className="text-left text-sm">
                        <div className="font-bold text-white/90">Your Score</div>
                        <div className="text-white/60">Needed: {job.matchThreshold}%</div>
                    </div>
                </div>
            </div>

            <WarningsBlock />

            <div className="p-8 sm:p-10 space-y-6 bg-white">
                {/* Missing Skills - Most Important */}
                {analysis.skillAnalysis.missing.length > 0 && (
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                        <h3 className="font-bold text-red-800 text-lg mb-1 flex items-center gap-2">
                            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600"><XCircle className="w-5 h-5" /></span>
                            Skills You're Missing
                        </h3>
                        <p className="text-red-600 text-sm mb-4">These skills were required but not found in your resume:</p>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skillAnalysis.missing.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white text-red-700 text-sm font-semibold rounded-lg border border-red-200 shadow-sm">{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills You Have */}
                {analysis.skillAnalysis.matched.length > 0 && (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                        <h3 className="font-bold text-green-800 text-lg mb-1 flex items-center gap-2">
                            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><CheckCircle2 className="w-5 h-5" /></span>
                            Skills You Have
                        </h3>
                        <p className="text-green-600 text-sm mb-4">Great! These were detected in your resume:</p>
                        <div className="flex flex-wrap gap-2">
                            {analysis.skillAnalysis.matched.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white text-green-700 text-sm font-semibold rounded-lg border border-green-200 shadow-sm">{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience & Education side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                        <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" /> Experience
                        </h4>
                        <p className="text-orange-700 text-sm leading-relaxed">{analysis.experienceMatch}</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" /> Education
                        </h4>
                        <p className="text-purple-700 text-sm leading-relaxed">{analysis.educationMatch}</p>
                    </div>
                </div>

                {/* What to Improve - Gap Analysis */}
                {analysis.gapAnalysis.length > 0 && (
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                        <h3 className="font-bold text-amber-900 text-lg mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600"><Lightbulb className="w-5 h-5" /></span>
                            What You Should Improve
                        </h3>
                        <ul className="space-y-3">
                            {analysis.gapAnalysis.map((gap, i) => (
                                <li key={i} className="flex items-start gap-3 text-amber-800 text-sm">
                                    <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    <span className="leading-relaxed">{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Encouragement */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
                    <p className="text-blue-800 font-medium text-sm leading-relaxed flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500" /> Don't give up! Work on the skills mentioned above and try again. Every rejection is a step closer to your dream job.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
