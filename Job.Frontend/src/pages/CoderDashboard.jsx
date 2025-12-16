import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Filter, X, SlidersHorizontal, Briefcase, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Services
import { authService, jobService, companyService } from '../services/api';

// Components
import Badge from '../components/ui/Badge';
import JobListItem from '../components/coder/JobListItem';
import JobDetailView from '../components/coder/JobDetailView';
import ChatBot from '../components/ChatBot';

export default function CoderDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);

    // Search & Filter State
    const [locationQuery, setLocationQuery] = useState('');
    const [skillQuery, setSkillQuery] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState(null); // 1=Full-Time, 2=Part-Time
    const [showFilters, setShowFilters] = useState(false);
    const [salaryMin, setSalaryMin] = useState('');

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            setLoading(true);

            // Fetch jobs and companies in parallel
            const [jobsData, companiesData] = await Promise.all([
                jobService.getAll(),
                companyService.getAll().catch(() => [])
            ]);

            // Create a company lookup map
            const companyMap = new Map(companiesData.map(c => [c.id, c.companyName]));

            // Enrich jobs with company names
            const enrichedJobs = jobsData.map(job => ({
                ...job,
                companyName: job.companyName || companyMap.get(job.companyProfileId) || 'Company'
            }));

            setJobs(enrichedJobs);
            setFilteredJobs(enrichedJobs);
            if (enrichedJobs.length > 0) setSelectedJobId(enrichedJobs[0].id);
        } catch (error) {
            console.error("Failed to load jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        let result = jobs;

        // Location filter
        if (locationQuery) {
            result = result.filter(j =>
                j.location?.toLowerCase().includes(locationQuery.toLowerCase())
            );
        }

        // Skills/Title filter
        if (skillQuery) {
            result = result.filter(j =>
                j.title?.toLowerCase().includes(skillQuery.toLowerCase()) ||
                j.requiredSkills?.toLowerCase().includes(skillQuery.toLowerCase())
            );
        }

        // Job Type filter
        if (jobTypeFilter) {
            result = result.filter(j => j.jobType === jobTypeFilter);
        }

        // Salary filter
        if (salaryMin) {
            result = result.filter(j => j.salary >= parseInt(salaryMin));
        }

        setFilteredJobs(result);

        // Reset selection
        if (result.length > 0 && (!selectedJobId || !result.find(j => j.id === selectedJobId))) {
            setSelectedJobId(result[0].id);
        } else if (result.length === 0) {
            setSelectedJobId(null);
        }
    };

    const clearFilters = () => {
        setLocationQuery('');
        setSkillQuery('');
        setJobTypeFilter(null);
        setSalaryMin('');
        setFilteredJobs(jobs);
        if (jobs.length > 0) setSelectedJobId(jobs[0].id);
    };

    useEffect(() => {
        if (jobs.length > 0) handleSearch();
    }, [jobTypeFilter]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const selectedJob = filteredJobs.find(j => j.id === selectedJobId);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fafafa] to-[#f0f0f0] gap-3">
                <Loader2 className="animate-spin text-[#655be9]" size={42} />
                <p className="text-[#191e4a] font-bold text-[14px] animate-pulse">Discovering Opportunities...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-white font-['Inter',sans-serif]">

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-[#191e4a] text-[28px] font-black tracking-tighter">HireTech</h1>
                    <Badge text="CODER" type="green" />
                </div>
                <div className="hidden md:flex items-center gap-8 text-[#191e4a] font-bold text-[14px]">
                    <button className="hover:text-[#655be9] transition-colors relative group">
                        Search Jobs
                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#655be9] group-hover:w-full transition-all"></span>
                    </button>
                    <button onClick={() => navigate('/my-applications')} className="hover:text-[#655be9] transition-colors relative group">
                        My Applications
                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#655be9] group-hover:w-full transition-all"></span>
                    </button>
                    <button onClick={() => navigate('/profile-settings')} className="hover:text-[#655be9] transition-colors relative group">
                        Profile Settings
                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#655be9] group-hover:w-full transition-all"></span>
                    </button>
                    <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                        Log Out
                    </button>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-8">

                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-[#191e4a] text-[32px] font-black mb-2">Explore Opportunities</h2>
                    <p className="text-gray-600 text-[16px]">
                        Found <span className="font-bold text-[#655be9]">{filteredJobs.length}</span> jobs matching your criteria
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Main Search Bar */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 bg-white border-2 border-gray-200 rounded-[12px] h-[56px] flex items-center px-4 shadow-sm focus-within:border-[#655be9] focus-within:shadow-lg focus-within:shadow-[#655be9]/10 transition-all group">
                            <MapPin size={20} className="text-gray-400 group-focus-within:text-[#655be9] transition-colors mr-3" />
                            <input
                                className="w-full outline-none text-gray-700 text-[15px] placeholder:text-gray-400 font-medium"
                                placeholder="Location (e.g. Remote, New York)"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex-[2] bg-white border-2 border-gray-200 rounded-[12px] h-[56px] flex items-center px-4 shadow-sm focus-within:border-[#655be9] focus-within:shadow-lg focus-within:shadow-[#655be9]/10 transition-all group">
                            <Search size={20} className="text-gray-400 group-focus-within:text-[#655be9] transition-colors mr-3" />
                            <input
                                className="w-full outline-none text-gray-700 text-[15px] placeholder:text-gray-400 font-medium"
                                placeholder="Skills or job title (e.g. React, Backend Developer)"
                                value={skillQuery}
                                onChange={(e) => setSkillQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-[#655be9] text-white h-[40px] px-6 rounded-[8px] font-bold text-[14px] hover:bg-[#544bc2] transition-all ml-3 shadow-lg shadow-[#655be9]/30 flex items-center gap-2"
                            >
                                <Search size={16} />
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-[10px] font-bold text-[14px] text-gray-700 hover:border-[#655be9] hover:text-[#655be9] transition-all"
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                            {(jobTypeFilter || salaryMin) && (
                                <span className="w-2 h-2 bg-[#655be9] rounded-full"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setJobTypeFilter(jobTypeFilter === 1 ? null : 1)}
                            className={`px-4 py-2 rounded-[10px] font-bold text-[14px] transition-all ${jobTypeFilter === 1
                                ? 'bg-[#655be9] text-white shadow-lg shadow-[#655be9]/30'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#655be9]'
                                }`}
                        >
                            <Briefcase size={14} className="inline mr-2" />
                            Full-Time
                        </button>

                        <button
                            onClick={() => setJobTypeFilter(jobTypeFilter === 2 ? null : 2)}
                            className={`px-4 py-2 rounded-[10px] font-bold text-[14px] transition-all ${jobTypeFilter === 2
                                ? 'bg-[#655be9] text-white shadow-lg shadow-[#655be9]/30'
                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#655be9]'
                                }`}
                        >
                            <Briefcase size={14} className="inline mr-2" />
                            Part-Time
                        </button>

                        {(locationQuery || skillQuery || jobTypeFilter || salaryMin) && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-[10px] font-bold text-[14px] hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <div className="bg-white p-6 rounded-[12px] border-2 border-gray-200 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
                            <h3 className="font-bold text-[#191e4a] mb-4 flex items-center gap-2">
                                <Filter size={18} />
                                Advanced Filters
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[14px] font-bold text-gray-700 mb-2">
                                        <DollarSign size={14} className="inline mr-1" />
                                        Minimum Salary
                                    </label>
                                    <input
                                        type="number"
                                        value={salaryMin}
                                        onChange={(e) => setSalaryMin(e.target.value)}
                                        placeholder="e.g. 50000"
                                        className="w-full border-2 border-gray-200 rounded-[8px] px-4 py-2 outline-none focus:border-[#655be9] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleSearch}
                                    className="bg-[#655be9] text-white px-6 py-2 rounded-[8px] font-bold hover:bg-[#544bc2] transition-colors"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-[8px] font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Left: Job List */}
                    <div className="w-full lg:w-1/3 flex flex-col space-y-3">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <JobListItem
                                    key={job.id}
                                    job={job}
                                    isSelected={selectedJobId === job.id}
                                    onClick={() => setSelectedJobId(job.id)}
                                />
                            ))
                        ) : (
                            <div className="text-center text-gray-400 mt-10 p-8 bg-white rounded-[12px] border-2 border-dashed border-gray-200">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold mb-2">No jobs found</p>
                                <p className="text-sm">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Job Details */}
                    <div className="w-full lg:w-2/3 sticky top-24">
                        <JobDetailView job={selectedJob} />
                    </div>

                </div>
            </main>

            <ChatBot />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #655be9;
                }
            `}</style>
        </div >
    );
}
