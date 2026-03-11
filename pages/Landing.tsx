import React, { useState } from 'react';
import { FileText, Target, Zap, Building2, Search, BarChart3, TrendingUp, SlidersHorizontal, ListOrdered, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';

interface LandingProps {
    onStart: () => void;
}

/* ─── Reusable sub-components ─── */

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#3B82F6" opacity="0.12" />
        <path d="M6 10l3 3 5-5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const PlusMinusIcon = ({ open }: { open: boolean }) => (
    <span style={{
        fontSize: '24px',
        fontWeight: 300,
        color: open ? '#3B82F6' : '#9CA3AF',
        transition: 'all 0.3s',
        lineHeight: 1,
    }}>
        {open ? '−' : '+'}
    </span>
);

/* ─── Main Landing ─── */

const Landing: React.FC<LandingProps> = ({ onStart }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div style={{ background: '#F8F9FA', overflowX: 'hidden' }}>

            {/* ═══════════ HERO ═══════════ */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '80px 2rem 60px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                alignItems: 'center',
            }} id="product">
                {/* Left */}
                <div>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 16px',
                        background: '#EFF6FF',
                        borderRadius: '50px',
                        border: '1px solid #BFDBFE',
                        color: '#2563EB',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginBottom: '24px'
                    }}>
                        <span>Powered by Groq AI</span>
                    </div>

                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: 800,
                        color: '#1A1D23',
                        lineHeight: 1.1,
                        letterSpacing: '-1.5px',
                        margin: '0 0 24px',
                    }}>
                        Hire Smarter,{' '}
                        <span style={{ color: '#3B82F6' }}>Not Harder</span>
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        color: '#6B7280',
                        lineHeight: 1.7,
                        maxWidth: '480px',
                        margin: '0 0 24px',
                    }}>
                        Upload a resume and let our AI do the work. It scan skills and experience to find your perfect candidate in seconds.
                    </p>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '36px', flexWrap: 'wrap', maxWidth: '480px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>
                            <FileText className="w-4 h-4 text-blue-500" /> Scan PDF Resumes
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>
                            <Target className="w-4 h-4 text-indigo-500" /> Match Best Skills
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>
                            <BarChart3 className="w-4 h-4 text-emerald-500" /> See What's Missing
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <button
                            onClick={onStart}
                            style={{
                                padding: '14px 32px',
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#fff',
                                background: '#1A1D23',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
                            }}
                        >
                            Get Started Free →
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
                        <span>For Recruiters & Candidates</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#D1D5DB' }} />
                        <span>100% Free to Use</span>
                    </div>
                </div>

                {/* Right — 3D Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src="/images/hero-avatar.png"
                        alt="AI-powered hiring assistant"
                        style={{
                            width: '100%',
                            maxWidth: '480px',
                            borderRadius: '24px',
                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
                        }}
                    />
                </div>
            </section>

            {/* ═══════════ FEATURES ═══════════ */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '100px 2rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '80px',
                alignItems: 'center',
            }} id="how-it-works">
                {/* Left */}
                <div>

                    <h2 style={{
                        fontSize: '42px', fontWeight: 800, color: '#1A1D23',
                        lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 20px',
                    }}>
                        Automate, Optimize,<br />and Save Time
                    </h2>
                    <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7, marginBottom: '32px', maxWidth: '440px' }}>
                        Let our AI handle the heavy lifting — from resume parsing to skill matching — so you can focus on what matters: finding the right people.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            'AI-Powered Resume Scanning in seconds',
                            'Automatic Skill Matching & Ranking',
                            'Detailed Gap Analysis for candidates',
                            'Smart Shortlisting with match threshold',
                            'PDF Upload with instant processing',
                        ].map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CheckIcon />
                                <span style={{ fontSize: '15px', color: '#374151', fontWeight: 500 }}>{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — How it works */}
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '36px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.04)',
                }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1D23', marginBottom: '28px' }}>How It Works</div>
                    {[
                        { step: '1', title: 'Post a Job', desc: 'Define job requirements and set a match threshold for candidates.' },
                        { step: '2', title: 'Apply with Resume', desc: 'Candidates upload their PDF resume to apply for the position.' },
                        { step: '3', title: 'AI Analysis', desc: 'Our AI scans the resume and matches it against your requirements.' },
                        { step: '4', title: 'Instant Results', desc: 'Get ranked candidates with detailed skill gap feedback.' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '16px',
                            padding: '16px 0',
                            borderBottom: i < 3 ? '1px solid #F3F4F6' : 'none',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontWeight: 700, fontSize: '14px',
                                boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
                            }}>{item.step}</div>
                            <div>
                                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1D23', marginBottom: '4px' }}>{item.title}</div>
                                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ STATS SECTION ═══════════ */}
            <section style={{
                background: 'linear-gradient(135deg, #1A1D23 0%, #111827 100%)',
                padding: '80px 2rem',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '40px',
                    textAlign: 'center',
                }} id="stats-grid">
                    {[
                        { number: 'PDF', label: 'Resume Support', icon: <FileText size={32} color="#3B82F6" /> },
                        { number: '95%', label: 'Matching Accuracy', icon: <Target size={32} color="#8B5CF6" /> },
                        { number: '3s', label: 'Avg. Scan Time', icon: <Zap size={32} color="#F59E0B" /> },
                        { number: '100%', label: 'Free to Use', icon: <Building2 size={32} color="#10B981" /> },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: '32px 20px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
                            <div style={{
                                fontSize: '40px',
                                fontWeight: 800,
                                color: '#fff',
                                letterSpacing: '-1px',
                                marginBottom: '8px',
                            }}>{stat.number}</div>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.5)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ FEATURES GRID ═══════════ */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '100px 2rem',
            }} id="features-detail">
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '6px 16px', borderRadius: '50px',
                        background: '#EFF6FF', border: '1px solid #BFDBFE',
                        fontSize: '13px', fontWeight: 600, color: '#2563EB', marginBottom: '20px',
                    }}>
                        BUILT FOR MODERN HIRING
                    </div>
                    <h2 style={{
                        fontSize: '42px', fontWeight: 800, color: '#1A1D23',
                        lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 16px',
                    }}>
                        Everything You Need to Hire Right
                    </h2>
                    <p style={{ fontSize: '16px', color: '#6B7280', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                        HireFilter combines advanced AI with simple UX to help recruiters and candidates connect faster.
                    </p>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '24px',
                }} id="features-grid">
                    {[
                        { icon: <Search size={24} color="#2563EB" />, title: 'Smart Parsing', desc: 'AI extracts skills, education, experience, and certifications from any PDF resume automatically.' },
                        { icon: <BarChart3 size={24} color="#7C3AED" />, title: 'Match Scoring', desc: 'Each candidate gets a percentage match score based on your specific job requirements.' },
                        { icon: <TrendingUp size={24} color="#D97706" />, title: 'Gap Analysis', desc: 'Instantly see which skills a candidate is missing and where they excel beyond expectations.' },
                        { icon: <SlidersHorizontal size={24} color="#4F46E5" />, title: 'Custom Thresholds', desc: 'Set your own minimum match percentage — candidates below it are flagged automatically.' },
                        { icon: <ListOrdered size={24} color="#059669" />, title: 'Ranked Shortlists', desc: 'Candidates are sorted by match score so you always see the best-fit candidates first.' },
                        { icon: <ShieldCheck size={24} color="#DC2626" />, title: 'Secure & Private', desc: 'All resume data is encrypted and processed securely. We never share your data with third parties.' },
                    ].map((feat, i) => (
                        <div key={i} style={{
                            padding: '32px',
                            borderRadius: '20px',
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                            transition: 'all 0.3s ease',
                            cursor: 'default',
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                            }}
                        >
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '14px',
                                background: '#EFF6FF',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', marginBottom: '20px',
                            }}>{feat.icon}</div>
                            <div style={{ fontSize: '17px', fontWeight: 700, color: '#1A1D23', marginBottom: '10px' }}>{feat.title}</div>
                            <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7 }}>{feat.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ FAQ ═══════════ */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '80px 2rem 100px',
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: '80px',
                alignItems: 'start',
            }} id="faq">
                {/* Left */}
                <div>
                    <h2 style={{ fontSize: '38px', fontWeight: 800, color: '#1A1D23', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '16px' }}>
                        Frequently Asked<br />Questions
                    </h2>
                    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
                        Everything you need to know about HireFilter and how it can transform your hiring process.
                    </p>
                </div>

                {/* Right — Accordion */}
                <div>
                    {[
                        { q: 'How does the AI resume scanning work?', a: 'Our advanced AI parses uploaded PDF resumes and extracts skills, experience, education, and other relevant details. It then matches these against your job requirements to produce a match score.' },
                        { q: 'What file formats are supported?', a: 'Currently we support PDF format for resume uploads. This ensures consistent and reliable text extraction for accurate AI analysis.' },
                        { q: 'How accurate is the skill matching?', a: 'Our AI achieves 95%+ accuracy in skill extraction and matching, continuously improving through feedback loops and model updates.' },
                        { q: 'Can I set custom match thresholds?', a: 'Yes! Recruiters can set a minimum match percentage for each job posting. Candidates below the threshold are automatically flagged.' },
                        { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted in transit and at rest. We never share or sell your data to third parties.' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            borderBottom: '1px solid #E5E7EB',
                            overflow: 'hidden',
                        }}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '22px 0',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <span style={{ fontSize: '16px', fontWeight: 600, color: openFaq === i ? '#3B82F6' : '#1A1D23', transition: 'color 0.2s' }}>{item.q}</span>
                                <PlusMinusIcon open={openFaq === i} />
                            </button>
                            <div style={{
                                maxHeight: openFaq === i ? '200px' : '0',
                                overflow: 'hidden',
                                transition: 'max-height 0.35s ease, padding 0.35s ease',
                                paddingBottom: openFaq === i ? '20px' : '0',
                            }}>
                                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ CTA BANNER ═══════════ */}
            <section style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 2rem 100px',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #1A1D23 0%, #1E293B 100%)',
                    borderRadius: '28px',
                    padding: '72px 60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                }} id="cta-banner">
                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: '-40px', right: '-40px',
                        width: '220px', height: '220px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-60px', left: '30%',
                        width: '180px', height: '180px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                        <h2 style={{
                            fontSize: '36px', fontWeight: 800, color: '#fff',
                            lineHeight: 1.2, letterSpacing: '-0.8px', margin: '0 0 14px',
                        }}>
                            Ready to Transform Your Hiring?
                        </h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>
                            Join hundreds of recruiters who save hours every week with AI-powered resume screening. Start for free — no credit card required.
                        </p>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <button
                            onClick={onStart}
                            style={{
                                padding: '16px 36px',
                                fontSize: '15px',
                                fontWeight: 600,
                                color: '#1A1D23',
                                background: '#fff',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.25s',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)';
                                e.currentTarget.style.background = '#EFF6FF';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)';
                                e.currentTarget.style.background = '#fff';
                            }}
                        >
                            Get Started Free →
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer style={{
                background: '#0B0D11',
                padding: '72px 2rem 0',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                }}>
                    {/* Top section — 4 columns */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                        gap: '48px',
                        paddingBottom: '48px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }} id="footer-grid">
                        {/* Brand column */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                                <img
                                    src="/image.svg"
                                    alt="HireFilter Logo"
                                    style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)', shapeRendering: 'geometricPrecision' }}
                                />
                                <span style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>HireFilter</span>
                            </div>
                            <p style={{
                                fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                                lineHeight: 1.7, margin: '0 0 24px', maxWidth: '280px',
                            }}>
                                AI-powered resume screening that helps recruiters find the best candidates faster. Built with Groq AI for lightning-fast analysis.
                            </p>
                            {/* Social Links */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {[
                                    { label: 'GitHub', href: 'https://github.com/PrajwalChaple', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.28-1.23 3.28-1.23.67 1.66.26 2.88.13 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' },
                                    { label: 'LinkedIn', href: 'https://linkedin.com/in/prajwalchaple', path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0z' },
                                    { label: 'Instagram', href: 'https://www.instagram.com/prajwal__14_', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                                ].map((social, i) => (
                                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                                        aria-label={social.label}
                                        style={{
                                            width: '36px', height: '36px', borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                                            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                                            <path d={social.path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Product column */}
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>Product</div>
                            {['How It Works', 'Features', 'FAQ', 'Get Started'].map((link, i) => (
                                <a key={i} href={['#how-it-works', '#features-detail', '#faq', '#'][i]}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (i === 3) { onStart(); return; }
                                        const el = document.querySelector(['#how-it-works', '#features-detail', '#faq', '#'][i]);
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    style={{
                                        display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                                        textDecoration: 'none', marginBottom: '14px',
                                        transition: 'color 0.2s', cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                >{link}</a>
                            ))}
                        </div>

                        {/* Resources column */}
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>Resources</div>
                            {['For Recruiters', 'For Candidates', 'AI Resume Tips', 'Help Center'].map((link, i) => (
                                <a key={i} href="#"
                                    onClick={(e) => e.preventDefault()}
                                    style={{
                                        display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                                        textDecoration: 'none', marginBottom: '14px',
                                        transition: 'color 0.2s', cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                >{link}</a>
                            ))}
                        </div>

                        {/* Legal / Contact column */}
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>Legal</div>
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map((link, i) => (
                                <a key={i} href="#"
                                    onClick={(e) => e.preventDefault()}
                                    style={{
                                        display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.45)',
                                        textDecoration: 'none', marginBottom: '14px',
                                        transition: 'color 0.2s', cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                >{link}</a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '24px 0',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                            © 2026 HireFilter. All rights reserved.
                        </span>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                            Designed & Developed by{' '}
                            <a
                                href="https://github.com/PrajwalChaple"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: '#3B82F6',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#60A5FA'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#3B82F6'}
                            >
                                Prajwal Chaple
                            </a>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
