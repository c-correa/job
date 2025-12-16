import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Briefcase, Building2, TrendingUp, Users, Award, ArrowRight, Sparkles, Globe, Zap, ShieldCheck, BarChart3, Grip, Database } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { jobService } from '../services/api';

// --- UI Components ---

const Badge = ({ text, variant = 'primary' }) => {
    const styles = {
        primary: 'bg-[#655be9]/10 text-[#655be9] border border-[#655be9]/20',
        secondary: 'bg-purple-50 text-purple-700 border border-purple-100',
        accent: 'bg-green-50 text-green-700 border border-green-200',
        outline: 'bg-white text-gray-600 border border-gray-200'
    };

    return (
        <span className={`${styles[variant]} text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wide transition-all hover:scale-105`}>
            {text}
        </span>
    );
};

const JobCard = ({ job }) => (
    <div className="bg-white rounded-[24px] p-7 shadow-sm hover:shadow-[0_20px_40px_rgba(25,30,74,0.08)] transition-all duration-300 border border-gray-100 flex flex-col justify-between h-full group hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#655be9] to-[#55c79e] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div>
            <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-50 w-12 h-12 rounded-[14px] flex items-center justify-center text-[#191e4a] group-hover:bg-[#655be9] group-hover:text-white transition-colors duration-300">
                    <Building2 size={24} />
                </div>
                <Badge text={job.jobType === 1 ? 'Full-Time' : 'Part-Time'} variant="primary" />
            </div>
            <h3 className="text-[#191e4a] text-[20px] font-bold mb-1 group-hover:text-[#655be9] transition-colors line-clamp-1">
                {job.title}
            </h3>
            <p className="text-gray-500 text-[14px] font-medium mb-4">{job.companyName || 'Company'}</p>
            {job.requiredSkills && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {job.requiredSkills.split(',').slice(0, 3).map((skill, index) => (
                        <Badge key={index} text={skill.trim()} variant="secondary" />
                    ))}
                </div>
            )}
        </div>
        <div>
            <div className="h-px bg-gray-100 w-full mb-4" />
            <div className="flex justify-between items-center text-gray-500 text-[13px]">
                <div className="flex items-center gap-2">
                    <Globe size={14} className="text-[#655be9]" />
                    <span className="font-medium text-gray-600">{job.location}</span>
                </div>
                {job.salary && (
                    <div className="flex items-center gap-1 font-bold text-[#191e4a]">
                        <span className="text-gray-400">$</span>
                        <span>{job.salary.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// --- Sections ---

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center py-5 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <Link to="/" className="text-[#191e4a] text-[28px] font-black tracking-tighter cursor-pointer hover:text-[#655be9] transition-colors flex items-center gap-2">
                <div className="bg-[#655be9] p-1.5 rounded-lg text-white">
                    <Sparkles size={20} fill="currentColor" />
                </div>
                HireTech
            </Link>
            <div className="flex gap-6 items-center">
                <Link to="/login" className="text-gray-600 font-bold text-[14px] hover:text-[#191e4a] transition-colors hidden md:block">
                    Sign In
                </Link>
                <Link to="/register" className="bg-[#191e4a] text-white font-bold text-[14px] px-6 py-2.5 rounded-full hover:bg-[#655be9] transition-all shadow-lg shadow-[#191e4a]/10 hover:shadow-[#655be9]/25">
                    Start Hiring
                </Link>
            </div>
        </nav>
    );
};

const HeroSection = ({ jobsRef }) => {
    const scrollToJobs = () => {
        jobsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative w-full pt-10 pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] -z-10" />

            <div className="max-w-4xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:border-[#655be9]/30 transition-all cursor-default">
                    <span className="flex h-2 w-2 rounded-full bg-[#55c79e] animate-pulse"></span>
                    <span className="text-gray-600 text-[12px] font-bold uppercase tracking-wider">#1 Platform for Tech Talent</span>
                </div>

                <h1 className="text-[#191e4a] text-[48px] md:text-[72px] font-black mb-6 leading-[1.05] tracking-tight">
                    Unlock Your Potential <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#655be9] to-[#55c79e]">
                        In The Tech World
                    </span>
                </h1>

                <p className="text-gray-500 text-[18px] md:text-[20px] mb-10 max-w-2xl mx-auto leading-relaxed">
                    Connecting elite developers with forward-thinking companies. Explore robust data-driven opportunities.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <Link to="/register" className="group bg-[#655be9] text-white font-bold px-8 py-4 rounded-full hover:bg-[#544bc2] transition-all shadow-[0_10px_30px_rgba(101,91,233,0.3)] hover:shadow-[0_20px_40px_rgba(101,91,233,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3">
                        Join as Talent
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button onClick={scrollToJobs} className="text-[#191e4a] font-bold px-8 py-4 rounded-full hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2">
                        Browse Jobs
                    </button>
                </div>
            </div>

            <div className="absolute left-[10%] top-[40%] text-gray-300 hidden lg:block animate-bounce delay-100"><Briefcase size={40} /></div>
            <div className="absolute right-[10%] top-[30%] text-gray-300 hidden lg:block animate-bounce delay-700"><Zap size={40} /></div>
        </div>
    );
};

// --- METRICS SECTION ---
const MetricsSection = ({ jobs }) => {
    // Client-side Metrics Calculation
    const topSkills = React.useMemo(() => {
        const skillCounts = {};
        jobs.forEach(job => {
            if (job.requiredSkills) {
                job.requiredSkills.split(',').forEach(s => {
                    const skill = s.trim();
                    if (skill) skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                });
            }
        });
        return Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1]) // Sort desc
            .slice(0, 5); // Take top 5
    }, [jobs]);

    const topCompanies = React.useMemo(() => {
        const companyCounts = {};
        jobs.forEach(job => {
            if (job.companyName) companyCounts[job.companyName] = (companyCounts[job.companyName] || 0) + 1;
        });
        return Object.entries(companyCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
    }, [jobs]);

    return (
        <div className="py-16 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center gap-2 mb-8">
                    <BarChart3 className="text-[#655be9]" size={24} />
                    <h2 className="text-[24px] font-black text-[#191e4a]">Market Insights</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Top Skills Card */}
                    <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 p-2 rounded-lg text-[#655be9]">
                                <Database size={20} />
                            </div>
                            <h3 className="font-bold text-[#191e4a] text-[18px]">Top In-Demand Skills</h3>
                        </div>
                        <ul className="space-y-4">
                            {topSkills.map(([skill, count], index) => (
                                <li key={skill} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 font-bold text-[14px]">0{index + 1}</span>
                                        <span className="font-bold text-gray-700 group-hover:text-[#655be9] transition-colors">{skill}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#655be9]" style={{ width: `${Math.min((count / (topSkills[0][1] || 1)) * 100, 100)}%` }} />
                                        </div>
                                        <span className="text-[12px] text-gray-400 font-bold">{count} Jobs</span>
                                    </div>
                                </li>
                            ))}
                            {topSkills.length === 0 && <p className="text-gray-400 text-[14px]">Processing job data...</p>}
                        </ul>
                    </div>

                    {/* Top Companies Card */}
                    <div className="bg-gray-50 rounded-[24px] p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 p-2 rounded-lg text-green-700">
                                <Building2 size={20} />
                            </div>
                            <h3 className="font-bold text-[#191e4a] text-[18px]">Most Active Companies</h3>
                        </div>
                        <div className="space-y-4">
                            {topCompanies.map(([company, count], index) => (
                                <div key={company} className="flex items-center justify-between p-3 bg-white rounded-[16px] shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-[12px]">
                                            {company.charAt(0)}
                                        </div>
                                        <span className="font-bold text-gray-700">{company}</span>
                                    </div>
                                    <Badge text={`${count} Openings`} variant="accent" />
                                </div>
                            ))}
                            {topCompanies.length === 0 && <p className="text-gray-400 text-[14px]">Loading companies...</p>}
                        </div>
                    </div>

                    {/* Platform Stats */}
                    <div className="bg-[#191e4a] rounded-[24px] p-8 text-white relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#655be9] blur-[60px] opacity-30" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#55c79e] blur-[60px] opacity-20" />

                        <h3 className="font-bold text-[18px] mb-8 relative z-10">Platform Growth</h3>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-4 text-center">
                                <div className="text-[32px] font-black text-[#55c79e]">{jobs.length}+</div>
                                <div className="text-[12px] text-gray-300 font-bold uppercase tracking-wide">Jobs</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-4 text-center">
                                <div className="text-[32px] font-black text-[#655be9]">10k+</div>
                                <div className="text-[12px] text-gray-300 font-bold uppercase tracking-wide">Devs</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-4 text-center col-span-2">
                                <div className="text-[32px] font-black text-white">$120k</div>
                                <div className="text-[12px] text-gray-300 font-bold uppercase tracking-wide">Avg Salary</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VacanciesGrid = ({ jobsRef, jobs, loading }) => {
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [locations, setLocations] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        // Initial setup for filters
        if (jobs.length > 0) {
            const uniqueLocations = [...new Set(jobs.map(j => j.location).filter(Boolean))];
            const uniqueCompanies = [...new Set(jobs.map(j => j.companyName).filter(Boolean))];
            setLocations(uniqueLocations);
            setCompanies(uniqueCompanies);
            setFilteredJobs(jobs);
        }
    }, [jobs]);

    useEffect(() => {
        let result = jobs;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(lowerTerm) ||
                (job.requiredSkills && job.requiredSkills.toLowerCase().includes(lowerTerm))
            );
        }

        if (selectedLocation) {
            result = result.filter(job => job.location === selectedLocation);
        }

        if (selectedCompany) {
            result = result.filter(job => job.companyName === selectedCompany);
        }

        setFilteredJobs(result);
    }, [searchTerm, selectedLocation, selectedCompany, jobs]);

    return (
        <div ref={jobsRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-24 relative">
            {/* Search Bar Container - Floating */}
            <div className="relative -mt-16 mb-20 z-20">
                <div className="bg-white p-3 rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 max-w-5xl mx-auto flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-50 p-2 rounded-lg text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Job title, keywords, or skills..."
                            className="w-full pl-14 pr-4 h-[56px] bg-transparent rounded-[18px] outline-none text-[#191e4a] text-[15px] font-medium placeholder-gray-400 focus:bg-gray-50/50 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:w-px md:h-[40px] md:bg-gray-100 md:self-center" />
                    <div className="flex gap-2 items-center">
                        <div className="relative min-w-[160px]">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="w-full pl-10 pr-8 h-[56px] bg-transparent rounded-[18px] outline-none text-[#191e4a] text-[14px] font-medium appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                <option value="">Any Location</option>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>
                        {/* Clear Filters */}
                        {(searchTerm || selectedLocation || selectedCompany) && (
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedLocation(''); setSelectedCompany(''); }}
                                className="h-[56px] px-4 text-[#655be9] font-bold hover:bg-purple-50 rounded-[18px] transition-colors"
                            >
                                Reset
                            </button>
                        )}

                        <button className="hidden md:flex bg-[#191e4a] text-white h-[56px] w-[56px] rounded-[18px] items-center justify-center hover:bg-[#655be9] transition-colors shadow-lg shadow-[#191e4a]/20">
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-[#191e4a] text-[32px] font-black mb-1">
                        Latest Opportunities
                    </h2>
                    <p className="text-gray-500">Hand-picked jobs from top companies</p>
                </div>
                <Link to="/login" className="text-[#655be9] font-bold text-[14px] hover:underline flex items-center gap-1">
                    View all jobs <ArrowRight size={16} />
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#655be9] mx-auto mb-4"></div>
                    <p className="text-gray-400">Finding the best matches...</p>
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[24px] border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No jobs found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

// Features Section remains mostly same but adjusted styles slightly if needed
const FeaturesSection = () => (
    <div className="bg-[#191e4a] py-24 px-6 relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#655be9] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#55c79e] rounded-full blur-[150px] opacity-10" />

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <Badge text="Why Choose Us" variant="accent" />
                <h2 className="text-white text-[36px] md:text-[42px] font-black mt-4 mb-4">
                    Reimagining Tech Recruitment
                </h2>
                <p className="text-gray-400 text-[18px] max-w-2xl mx-auto">
                    We've stripped away the complexity to focus on what matters: skills, potential, and perfect matches.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: TrendingUp, color: 'purple', title: 'Fast Matching', desc: 'AI-driven algorithms pair you with jobs that fit your exact skillset.' },
                    { icon: ShieldCheck, color: 'green', title: 'Verified Companies', desc: 'Every company is vetted to ensure a safe and professional environment.' },
                    { icon: Award, color: 'orange', title: 'Career Growth', desc: 'Positions that challenge you and offer clear paths for advancement.' }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm p-8 rounded-[24px] border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
                        <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-[14px] flex items-center justify-center mb-6`}>
                            <feature.icon className={`text-${feature.color}-400`} size={28} />
                        </div>
                        <h3 className="text-white font-bold text-[20px] mb-3">{feature.title}</h3>
                        <p className="text-gray-400 text-[15px] leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


export default function LandingPage() {
    const jobsRef = React.useRef(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                // FETCH ALL JOBS Once for the whole page
                const data = await jobService.getAll({ isActive: true });
                setJobs(data);
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
    }, []);

    return (
        <div className="min-h-screen bg-white font-['Inter',sans-serif]">
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
                <Navbar />
            </header>

            <main>
                <HeroSection jobsRef={jobsRef} />
                <MetricsSection jobs={jobs} />
                {/* Reordered: Metrics first to show off data? Or Vacancies? Usually data is midway. I'll put Metrics below Hero? 
                 Actually Vacancies needs search bar which floats on Hero. Metrics usually break visual flow.
                 I'll put Metrics *after* Vacancies? Or *between* as "Market Insights". 
                 Let's put Metrics *after* Hero and *before* Vacancies (Wait, Search bar cuts into metrics?). 
                 Design: Hero -> Search Bar (Overlapping) -> Vacancies. 
                 Metrics should be further down or a side column? 
                 I'll place Metrics Section *Below* VacanciesGrid to summarize the market, OR inside Hero? 
                 I'll put it BELOW Vacancies as "Live Market Data". */ }
                <VacanciesGrid jobsRef={jobsRef} jobs={jobs} loading={loading} />
                {/* Wait, if I put Metrics below, it's missed. I will put it BETWEEN Hero and Vacancies? No, Search bar. 
                I'll put it AFTER VacanciesGrid. */}
                <FeaturesSection />
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-[#191e4a] font-black text-[24px]">
                        <div className="bg-[#191e4a] p-1.5 rounded-lg text-white">
                            <Sparkles size={18} fill="currentColor" />
                        </div>
                        HireTech
                    </div>
                    <p className="text-gray-500 text-[14px] font-medium">
                        © 2024 HireTech Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-[#655be9] transition-colors">Twitter</a>
                        <a href="#" className="text-gray-400 hover:text-[#655be9] transition-colors">LinkedIn</a>
                        <a href="#" className="text-gray-400 hover:text-[#655be9] transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
