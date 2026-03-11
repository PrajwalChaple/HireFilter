import React, { useState, useEffect } from 'react';
import { User, Job, Application } from '../types';
import { storageService } from '../services/storageService';
import { ArrowLeft, Users, ChevronRight } from 'lucide-react';

interface JobApplicantsProps {
    user: User;
    jobId: string;
    onBack: () => void;
    onViewApplicant: (appId: string) => void;
}

const JobApplicants: React.FC<JobApplicantsProps> = ({ user, jobId, onBack, onViewApplicant }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const found = await storageService.getJob(jobId);
                if (found) setJob(found);

                const apps = await storageService.getApplicationsForJob(jobId);
                // Sort highest match first
                apps.sort((a, b) => (b.aiAnalysis?.overallMatch || 0) - (a.aiAnalysis?.overallMatch || 0));
                setApplications(apps);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId]);

    if (loading) {
        return <div className="max-w-5xl mx-auto px-4 py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading applicants...</p></div>;
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
                <button onClick={onBack} className="mt-4 text-blue-600 font-medium">&larr; Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={onBack} className="group mb-6 inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">{job.title}</h1>
                <p className="text-gray-500 mt-1">{job.company} — {applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No applicants yet</h3>
                    <p className="text-gray-500 mt-2">Applications will appear here as candidates apply.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app, index) => {
                        const match = app.aiAnalysis?.overallMatch || 0;
                        const accepted = app.status === 'ACCEPTED';
                        const rejected = app.status === 'REJECTED';

                        return (
                            <div
                                key={app.id}
                                onClick={() => onViewApplicant(app.id)}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div className="flex items-center p-6 gap-6">
                                    {/* Rank Badge */}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg flex-shrink-0 shadow-inner ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-amber-500/30' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                                                index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                                                    'bg-gray-100 text-gray-500'
                                        }`}>
                                        #{index + 1}
                                    </div>

                                    {/* Candidate Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{app.candidateName}</h3>
                                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${accepted ? 'bg-green-100 text-green-700' : rejected ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{app.candidateEmail}</p>

                                        {/* Skills Preview */}
                                        {app.aiAnalysis && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {app.aiAnalysis.skillAnalysis.matched.slice(0, 4).map((s, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded border border-green-100">{s}</span>
                                                ))}
                                                {app.aiAnalysis.skillAnalysis.missing.slice(0, 2).map((s, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100">{s}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Match Score */}
                                    <div className="flex-shrink-0 text-center">
                                        <div className={`text-3xl font-extrabold ${match >= job.matchThreshold ? 'text-green-600' : 'text-red-500'}`}>
                                            {match}%
                                        </div>
                                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${match >= job.matchThreshold ? 'bg-green-500' : 'bg-red-400'}`}
                                                style={{ width: `${match}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">match</p>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default JobApplicants;
