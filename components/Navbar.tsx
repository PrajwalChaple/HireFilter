import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
    user: User | null;
    onLogout: () => void;
    onNavigate: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center cursor-pointer" onClick={onNavigate}>
                        <div className="flex bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text text-2xl font-bold tracking-tighter">
                            HireFilter
                        </div>
                        <div className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                            AI Powered
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                    <span className="text-xs text-gray-500">{user.role === UserRole.ADMIN ? 'Recruiter' : 'Candidate'}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="ml-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="text-sm font-medium text-gray-500">
                                Welcome to the future of hiring
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
