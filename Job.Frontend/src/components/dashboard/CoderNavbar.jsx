import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '../ui/Badge';
import { authService } from '../../services/api';

const CoderNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard-coder')}>
                <h1 className="text-[#191e4a] text-[28px] font-black tracking-tighter">HireTech</h1>
                <Badge text="CODER" type="green" />
            </div>
            <div className="hidden md:flex items-center gap-8 text-[#191e4a] font-bold text-[14px]">
                <button
                    onClick={() => navigate('/dashboard-coder')}
                    className={`hover:text-[#655be9] transition-colors relative group ${isActive('/dashboard-coder') ? 'text-[#655be9]' : ''}`}
                >
                    Search Jobs
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#655be9] transition-all ${isActive('/dashboard-coder') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
                <button
                    onClick={() => navigate('/my-applications')}
                    className={`hover:text-[#655be9] transition-colors relative group ${isActive('/my-applications') ? 'text-[#655be9]' : ''}`}
                >
                    My Applications
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#655be9] transition-all ${isActive('/my-applications') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
                <button
                    onClick={() => navigate('/profile-settings')}
                    className={`hover:text-[#655be9] transition-colors relative group ${isActive('/profile-settings') ? 'text-[#655be9]' : ''}`}
                >
                    Profile Settings
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#655be9] transition-all ${isActive('/profile-settings') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </button>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                    Log Out
                </button>
            </div>
        </nav>
    );
};

export default CoderNavbar;
