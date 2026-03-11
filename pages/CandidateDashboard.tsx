import React, { useState, useEffect } from 'react';
import { User, Job } from '../types';
import { storageService } from '../services/storageService';
import { Search, MapPin, ChevronRight, Check } from 'lucide-react';

interface CandidateDashboardProps {
    user: User;
    onViewJob?: (jobId: string) => void;
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ user, onViewJob }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pJobs = await storageService.getPublishedJobs();
                setJobs(pJobs);

                const myApps = await storageService.getApplicationsByCandidate(user.id);
                setAppliedJobIds(new Set(myApps.map(a => a.jobId)));
            } catch (error) {
                console.error("Error fetching candidate data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading open positions...</p></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Find Your Next Role</h1>
                <p className="mt-2 text-lg text-gray-500">Discover opportunities and apply with AI-powered matching</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No open positions yet</h3>
                        <p className="text-gray-500 mt-2 text-lg">Check back soon for new opportunities.</p>
                    </div>
                ) : (
                    jobs.map(job => {
                        const applied = appliedJobIds.has(job.id);
                        return (
                            <div
                                key={job.id}
                                onClick={() => onViewJob && onViewJob(job.id)}
                                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer group flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center font-extrabold text-blue-600 text-2xl shadow-inner">
                                        {job.company.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex gap-2">
                                        {applied && (
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                                Applied
                                            </span>
                                        )}
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                                            {job.type}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">{job.title}</h3>
                                <p className="text-gray-500 font-medium text-sm mb-4">{job.company}</p>

                                <div className="flex-1"></div>

                                <div className="flex flex-wrap gap-2 mb-5">
                                    {job.requiredSkills.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200">{skill}</span>
                                    ))}
                                    {job.requiredSkills.length > 3 && (
                                        <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg border border-gray-200">+{job.requiredSkills.length - 3}</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm font-medium text-gray-500">
                                        <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                        {job.location}
                                    </div>
                                    <div className="text-blue-600 font-bold text-sm flex items-center group-hover:text-indigo-600 transition-colors">
                                        View Details
                                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CandidateDashboard;
