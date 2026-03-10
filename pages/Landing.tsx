import React from 'react';

interface LandingProps {
    onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-5xl w-full text-center space-y-8 relative z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                    Powered by Google Gemini AI
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Hire smarter, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        not harder.
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Upload a resume. Our AI scans it in seconds — matching skills, experience, and potential against your job requirements.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-10 mt-8">
                    {[
                        { value: '95%', label: 'Matching Accuracy' },
                        { value: '10s', label: 'AI Scan Time' },
                        { value: '80%', label: 'Time Saved' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{stat.value}</div>
                            <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="pt-8">
                    <button
                        onClick={onStart}
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gray-900 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative flex items-center">
                            Get Started Free
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </div>

                {/* Feature cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        { icon: '🎯', title: 'AI Resume Scanning', desc: 'Upload a PDF and our Gemini AI extracts skills, experience, and education in seconds.' },
                        { icon: '📊', title: 'Smart Ranking', desc: 'Applicants are automatically ranked by match percentage — best candidates rise to the top.' },
                        { icon: '🔍', title: 'Gap Analysis', desc: 'Candidates get detailed feedback on missing skills and improvement areas.' }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm border border-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: '1', title: 'Post a Job', desc: 'Recruiters define job requirements and set a match threshold.' },
                            { step: '2', title: 'Apply with Resume', desc: 'Candidates upload their PDF resume to apply.' },
                            { step: '3', title: 'AI Analysis', desc: 'Gemini AI scans the resume and matches it against requirements.' },
                            { step: '4', title: 'Instant Results', desc: 'Accept or reject with detailed skill gap feedback.' },
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/30 mb-4">
                                    {item.step}
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
