import React from 'react';
import { Search, MapPin, DollarSign, Briefcase, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Componentes UI Reutilizables ---

const Badge = ({ text }) => (
    <span className="bg-[#655be9] text-white text-[10px] px-3 py-1 rounded-full font-medium">
        {text}
    </span>
);

const JobCard = ({ title, company, type, tags, modality, wage }) => (
    <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-shadow border border-gray-100 flex flex-col justify-between h-full">

        {/* Header Card */}
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-[#191e4a] text-[20px] font-bold">{title}</h3>
                <span className="bg-[#191e4a] text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wide font-bold">
                    {type}
                </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Building2 size={16} />
                <span className="text-[14px] font-medium">{company}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag, index) => (
                    <Badge key={index} text={tag} />
                ))}
            </div>
        </div>

        {/* Footer Card */}
        <div>
            <div className="h-px bg-gray-200 w-full mb-4" />
            <div className="flex gap-6 text-gray-400 text-[13px]">
                <div className="flex items-center gap-1.5">
                    <div className="border border-gray-300 rounded-full p-0.5">
                        <MapPin size={10} />
                    </div>
                    <span>{modality}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="border border-gray-300 rounded-full p-0.5">
                        <DollarSign size={10} />
                    </div>
                    <span>{wage}</span>
                </div>
            </div>
        </div>
    </div>
);

// --- Secciones Principales ---

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-12 max-w-7xl mx-auto w-full bg-white">
            <div className="text-[#191e4a] text-[28px] font-black tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                HireTech
            </div>
            <div className="flex gap-6 items-center">
                <button className="text-[#191e4a] font-semibold text-[14px] hover:text-[#655be9] transition-colors" onClick={() => navigate('/login')}>
                    Sign In
                </button>
                <button className="text-[#191e4a] font-semibold text-[14px] hover:text-[#655be9] transition-colors" onClick={() => navigate('/register')}>
                    Sign Up
                </button>
            </div>
        </nav>
    );
};

const HeroSection = () => (
    <div className="bg-[#191e4a] w-full py-20 px-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Contenido Hero */}
        <div className="max-w-3xl z-10">
            <h1 className="text-white text-[32px] md:text-[48px] font-bold mb-4 leading-tight">
                Find your next technological challenge
            </h1>

            <div className="text-gray-300 mb-8 space-y-2">
                <p className="italic text-[16px] opacity-90">“Your window to a new opportunity”</p>
                <p className="text-[14px] opacity-80 max-w-xl mx-auto">
                    We connect tech talent with the best business divisions. No middlemen.
                </p>
            </div>

            {/* Barra de Búsqueda Estilizada */}
            <div className="flex flex-col md:flex-row gap-2 w-full max-w-2xl mx-auto mt-8">
                <div className="bg-white rounded-[8px] flex-1 h-[50px] flex items-center px-4">
                    <span className="text-[#655be9] font-bold text-sm mr-2">Location</span>
                </div>
                <div className="bg-white rounded-[8px] flex-[1.5] h-[50px] flex items-center justify-between pl-4 pr-1">
                    <span className="text-[#655be9] font-bold text-sm opacity-80">development area</span>
                    <button className="bg-[#655be9] text-white h-[42px] px-8 rounded-[6px] font-bold text-sm hover:bg-[#534ac2] transition-colors">
                        search
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const VacanciesGrid = () => {
    // Datos simulados basados en la imagen
    const jobs = Array(4).fill({
        title: "Offer",
        company: "Company",
        type: "Full-time",
        tags: ["Technology", "Technology", "Technology"],
        modality: "Modality",
        wage: "Wage"
    });

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
            <h2 className="text-[#191e4a] text-[20px] font-bold mb-8">
                Featured Vacancies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job, idx) => (
                    <JobCard key={idx} {...job} />
                ))}
            </div>
        </div>
    );
};

// --- Componente Principal Encapsulado ---

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif]">
            <header className="border-b border-gray-100">
                <Navbar />
            </header>

            <main>
                <HeroSection />
                <VacanciesGrid />
            </main>

            {/* Footer simple para cerrar el layout visualmente */}
            <footer className="h-20 bg-white" />
        </div>
    );
}
