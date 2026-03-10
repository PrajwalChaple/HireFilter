import React, { useState } from 'react';
import { User, Job } from '../types';
import { storageService } from '../services/storageService';

interface JobCreateProps {
    user: User;
    onCancel: () => void;
    onSuccess: () => void;
}

const JobCreate: React.FC<JobCreateProps> = ({ user, onCancel, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [preferredSkills, setPreferredSkills] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState<'Full-time' | 'Internship' | 'Remote' | 'Contract'>('Full-time');
    const [minExperience, setMinExperience] = useState('0');
    const [matchThreshold, setMatchThreshold] = useState(60);
    const [weights, setWeights] = useState({ skills: 40, experience: 30, education: 20, tools: 10 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newJob: Job = {
            id: Math.random().toString(36).substring(2, 9),
            creatorId: user.id,
            title,
            company,
            description,
            requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
            preferredSkills: preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
            minExperience: parseInt(minExperience, 10) || 0,
            location,
            type,
            weights,
            matchThreshold,
            status: 'PUBLISHED',
            createdAt: Date.now()
        };

        try {
            await storageService.saveJob(newJob);
            onSuccess();
        } catch (err) {
            console.error("Failed to create job:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-10 md:py-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSI4NiI+CjxyZWN0IHdpZHRoPSI4NiIgaGVpZ2h0PSI4NiIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSI0MyIgY3k9IjQzIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiPjwvY2lyY2xlPgo8L3N2Zz4=')]"></div>
                    <h2 className="text-3xl md:text-4xl font-extrabold relative z-10">Post a New Role</h2>
                    <p className="mt-3 text-blue-100 text-lg font-medium max-w-xl relative z-10">Define your requirements and let AI find the best candidates.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8 relative z-10">
                    {/* ... Rest of form inputs are exactly the same ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Title *</label>
                            <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="e.g. Senior Frontend Engineer" />
                        </div>
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Company Name *</label>
                            <input required value={company} onChange={e => setCompany(e.target.value)} type="text" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="e.g. Acme Corp" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Description *</label>
                        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white resize-none" placeholder="Describe the role, responsibilities, and what you're looking for..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills * (comma separated)</label>
                            <input required value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} type="text" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="React, Node.js, TypeScript" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Skills (comma separated)</label>
                            <input value={preferredSkills} onChange={e => setPreferredSkills(e.target.value)} type="text" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Docker, AWS, GraphQL" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                            <input required value={location} onChange={e => setLocation(e.target.value)} type="text" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Remote / City" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white">
                                <option value="Full-time">Full-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Min Experience (Years)</label>
                            <input value={minExperience} onChange={e => setMinExperience(e.target.value)} type="number" min="0" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-gray-700">Minimum Match Threshold</label>
                            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{matchThreshold}%</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="95"
                            value={matchThreshold}
                            onChange={e => setMatchThreshold(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Candidates scoring below this threshold will be automatically rejected. Recommended: 50-70%
                        </p>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-4 border-t border-gray-100">
                        <button type="button" onClick={onCancel} disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3.5 border border-gray-200 shadow-sm text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3.5 shadow-lg shadow-blue-500/30 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center">
                            {isSubmitting ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Saving...</>
                            ) : 'Publish Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobCreate;
