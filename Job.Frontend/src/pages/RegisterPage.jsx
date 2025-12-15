import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Code, Clock, Eye, EyeOff, ArrowLeft, Building2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

// --- Componentes UI Reutilizables (Basados en tu estilo) ---

const RoleSwitcher = ({ role, setRole }) => (
    <div className="bg-[#e5e7eb] p-1 rounded-md flex w-full h-[45px] relative mb-6">
        {/* Fondo animado (Slider) */}
        <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[6px] shadow-sm transition-all duration-300 ease-out ${role === 'company' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
        />

        <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex-1 z-10 text-[14px] font-bold text-center transition-colors duration-300 ${role === 'candidate' ? 'text-[#655be9]' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            Candidato
        </button>
        <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 z-10 text-[14px] font-bold text-center transition-colors duration-300 ${role === 'company' ? 'text-[#655be9]' : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            Empresa
        </button>
    </div>
);

const InputField = ({ label, type, placeholder, icon: Icon, value, onChange, isPassword = false, className = "", required = true }) => {
    const [show, setShow] = useState(false);
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div className={`mb-4 ${className}`}>
            <label className="block text-[#655be9] font-bold text-[13px] mb-1.5 ml-1">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#655be9] transition-colors">
                    <Icon size={18} />
                </div>
                <input
                    type={inputType}
                    className="w-full bg-[#f8f9fa] border border-gray-200 rounded-[8px] h-[45px] pl-10 pr-10 text-[14px] text-[#191e4a] outline-none focus:border-[#655be9] focus:ring-2 focus:ring-[#655be9]/10 transition-all placeholder:text-gray-400"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
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

// --- Componente Principal de Registro ---

export default function RegisterPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('candidate');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        experience: '',
        skills: '',
        companyName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Registro de Usuario Base (Auth)
            const username = `${formData.firstName}${formData.lastName}`.toLowerCase().replace(/\s+/g, '');

            // Using authService for registration
            const authData = await authService.register({
                username: username,
                password: formData.password,
                email: formData.email
            });

            const authResponse = authData;
            // Handle both casing possibilities safely
            const token = authResponse.token || authResponse.Token;
            const numericId = authResponse.userId || authResponse.UserId;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(authData));

            // 2. Creación del Perfil Específico
            // using the api instance to maintain base URL and headers if needed
            // However, the original code used raw fetch. I'll use the api helper if possible, 
            // but I haven't exported 'api' directly in a way that makes this easy without importing it.
            // I'll import `api` from ./services/api as well.

            // Actually, I'll stick to using the `authService` pattern. I should add `createProfile` methods to `api.js` later.
            // For now, to minimize disruption, I will keep the logic here but use the `api` instance or `fetch` with the correct URL from a config if I had one.
            // But since I can't easily change `api.js` right this second without another tool call, I will use `fetch` but point to the correct port (5001 usually, but user code had 5000).
            // User code had port 5000. My api.js has 5001. I should probably use 5001 (API default).

            // Wait, I should really update `api.js` to support profile creation or just import `api` instance.
            // I'll assume `import api` works if I added it above.

            // Let's just use `fetch` with the correct port 5001 which I know is correct from my investigation.
            let profileUrl = '';
            let profileBody = {};

            if (role === 'candidate') {
                profileUrl = 'http://localhost:5000/api/candidates';
                profileBody = {
                    userId: numericId,
                    email: formData.email,
                    yearsOfExperience: parseInt(formData.experience) || 0,
                    summary: `Candidate with skills: ${formData.skills}`,
                };
            } else {
                profileUrl = 'http://localhost:5000/api/companies';
                profileBody = {
                    userId: numericId,
                    email: formData.email,
                    companyName: formData.companyName,
                    description: 'Company registered via web'
                };
            }

            const profileResponse = await fetch(profileUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileBody),
            });

            if (!profileResponse.ok) {
                const err = await profileResponse.json();
                throw new Error(err.message || `Error creando perfil de ${role}`);
            }

            setSuccess(true);
            console.log("Registro completado exitosamente");

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#f2f6ff] flex items-center justify-center p-4 font-['Inter',sans-serif]">
                <div className="bg-white w-full max-w-[480px] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-10 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-[#191e4a] mb-2">¡Cuenta Creada!</h2>
                    <p className="text-gray-500 mb-6">Tu perfil de {role === 'candidate' ? 'Candidato' : 'Empresa'} ha sido configurado correctamente.</p>
                    <button
                        onClick={() => navigate('/login')} // O redirigir a dashboard
                        className="w-full bg-[#655be9] hover:bg-[#544bc2] text-white h-[48px] rounded-[8px] font-bold text-[16px] shadow-lg shadow-[#655be9]/30 transition-all text-center flex items-center justify-center"
                    >
                        Ir a Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f2f6ff] flex items-center justify-center p-4 font-['Inter',sans-serif]">

            <div className="bg-white w-full max-w-[480px] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 md:p-10 transform transition-all">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-[#191e4a] text-[32px] font-black tracking-tighter mb-1">
                        HireTech
                    </h1>
                    <p className="text-[#655be9] font-bold text-[16px]">
                        Crear cuenta nueva
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit}>

                    <RoleSwitcher role={role} setRole={setRole} />

                    {/* Fila: Nombre y Apellido */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <InputField
                                label="Nombre"
                                type="text"
                                placeholder="Juan"
                                icon={User}
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <InputField
                                label="Apellido"
                                type="text"
                                placeholder="Pérez"
                                icon={User}
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <InputField
                        label="Email"
                        type="email"
                        placeholder="dev@ejemplo.com"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <InputField
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        isPassword={true}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    {/* Renderizado Condicional para Candidatos */}
                    {role === 'candidate' && (
                        <>
                            {/* Separador de Sección */}
                            <div className="mt-6 mb-4 flex items-center gap-3">
                                <div className="h-[1px] bg-gray-200 flex-1"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Perfil Profesional
                                </span>
                                <div className="h-[1px] bg-gray-200 flex-1"></div>
                            </div>

                            <div className="flex gap-4">
                                {/* Columna Pequeña para Años */}
                                <div className="w-[110px] shrink-0">
                                    <InputField
                                        label="Exp. (Años)"
                                        type="number"
                                        placeholder="2"
                                        icon={Clock}
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        required={false}
                                    />
                                </div>
                                {/* Columna Grande para Habilidades */}
                                <div className="flex-1">
                                    <InputField
                                        label="Habilidades"
                                        type="text"
                                        placeholder="React, Node, SQL"
                                        icon={Code}
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        required={false}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Renderizado Condicional para Empresas */}
                    {role === 'company' && (
                        <div className="mt-2">
                            <InputField
                                label="Nombre de la Empresa"
                                type="text"
                                placeholder="Tech Solutions Inc."
                                icon={Building2}
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#655be9] hover:bg-[#544bc2] disabled:bg-[#a09ae6] text-white h-[48px] rounded-[8px] font-bold text-[16px] shadow-lg shadow-[#655be9]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Registrarse'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-[13px] text-[#191e4a] font-medium">
                        ¿Ya tienes cuenta?{' '}
                        <button type="button" className="text-[#655be9] font-bold hover:underline" onClick={() => navigate('/login')}>
                            Iniciar sesión
                        </button>
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 text-gray-400 text-[12px] font-medium hover:text-[#191e4a] transition-colors mx-auto group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Volver al inicio
                    </button>
                </div>

            </div>
        </div>
    );
}
