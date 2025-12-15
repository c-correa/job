import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Plus,
    Search,
    Settings,
    MoreHorizontal,
    TrendingUp,
    Clock
} from 'lucide-react';
import { authService, companyService, jobService, applicationService } from './services/api';
import { useNavigate } from 'react-router-dom';

// --- UI Components ---

const Badge = ({ text, type = "neutral" }) => {
    const styles = {
        company: "bg-[#f2bdae] text-[#191e4a]",
        active: "bg-[#55c79e]/10 text-[#55c79e] border border-[#55c79e]/20",
        closed: "bg-gray-100 text-gray-500",
        new: "bg-blue-50 text-blue-600 border border-blue-100"
    };

    return (
        <span className={`${styles[type] || styles.neutral} text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide`}>
            {text}
        </span>
    );
};

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[110px]">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-[12px] font-semibold uppercase tracking-wider">{title}</p>
                <h3 className="text-[#191e4a] text-[28px] font-black leading-tight mt-1">{value}</h3>
            </div>
            <div className="bg-[#f0f9f6] p-2 rounded-lg text-[#55c79e]">
                <Icon size={20} />
            </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium">
            <span className="text-[#55c79e] flex items-center">
                <TrendingUp size={10} className="mr-1" /> {trend}
            </span>
            <span className="text-gray-400">{subtext}</span>
        </div>
    </div>
);

const VacancyCard = ({ job, stats }) => (
    <div className="bg-white rounded-[12px] border border-gray-200 p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#55c79e]/50 transition-all cursor-pointer group relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#55c79e]" />

        <div className="flex justify-between items-start mb-4 pl-2">
            <div>
                <h3 className="text-[#191e4a] text-[18px] font-bold group-hover:text-[#55c79e] transition-colors">
                    {job.title}
                </h3>
                <p className="text-gray-400 text-[12px] font-medium mt-0.5">{job.jobType === 1 ? 'FullTime' : 'Contract'} • {job.location}</p>
            </div>
            <button className="text-gray-300 hover:text-[#191e4a]">
                <MoreHorizontal size={18} />
            </button>
        </div>

        <div className="flex gap-4 mb-5 pl-2">
            <div className="bg-gray-50 px-3 py-2 rounded-lg flex-1 text-center">
                <span className="block text-[#191e4a] text-[16px] font-bold">{stats?.applicants || 0}</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Applicants</span>
            </div>
            <div className="bg-gray-50 px-3 py-2 rounded-lg flex-1 text-center">
                <span className="block text-[#191e4a] text-[16px] font-bold">{stats?.interviews || 0}</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Interviews</span>
            </div>
        </div>

        <div className="flex justify-between items-center pl-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <Clock size={12} />
                <span>Updated {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <Badge text={job.isActive ? "Active" : "Closed"} type={job.isActive ? "active" : "closed"} />
        </div>
    </div>
);

export default function CompanyDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        totalVacancies: 0,
        activeCandidates: 0,
        interviews: 0,
        hired: 0
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const userData = await authService.getMe();
                setUser(userData);

                // Fetch company data
                const myCompany = await companyService.getMyCompany(userData.userId);
                setCompany(myCompany);

                // Fetch jobs for this company
                // If no company profile yet, user might be new - navigate to create profile or something?
                // For now, if no company, we might show empty or prompt
                let companyJobs = [];
                if (myCompany) {
                    companyJobs = await jobService.getAll(myCompany.id);
                } else {
                    // Fallback for user without company profile yet - maybe show all or none
                    // For safety in this "Admin Panel" context, let's assume they want to see *their* stuff.
                    // If they are admin, maybe they see everything?
                    // Let's stick to "My Company" logic.
                }

                setJobs(companyJobs);

                // Calculate Stats
                const allApplications = await applicationService.getAll();

                // Filter apps for my company jobs
                const myJobIds = new Set(companyJobs.map(j => j.id));
                const myApplications = allApplications.filter(a => myJobIds.has(a.jobId));

                setStats({
                    totalVacancies: companyJobs.length,
                    activeCandidates: new Set(myApplications.map(a => a.candidateProfileId)).size,
                    interviews: myApplications.filter(a => a.status === 4).length,
                    hired: myApplications.filter(a => a.status === 5).length
                });

                // Enrich jobs with stats
                const jobsWithStats = await Promise.all(companyJobs.map(async (job) => {
                    // We can just filter myApplications since we fetched all
                    const jobApps = myApplications.filter(a => a.jobId === job.id);
                    return {
                        ...job,
                        stats: {
                            applicants: jobApps.length,
                            interviews: jobApps.filter(a => a.status === 4).length
                        }
                    };
                }));
                setJobs(jobsWithStats);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-[#191e4a] font-bold">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-['Inter',sans-serif]">

            {/* SIDEBAR */}
            <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-[#191e4a] text-[20px] font-black tracking-tight leading-none mb-1">
                        {company ? company.companyName : "My Company"}
                    </h2>
                    <span className="text-[#655be9] text-[12px] font-semibold">recruitment panel</span>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[14px] font-bold mb-6 transition-all shadow-sm
              ${activeTab === 'all'
                                ? 'bg-[#55c79e] text-white shadow-[0_4px_14px_rgba(85,199,158,0.4)]'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={18} />
                        All Vacancies
                    </button>
                    {/* ... Other sidebar items ... */}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <div className="px-4 py-2 text-xs text-gray-400">
                        Logged in as <br /> <strong className="text-gray-600">{user?.username}</strong>
                    </div>
                    <button className="flex items-center gap-3 text-gray-500 hover:text-[#191e4a] px-4 py-2 w-full text-[13px] font-bold transition-colors">
                        <Settings size={18} /> Settings
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-[260px] p-8 md:p-12 max-w-[1600px]">
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-[#191e4a] text-[32px] font-black tracking-tighter">HireTech</h1>
                        <Badge text="COMPANY" type="company" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 w-[240px]">
                            <Search size={16} className="text-gray-400" />
                            <input placeholder="Search vacancy..." className="text-[13px] outline-none w-full placeholder:text-gray-400" />
                        </div>
                        <button onClick={handleLogout} className="text-[#191e4a] font-bold text-[14px] hover:text-[#55c79e] transition-colors">Log Out</button>
                    </div>
                </header>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-[#191e4a] text-[28px] font-bold">General Overview</h2>
                        <p className="text-gray-500 text-[14px] mt-1">Welcome back! Here's what's happening with your recruitment.</p>
                    </div>
                    <button className="bg-[#191e4a] hover:bg-[#2c3470] text-white px-6 py-3 rounded-[10px] font-bold text-[14px] shadow-lg shadow-[#191e4a]/20 flex items-center gap-2 transition-all">
                        <Plus size={18} /> Create New Vacancy
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Vacancies" value={stats.totalVacancies} subtext="active jobs" trend="" icon={Briefcase} />
                    <StatCard title="Active Candidates" value={stats.activeCandidates} subtext="applicants" trend="" icon={Users} />
                    <StatCard title="Interviews" value={stats.interviews} subtext="scheduled" trend="" icon={Users} />
                    <StatCard title="Hired" value={stats.hired} subtext="candidates" trend="" icon={Briefcase} />
                </div>

                {/* Active Vacancies */}
                <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-[#191e4a] text-[18px] font-bold">Active Vacancies</h3>
                    <button className="text-[#55c79e] text-[13px] font-bold hover:underline">View all vacancies</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {jobs.length > 0 ? jobs.map((job) => (
                        <VacancyCard key={job.id} job={job} stats={job.stats} />
                    )) : (
                        <div className="col-span-full text-center py-10 text-gray-400 bg-white rounded-[12px] border border-gray-100">
                            <p>No active vacancies found.</p>
                        </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col items-center justify-center text-gray-400 min-h-[200px] hover:border-[#55c79e] hover:text-[#55c79e] hover:bg-[#55c79e]/5 cursor-pointer transition-all">
                        <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold text-[14px]">Post New Job</span>
                    </div>
                </div>

            </main>
        </div>
    );
}
