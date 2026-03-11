import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
    onNavigate: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            transition: 'all 0.3s ease',
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '0 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '72px',
            }}>
                {/* Logo */}
                <div
                    onClick={onNavigate}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }}
                >
                    <img 
                        src="/image.svg" 
                        alt="HireFilter Logo" 
                        style={{ height: '40px', width: 'auto', shapeRendering: 'geometricPrecision' }} 
                    />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        color: '#1A1D23',
                        letterSpacing: '-0.5px',
                    }}>
                        HireFilter
                    </span>
                </div>

                {/* Center nav links (visible when not logged in) */}
                {!user && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '32px',
                    }}>
                        {[
                            { label: 'How It Works', href: '#how-it-works' },
                            { label: 'FAQ', href: '#faq' }
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    color: '#4B5563',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                    cursor: 'pointer',
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const el = document.querySelector(link.href);
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1A1D23')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#4B5563')}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {user ? (
                        <>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                marginRight: '8px',
                            }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1D23' }}>
                                    {user.name}
                                </span>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                                    {user.role === UserRole.ADMIN ? 'Recruiter' : 'Candidate'}
                                </span>
                            </div>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '15px',
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={onLogout}
                                style={{
                                    marginLeft: '8px',
                                    padding: '8px 18px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#4B5563',
                                    background: 'transparent',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#F3F4F6';
                                    e.currentTarget.style.color = '#1A1D23';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#4B5563';
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onNavigate}
                            style={{
                                padding: '10px 28px',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#fff',
                                background: '#1A1D23',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#3B82F6';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#1A1D23';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                            }}
                        >
                            Try Now
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
