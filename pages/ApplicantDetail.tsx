import React, { useState, useEffect } from 'react';
import { User, Job, Application } from '../types';
import { storageService } from '../services/storageService';
import { ArrowLeft, Mail, Clock, FileText, Bot, Target, Briefcase, GraduationCap, BarChart2, AlertTriangle, Search, ClipboardList, CheckCircle2, XCircle } from 'lucide-react';

interface ApplicantDetailProps {
    user: User;
    jobId: string;
    appId: string;
    onBack: () => void;
}

const ApplicantDetail: React.FC<ApplicantDetailProps> = ({ user, jobId, appId, onBack }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [app, setApp] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const foundJob = await storageService.getJob(jobId);
                setJob(foundJob);
                const foundApp = await storageService.getApplication(appId);
                setApp(foundApp);
            } catch (error) {
                console.error("Error fetching applicant details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId, appId]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading candidate profile...</p>
            </div>
        );
    }

    if (!app || !job) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Applicant not found</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 font-medium">&larr; Back</button>
            </div>
        );
    }

    const analysis = app.aiAnalysis;
    const match = analysis?.overallMatch || 0;
    const accepted = app.status === 'ACCEPTED';
    const appliedDate = new Date(app.appliedAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={onBack} className="group mb-6 inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Applicants
                </button>

                {/* ═══════════ CANDIDATE PROFILE HERO CARD ═══════════ */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    <div className={`relative px-8 sm:px-10 py-10 ${accepted ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600' : 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-600'} text-white overflow-hidden`}>
                        {/* Decorative circles */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-10 -right-10 w-64 h-64 border-2 border-white rounded-full"></div>
                            <div className="absolute -bottom-16 -left-16 w-80 h-80 border border-white rounded-full"></div>
                        </div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-4xl font-extrabold flex-shrink-0">
                                    {app.candidateName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold">{app.candidateName}</h1>
                                    <p className="text-white/80 mt-1 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {app.candidateEmail}
                                    </p>
                                    <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Applied: {appliedDate}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl text-center">
                                    <div className="text-4xl font-extrabold">{match}%</div>
                                    <div className="text-xs text-white/70 font-medium mt-1">Match Score</div>
                                </div>
                                <div className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${accepted ? 'bg-white text-green-700' : 'bg-white text-red-700'}`}>
                                    {accepted ? <><CheckCircle2 className="w-4 h-4" /> ACCEPTED</> : <><XCircle className="w-4 h-4" /> REJECTED</>}
                                </div>
                                {app.resumeUrl && (
                                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
                                        <FileText className="w-4 h-4 mr-2" />
                                        View PDF Resume
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                        <div className="px-6 py-4 text-center">
                            <div className="text-2xl font-extrabold text-gray-900">{analysis?.skillAnalysis.matched.length || 0}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Skills Matched</div>
                        </div>
                        <div className="px-6 py-4 text-center">
                            <div className="text-2xl font-extrabold text-red-500">{analysis?.skillAnalysis.missing.length || 0}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Skills Missing</div>
                        </div>
                        <div className="px-6 py-4 text-center">
                            <div className="text-2xl font-extrabold text-gray-900">{job.matchThreshold}%</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Min Threshold</div>
                        </div>
                        <div className="px-6 py-4 text-center">
                            <div className="text-2xl font-extrabold text-gray-900">{app.resumeFileName?.split('.')[0]?.substring(0, 12) || 'N/A'}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">Resume File</div>
                        </div>
                    </div>
                </div>

                {/* ═══════════ TWO COLUMN LAYOUT ═══════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: Main Details */}
                    <div className="space-y-6">

                        {/* AI Summary Card */}
                        {analysis && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Bot className="w-5 h-5 text-blue-600" /> AI Summary
                                    </h2>
                                </div>
                                <div className="px-6 py-5">
                                    <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                                </div>
                            </div>
                        )}

                        {/* Skills Analysis Card */}
                        {analysis && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-600" /> Skills Analysis</h2>
                                </div>
                                <div className="px-6 py-5 space-y-5">
                                    {/* Matched */}
                                    {analysis.skillAnalysis.matched.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                                Matched ({analysis.skillAnalysis.matched.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.skillAnalysis.matched.map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-lg border border-green-200">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Missing */}
                                    {analysis.skillAnalysis.missing.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                                Missing ({analysis.skillAnalysis.missing.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.skillAnalysis.missing.map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-semibold rounded-lg border border-red-200">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* Partial */}
                                    {analysis.skillAnalysis.partial.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-yellow-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                                                Partial ({analysis.skillAnalysis.partial.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysis.skillAnalysis.partial.map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-sm font-semibold rounded-lg border border-yellow-200">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Experience & Education side by side */}
                        {analysis && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600"><Briefcase className="w-4 h-4" /></span>
                                        Experience
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{analysis.experienceMatch}</p>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600"><GraduationCap className="w-4 h-4" /></span>
                                        Education
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{analysis.educationMatch}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar Info */}
                    <div className="space-y-6">
                        {/* Match Score Ring */}
                        {analysis && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2"><BarChart2 className="w-5 h-5 text-blue-600" /> Match Score</h3>
                                <div className="relative inline-flex items-center justify-center w-32 h-32">
                                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                        <circle cx="60" cy="60" r="52" fill="none"
                                            stroke={accepted ? '#22c55e' : '#ef4444'}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(match / 100) * 327} 327`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-3xl font-extrabold ${accepted ? 'text-green-600' : 'text-red-500'}`}>{match}%</span>
                                    </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-500">Min required: {job.matchThreshold}%</div>
                            </div>
                        )}

                        {/* System Warnings — Recruiter sees this */}
                        {analysis && analysis.warnings && analysis.warnings.length > 0 && (
                            <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-6">
                                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center text-amber-700">🛡️</span>
                                    System Warnings
                                </h3>
                                <p className="text-amber-700 text-xs mb-3 font-medium">Our AI detected potential issues with this application:</p>
                                <ul className="space-y-2">
                                    {analysis.warnings.map((w, i) => (
                                        <li key={i} className="text-amber-800 text-sm flex items-start gap-2">
                                            <span className="w-5 h-5 bg-amber-300 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                            {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}


                        {/* Gap Analysis */}
                        {analysis && analysis.gapAnalysis.length > 0 && (
                            <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                                <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600"><AlertTriangle className="w-4 h-4" /></span>
                                    Gaps Identified
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.gapAnalysis.map((g, i) => (
                                        <li key={i} className="text-red-700 text-sm flex items-start gap-2">
                                            <span className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                            {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Evidence */}
                        {analysis && analysis.evidence.length > 0 && (
                            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                                <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><Search className="w-4 h-4" /></span>
                                    Key Evidence
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.evidence.map((e, i) => (
                                        <li key={i} className="text-blue-700 text-sm flex items-start gap-2">
                                            <span className="text-blue-400 mt-0.5">•</span>{e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Applied For Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><ClipboardList className="w-4 h-4" /></span>
                                Applied For
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Position</span>
                                    <span className="font-semibold text-gray-900">{job.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Company</span>
                                    <span className="font-semibold text-gray-900">{job.company}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-semibold text-gray-900">{job.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-semibold text-gray-900">{job.type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicantDetail;
