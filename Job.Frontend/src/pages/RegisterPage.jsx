import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Code, Clock, Eye, EyeOff, ArrowLeft, Building2, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';
import { toast } from 'sonner';

const RoleSwitcher = ({ role, setRole }) => (
    <div className="bg-gray-100 p-1.5 rounded-[14px] flex w-full h-[52px] relative mb-8">
        <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[10px] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${role === 'company' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                }`}
        />
        <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex-1 z-10 text-[14px] font-bold text-center transition-colors duration-300 flex items-center justify-center gap-2 ${role === 'candidate' ? 'text-[#191e4a]' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            <User size={16} /> Candidate
        </button>
        <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 z-10 text-[14px] font-bold text-center transition-colors duration-300 flex items-center justify-center gap-2 ${role === 'company' ? 'text-[#191e4a]' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            <Building2 size={16} /> Company
        </button>
    </div>
);

const InputField = ({ label, type, placeholder, icon: Icon, value, onChange, isPassword = false, className = "", required = true }) => {
    const [show, setShow] = useState(false);
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className={`mb-5 ${className}`}>
            <label className="block text-[#191e4a] font-bold text-[14px] mb-2 ml-1">
                {label} <span className="text-[#655be9]">*</span>
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
                    required={required}
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

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('candidate');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        experience: '', skills: '', companyName: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const baseUsername = `${formData.firstName}${formData.lastName}`.toLowerCase().replace(/\s+/g, '');
            let finalUsername = baseUsername;

            try {
                const check = await userService.checkUsername(baseUsername);
                if (!check.available) {
                    finalUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
                }
            } catch (e) {
                console.warn("Username check failed", e);
            }

            const authData = await authService.register({
                username: finalUsername,
                password: formData.password,
                email: formData.email
            });

            const token = authData.token || authData.Token;
            const numericId = authData.userId || authData.UserId;

            // Store temporarily for immediate profile creation use
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(authData));

            let profileUrl = role === 'candidate' ? 'http://localhost:5000/api/candidates' : 'http://localhost:5000/api/companies';
            let profileBody = role === 'candidate' ? {
                userId: numericId,
                email: formData.email,
                yearsOfExperience: parseInt(formData.experience) || 0,
                summary: `Candidate with skills: ${formData.skills}`,
            } : {
                userId: numericId,
                email: formData.email,
                companyName: formData.companyName,
                description: 'Company registered via web'
            };

            const profileResponse = await fetch(profileUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(profileBody),
            });

            if (!profileResponse.ok) throw new Error(`Error creating ${role} profile`);

            toast.success('Account Created!', { description: `Welcome ${formData.firstName}!` });
            setTimeout(() => navigate('/login'), 1500);

        } catch (err) {
            console.error(err);
            toast.error('Registration Failed', { description: err.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex font-['Inter',sans-serif]">
            {/* Left Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#191e4a] relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#655be9] rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#55c79e] rounded-full blur-[100px] opacity-10 -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 text-white max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-6 backdrop-blur-md">
                        <Briefcase size={14} className="text-[#55c79e]" />
                        <span className="text-[12px] font-bold uppercase tracking-wider">Start Your Journey</span>
                    </div>
                    <h1 className="text-[48px] font-black leading-tight mb-6">
                        Join the World's Best Tech Platform.
                    </h1>
                    <div className="space-y-6">
                        <div className="flex gap-4 p-4 bg-white/5 rounded-[20px] border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-[#655be9] rounded-full flex items-center justify-center shrink-0">1</div>
                            <div>
                                <h3 className="font-bold text-[18px]">Create Profile</h3>
                                <p className="text-gray-400 text-[14px]">Showcase your best work and skills.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 bg-white/5 rounded-[20px] border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-[#55c79e] rounded-full flex items-center justify-center shrink-0 text-[#191e4a] font-bold">2</div>
                            <div>
                                <h3 className="font-bold text-[18px]">Get Matched</h3>
                                <p className="text-gray-400 text-[14px]">Our AI finds the perfect roles for you.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 bg-white relative overflow-y-auto">
                <div className="w-full max-w-[480px] py-10">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2 text-gray-500 hover:text-[#191e4a] font-bold text-[14px] transition-colors"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <div className="mb-8 mt-8 lg:mt-0">
                        <h2 className="text-[#191e4a] text-[32px] font-black tracking-tight mb-2">Create Account</h2>
                        <p className="text-gray-500 text-[16px]">Join HireTech today. It's free and takes 1 minute.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <RoleSwitcher role={role} setRole={setRole} />

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <InputField label="First Name" type="text" placeholder="John" icon={User} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div className="flex-1">
                                <InputField label="Last Name" type="text" placeholder="Doe" icon={User} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                        </div>

                        <InputField label="Email Address" type="email" placeholder="john@example.com" icon={Mail} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <InputField label="Password" type="password" placeholder="Min. 8 characters" icon={Lock} isPassword={true} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                        {role === 'candidate' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="h-px bg-gray-100 my-6" />
                                <div className="flex gap-4">
                                    <div className="w-[120px] shrink-0">
                                        <InputField label="Exp. (Years)" type="number" placeholder="2" icon={Clock} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} required={false} />
                                    </div>
                                    <div className="flex-1">
                                        <InputField label="Top Skills" type="text" placeholder="React, Node, SQL..." icon={Code} value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} required={false} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'company' && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="h-px bg-gray-100 my-6" />
                                <InputField label="Company Name" type="text" placeholder="Tech Solutions Inc." icon={Building2} value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full mt-4 bg-[#191e4a] hover:bg-[#655be9] text-white h-[52px] rounded-[16px] font-bold text-[16px] shadow-xl shadow-[#191e4a]/10 hover:shadow-[#655be9]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[14px] text-gray-500 font-medium">
                        Already have an account?{' '}
                        <button type="button" className="text-[#655be9] font-bold hover:underline" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
