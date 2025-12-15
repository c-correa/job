import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from './services/api';

// --- Componentes UI Reutilizables ---

const RoleSwitcher = ({ role, setRole }) => (
    <div className="bg-[#e5e7eb] p-1 rounded-md flex w-full h-[45px] relative mb-6">
        {/* Fondo animado (Slider) */}
        <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[6px] shadow-sm transition-all duration-300 ease-out ${role === 'company' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
        />

        <button
            type="button"
            onClick={() => setRole('coder')}
            className={`flex-1 z-10 text-[14px] font-bold text-center transition-colors duration-300 ${role === 'coder' ? 'text-[#655be9]' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            I'm a coder
        </button>
        <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 z-10 text-[14px] font-bold text-center transition-colors duration-300 ${role === 'company' ? 'text-[#655be9]' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            I'm a Company
        </button>
    </div>
);

const InputField = ({ label, type, placeholder, icon: Icon, value, onChange, isPassword = false }) => {
    const [show, setShow] = useState(false);
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className="mb-4">
            <label className="block text-[#655be9] font-bold text-[14px] mb-1.5 ml-1">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#655be9] transition-colors">
                    <Icon size={18} />
                </div>
                <input
                    type={inputType}
                    className="w-full bg-white border border-gray-200 rounded-[8px] h-[45px] pl-10 pr-10 text-[14px] text-[#191e4a] outline-none focus:border-[#655be9] focus:ring-2 focus:ring-[#655be9]/10 transition-all placeholder:text-gray-300"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#655be9] transition-colors"
                    >
                        {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Componente Principal ---

export default function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('coder');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '', // Cambiado de email a username
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await authService.login(formData.username, formData.password);

            // Toast and redirect handled by component state/logic usually, but here we just navigate
            toast.success('¡Bienvenido de nuevo!', {
                description: `Has iniciado sesión correctamente como ${data.username || formData.username}`,
                duration: 3000,
            });

            setTimeout(() => navigate('/dashboard'), 1000);

        } catch (error) {
            console.error(error);
            toast.error('Error de inicio de sesión', {
                description: 'Usuario o contraseña incorrectos. Verifica tus credenciales.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        // Fondo azulado claro como en la imagen
        <div className="min-h-screen bg-[#f2f6ff] flex items-center justify-center p-4 font-['Inter',sans-serif]">

            <div className="bg-white w-full max-w-[420px] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 md:p-10 transform transition-all hover:scale-[1.01]">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-[#191e4a] text-[36px] font-black tracking-tighter mb-1">
                        HireTech
                    </h1>
                    <p className="text-[#655be9] font-bold text-[18px]">
                        Log in
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>

                    <RoleSwitcher role={role} setRole={setRole} />

                    <InputField
                        label="Username"
                        type="text"
                        placeholder="juanperez"
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

                    <div className="flex justify-end mb-6">
                        <button type="button" className="text-[12px] text-gray-400 hover:text-[#655be9] font-medium transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#655be9] hover:bg-[#544bc2] text-white h-[48px] rounded-[8px] font-bold text-[16px] shadow-lg shadow-[#655be9]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Log in'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-[13px] text-[#191e4a] font-medium">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="text-[#655be9] font-bold hover:underline"
                            onClick={() => navigate('/register')}
                        >
                            Sign up!
                        </button>
                    </p>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 text-gray-400 text-[12px] font-medium hover:text-[#191e4a] transition-colors mx-auto group"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </button>
                </div>

            </div>
        </div>
    );
}
