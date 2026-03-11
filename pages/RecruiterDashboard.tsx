import React, { useState, useEffect } from 'react';
import { User, Job } from '../types';
import { storageService } from '../services/storageService';
import { Plus, Inbox, MapPin, ChevronRight } from 'lucide-react';

interface RecruiterDashboardProps {
    user: User;
    onCreateJob: () => void;
    onViewJob: (jobId: string) => void;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user, onCreateJob, onViewJob }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [appCounts, setAppCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allJobs = await storageService.getJobsByCreator(user.id);
                setJobs(allJobs);

                const counts: Record<string, number> = {};
                for (const j of allJobs) {
                    const apps = await storageService.getApplicationsForJob(j.id);
                    counts[j.id] = apps.length;
                }
                setAppCounts(counts);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-500">Loading your dashboard...</p></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Recruiter Dashboard</h1>
                    <p className="mt-1 text-gray-500">Manage your job postings and review applicants</p>
                </div>
                <button
                    onClick={onCreateJob}
                    className="inline-flex items-center px-5 py-2.5 shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" strokeWidth={2.5} />
                    Post New Job
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Total Jobs</div>
                    <div className="text-3xl font-extrabold text-gray-900 mt-1">{jobs.length}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Total Applicants</div>
                    <div className="text-3xl font-extrabold text-gray-900 mt-1">{Object.values(appCounts).reduce((a, b) => a + b, 0)}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-sm font-medium text-gray-500">Active Postings</div>
                    <div className="text-3xl font-extrabold text-gray-900 mt-1">{jobs.filter(j => j.status === 'PUBLISHED').length}</div>
                </div>
            </div>

            {/* Job listing */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="mx-auto w-16 h-16 text-blue-200 mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                            <Inbox className="w-8 h-8 text-blue-500" strokeWidth={2} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
                        <p className="mt-2 text-gray-500 max-w-sm mx-auto">Create your first job posting to start finding candidates.</p>
                        <button onClick={onCreateJob} className="mt-6 px-6 py-3 text-sm font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                            Post New Job
                        </button>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {jobs.map((job) => (
                            <li key={job.id} onClick={() => onViewJob(job.id)} className="hover:bg-gray-50 transition-colors cursor-pointer block group">
                                <div className="px-6 py-5 flex items-center justify-between">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                            <span className="font-medium text-gray-700">{job.company}</span>
                                            <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />{job.location}</span>
                                            <span>{job.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-xl font-extrabold text-gray-900">{appCounts[job.id] || 0}</div>
                                            <div className="text-xs text-gray-400 font-medium">Applicants</div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${job.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                                                job.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                                            }`}>{job.status}</span>
                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
