import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { authService, companyService, candidateService } from '../services/api';

const InputField = ({ label, type, placeholder, icon: Icon, value, onChange, isPassword = false }) => {
    const [show, setShow] = useState(false);
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className="mb-5">
            <label className="block text-[#191e4a] font-bold text-[14px] mb-2 ml-1">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#655be9] transition-colors">
                    <Icon size={20} />
                </div>
                <input
                    type={inputType}
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#655be9] rounded-[16px] h-[52px] pl-12 pr-12 text-[15px] text-[#191e4a] outline-none focus:ring-4 focus:ring-[#655be9]/10 transition-all placeholder:text-gray-400 font-medium"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#655be9] transition-colors"
                    >
                        {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Hardcoded Admin Access
            if (formData.username === 'admin@hiretech.com' && formData.password === '123456789') {
                toast.success('Admin access granted', { duration: 2000 });
                localStorage.setItem('user', JSON.stringify({ username: 'Admin', email: 'admin@hiretech.com', role: 'admin' }));
                setTimeout(() => navigate('/admin'), 1000);
                return;
            }

            const data = await authService.login(formData.username.trim(), formData.password);

            const userId = parseInt(data.userId || data.UserId);
            const userToStore = { ...data, userId: userId };
            localStorage.setItem('user', JSON.stringify(userToStore));

            const [candidateProfile, companyProfile] = await Promise.all([
                candidateService.getMyCandidate(userId).catch(() => null),
                companyService.getMyCompany(userId).catch(() => null)
            ]);

            let targetDashboard = '/dashboard';
            if (candidateProfile) targetDashboard = '/dashboard-coder';
            else if (companyProfile) targetDashboard = '/dashboard';

            toast.success('Welcome back!', {
                description: `Signed in as ${data.username}`,
                duration: 3000,
            });

            setTimeout(() => navigate(targetDashboard), 1000);

        } catch (error) {
            console.error(error);
            toast.error('Login Failed', {
                description: 'Incorrect username or password.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-['Inter',sans-serif]">

            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#191e4a] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#655be9] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#55c79e] rounded-full blur-[100px] opacity-10 -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 text-white max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-6 backdrop-blur-md">
                        <Sparkles size={14} className="text-[#55c79e]" />
                        <span className="text-[12px] font-bold uppercase tracking-wider">Join 10,000+ Developers</span>
                    </div>
                    <h1 className="text-[48px] font-black leading-tight mb-6">
                        Welcome to the Future of Tech Hiring.
                    </h1>
                    <ul className="space-y-4 text-gray-300 font-medium text-[16px]">
                        {['Access exclusive job opportunities', 'Connect directly with hiring managers', 'Showcase your skills with verified assessments'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <CheckCircle2 size={20} className="text-[#55c79e]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 bg-white relative">
                <div className="w-full max-w-[440px]">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2 text-gray-500 hover:text-[#191e4a] font-bold text-[14px] transition-colors"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-[#191e4a] text-[32px] font-black tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-gray-500 text-[16px]">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <InputField
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            icon={User}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            isPassword={true}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <div className="flex justify-end pt-2 pb-6">
                            <button type="button" className="text-[13px] text-[#655be9] font-bold hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#191e4a] hover:bg-[#655be9] text-white h-[52px] rounded-[16px] font-bold text-[16px] shadow-xl shadow-[#191e4a]/10 hover:shadow-[#655be9]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[14px] text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="text-[#655be9] font-bold hover:underline"
                            onClick={() => navigate('/register')}
                        >
                            Create free account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
