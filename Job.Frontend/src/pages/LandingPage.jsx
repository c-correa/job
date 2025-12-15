import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Briefcase, Building2, TrendingUp, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { jobService } from '../services/api';

// --- UI Components ---

const Badge = ({ text, variant = 'primary' }) => {
    const styles = {
        primary: 'bg-[#655be9] text-white',
        secondary: 'bg-purple-100 text-purple-700',
        accent: 'bg-green-100 text-green-700'
    };

    return (
        <span className={`${styles[variant]} text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wide`}>
            {text}
        </span>
    );
};

const JobCard = ({ job }) => (
    <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(101,91,233,0.08)] hover:shadow-[0_12px_40px_rgba(101,91,233,0.15)] transition-all duration-300 border border-gray-100 flex flex-col justify-between h-full group hover:border-[#655be9]/30 hover:-translate-y-1">

        <div>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#191e4a] text-[20px] font-bold group-hover:text-[#655be9] transition-colors">
                    {job.title}
                </h3>
                <Badge text={job.jobType === 1 ? 'Full-Time' : 'Part-Time'} />
            </div>

            <div className="flex items-center gap-2 text-gray-500 mb-4">
                <Building2 size={16} className="text-[#655be9]" />
                <span className="text-[14px] font-medium">{job.companyName || 'Company'}</span>
            </div>

            {/* Skills Tags */}
            {job.requiredSkills && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.requiredSkills.split(',').slice(0, 3).map((skill, index) => (
                        <Badge key={index} text={skill.trim()} variant="secondary" />
                    ))}
                </div>
            )}
        </div>

        <div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent w-full mb-4" />
            <div className="flex justify-between items-center text-gray-500 text-[13px]">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#655be9]" />
                    <span>{job.location}</span>
                </div>
                {job.salary && (
                    <div className="flex items-center gap-2 font-bold text-[#655be9]">
                        <DollarSign size={14} />
                        <span>${job.salary.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// --- Sections ---

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-12 max-w-7xl mx-auto w-full bg-white/80 backdrop-blur-md">
            <Link to="/" className="text-[#191e4a] text-[32px] font-black tracking-tighter cursor-pointer hover:text-[#655be9] transition-colors flex items-center gap-2">
                <Sparkles className="text-[#655be9]" size={28} />
                HireTech
            </Link>
            <div className="flex gap-4 items-center">
                <Link to="/login" className="text-[#191e4a] font-bold text-[14px] hover:text-[#655be9] transition-colors px-4 py-2">
                    Sign In
                </Link>
                <Link to="/register" className="bg-[#655be9] text-white font-bold text-[14px] px-6 py-2.5 rounded-[10px] hover:bg-[#544bc2] transition-all shadow-lg shadow-[#655be9]/30 hover:shadow-[#655be9]/50">
                    Get Started
                </Link>
            </div>
        </nav>
    );
};

const HeroSection = () => (
    <div className="bg-gradient-to-br from-[#191e4a] via-[#2a2662] to-[#655be9] w-full py-24 px-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl z-10">
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white text-[12px] font-bold uppercase tracking-wider">🚀 Your Career Starts Here</span>
            </div>

            <h1 className="text-white text-[40px] md:text-[56px] font-black mb-6 leading-[1.1] tracking-tight">
                Find Your Next<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Tech Challenge
                </span>
            </h1>

            <p className="text-gray-200 text-[18px] mb-12 max-w-2xl mx-auto leading-relaxed">
                Connect with top companies, explore exciting opportunities, and take your tech career to the next level. No middlemen, just pure talent meets opportunity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
                <Link to="/register" className="bg-white text-[#191e4a] font-bold px-8 py-4 rounded-[12px] hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2">
                    Start Your Journey
                    <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-[12px] hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2">
                    Explore Jobs
                    <Search size={20} />
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/10">
                <div className="text-center">
                    <div className="text-white text-[32px] font-black mb-1">500+</div>
                    <div className="text-gray-300 text-[12px] uppercase tracking-wide">Active Jobs</div>
                </div>
                <div className="text-center">
                    <div className="text-white text-[32px] font-black mb-1">200+</div>
                    <div className="text-gray-300 text-[12px] uppercase tracking-wide">Companies</div>
                </div>
                <div className="text-center">
                    <div className="text-white text-[32px] font-black mb-1">1000+</div>
                    <div className="text-gray-300 text-[12px] uppercase tracking-wide">Developers</div>
                </div>
            </div>
        </div>
    </div>
);

const VacanciesGrid = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const data = await jobService.getAll();
                setJobs(data.slice(0, 6)); // Show first 6 jobs
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
            <div className="text-center mb-12">
                <h2 className="text-[#191e4a] text-[36px] font-black mb-3">
                    Featured Opportunities
                </h2>
                <p className="text-gray-600 text-[16px] max-w-2xl mx-auto">
                    Discover handpicked job openings from leading tech companies
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#655be9] mx-auto"></div>
                </div>
            ) : jobs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                    <div className="text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 bg-[#655be9] text-white font-bold px-8 py-3 rounded-[12px] hover:bg-[#544bc2] transition-all shadow-lg shadow-[#655be9]/30">
                            View All Jobs
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No jobs available at the moment
                </div>
            )}
        </div>
    );
};

const FeaturesSection = () => (
    <div className="bg-gradient-to-br from-gray-50 to-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-[#191e4a] text-[36px] font-black mb-3">
                    Why Choose HireTech?
                </h2>
                <p className="text-gray-600 text-[16px]">
                    The most efficient way to connect talent with opportunity
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[20px] shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="w-14 h-14 bg-purple-100 rounded-[14px] flex items-center justify-center mb-4">
                        <TrendingUp className="text-[#655be9]" size={28} />
                    </div>
                    <h3 className="text-[#191e4a] font-black text-[20px] mb-3">Fast Matching</h3>
                    <p className="text-gray-600 text-[14px] leading-relaxed">
                        Our AI-powered system connects you with the right opportunities in minutes, not weeks.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[20px] shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="w-14 h-14 bg-green-100 rounded-[14px] flex items-center justify-center mb-4">
                        <Users className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-[#191e4a] font-black text-[20px] mb-3">Top Companies</h3>
                    <p className="text-gray-600 text-[14px] leading-relaxed">
                        Work with industry leaders and innovative startups shaping the future of technology.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[20px] shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="w-14 h-14 bg-orange-100 rounded-[14px] flex items-center justify-center mb-4">
                        <Award className="text-orange-600" size={28} />
                    </div>
                    <h3 className="text-[#191e4a] font-black text-[20px] mb-3">Career Growth</h3>
                    <p className="text-gray-600 text-[14px] leading-relaxed">
                        Access opportunities that align with your skills and career aspirations for long-term growth.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Component ---

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif]">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <Navbar />
            </header>

            <main>
                <HeroSection />
                <VacanciesGrid />
                <FeaturesSection />
            </main>

            <footer className="bg-[#191e4a] text-white py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-[24px] font-black mb-2 flex items-center justify-center gap-2">
                        <Sparkles size={24} />
                        HireTech
                    </h3>
                    <p className="text-gray-400 text-[14px]">
                        Connecting talent with opportunity © 2024
                    </p>
                </div>
            </footer>
        </div>
    );
}
