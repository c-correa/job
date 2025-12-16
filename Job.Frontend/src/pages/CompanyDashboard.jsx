import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Plus,
    Search,
    Settings,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Services & Utils
import { authService, companyService, jobService, applicationService } from '../services/api';
import { getDivisionFromJob } from '../utils/jobUtils';

// Components
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatCard from '../components/dashboard/StatCard';
import VacancyCard from '../components/dashboard/VacancyCard';
import CreateJobModal from '../components/dashboard/CreateJobModal';
import CreateDivisionModal from '../components/dashboard/CreateDivisionModal';
import ApplicantsModal from '../components/dashboard/ApplicantsModal';
import CompanySettings from '../components/dashboard/CompanySettings';
import CandidateSearch from '../components/dashboard/CandidateSearch';

export default function CompanyDashboard() {
    const navigate = useNavigate();

    // Data State
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

    // Edit State
    const [jobToEdit, setJobToEdit] = useState(null);

    // UI State
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'settings'
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateJob, setShowCreateJob] = useState(false);
    const [showCreateDivision, setShowCreateDivision] = useState(false);
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [divisions, setDivisions] = useState(['General', 'Engineering', 'Design', 'Marketing', 'Sales']);

    // Alert Systems
    const [toasts, setToasts] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Data Loading
    const loadDashboard = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Get authenticated user data
            let userData = await authService.getMe();

            // CRITICAL FIX: JWT claims return userId as string, need to parse to integer
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            let numericId = storedUser.userId || storedUser.UserId;

            // Parse from getMe if not in localStorage
            if (!numericId && userData.userId) {
                numericId = parseInt(userData.userId);
            }

            // Ensure it's always a number
            numericId = parseInt(numericId);
            userData = { ...userData, userId: numericId };

            console.log("CompanyDashboard - Using userId:", numericId, "Type:", typeof numericId);
            setUser(userData);

            const myCompany = await companyService.getMyCompany(numericId);
            setCompany(myCompany);

            if (myCompany) {
                console.log("Company found:", myCompany);
                // 1. Fetch Company Jobs
                const companyJobs = await jobService.getAll(myCompany.id);
                console.log("Company jobs fetched:", companyJobs);

                // 2. Fetch All Applications (Backend doesn't support optimized per-job fetch)
                // We fetch once to avoid overloading the server with parallel requests
                let allApplications = [];
                try {
                    allApplications = await applicationService.getAll();
                    console.log("All applications fetched:", allApplications);
                } catch (e) {
                    console.error("Failed to fetch applications", e);
                    showToast("Could not load application data", "error");
                }

                const myJobIds = new Set(companyJobs.map(j => j.id));
                // Filter locally
                const myApplications = allApplications.filter(a => myJobIds.has(a.jobId));
                console.log("My applications (filtered):", myApplications);

                // 3. Stats
                setStats({
                    totalVacancies: companyJobs.length,
                    activeCandidates: new Set(myApplications.map(a => a.candidateProfileId)).size,
                    interviews: myApplications.filter(a => a.status === 4).length,
                    hired: myApplications.filter(a => a.status === 5).length
                });

                // 4. Discover divisions
                const discoveredDivisions = new Set(divisions);
                companyJobs.forEach(job => {
                    const div = getDivisionFromJob(job);
                    if (div) discoveredDivisions.add(div);
                });
                setDivisions(Array.from(discoveredDivisions));

                // 5. Enrich jobs
                const jobsWithStats = companyJobs.map(job => ({
                    ...job,
                    division: getDivisionFromJob(job),
                    stats: {
                        applicants: myApplications.filter(a => a.jobId === job.id).length,
                        interviews: myApplications.filter(a => a.jobId === job.id && a.status === 4).length
                    }
                }));

                // Sort by date desc
                jobsWithStats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                console.log("Jobs with stats:", jobsWithStats);

                setJobs(jobsWithStats);
            } else {
                console.warn("No company profile found for user");
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
            if (error.response?.status === 401) {
                showToast("Session expired, please login again", "error");
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [navigate]);

    // Actions
    const handleCreateJob = async (jobData) => {
        if (!company) {
            showToast("Company profile missing. Please register correctly.", "error");
            return;
        }

        const companyId = company.id || company.Id;
        if (!companyId) {
            showToast("Company ID missing.", "error");
            return;
        }

        setLoading(true);
        try {
            // Tag description with division
            let descriptionWithDivision = `[Division: ${jobData.division}]\n\n${jobData.description}`;

            // Ensure strict length limit (2000 chars)
            if (descriptionWithDivision.length > 2000) {
                descriptionWithDivision = descriptionWithDivision.substring(0, 2000);
            }

            const payload = {
                title: jobData.title,
                description: descriptionWithDivision,
                companyProfileId: companyId,
                location: jobData.location,
                jobType: parseInt(jobData.jobType) || 1,
                experienceLevel: 1,
                salary: jobData.salary ? parseFloat(jobData.salary) : null,
                requiredSkills: jobData.requiredSkills
            };

            if (jobToEdit) {
                payload.id = jobToEdit.id; // Ensure ID is part of payload although normally URL param
                await jobService.update(jobToEdit.id, payload);
                showToast("Job vacancy updated successfully!", "success");
            } else {
                await jobService.create(payload);
                showToast("Job vacancy created successfully!", "success");
            }

            setShowCreateJob(false);
            setJobToEdit(null); // Reset
            await loadDashboard();
        } catch (error) {
            console.error("Error saving job", error);
            let msg = "Failed to save job";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') msg = error.response.data;
                else if (error.response.data.title) msg = error.response.data.title;
                else if (error.response.data.message) msg = error.response.data.message;
            }
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleEditJob = (job) => {
        setJobToEdit(job);
        setShowCreateJob(true);
    };

    const handleToggleJobStatus = async (jobId, currentStatus) => {
        try {
            await jobService.updateStatus(jobId, !currentStatus);
            showToast(`Vacancy ${!currentStatus ? 'activated' : 'closed'} successfully`, "success");
            await loadDashboard();
        } catch (error) {
            console.error("Error updating status", error);
            showToast("Failed to update status", "error");
        }
    };

    const handleDeleteJob = (jobId) => {
        setConfirmDialog({
            isOpen: true,
            title: "Delete Vacancy",
            message: "Are you sure you want to delete this vacancy? This action cannot be undone and all associated applications may be affected.",
            onConfirm: async () => {
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                try {
                    await jobService.delete(jobId);
                    setJobs(prev => prev.filter(j => j.id !== jobId));
                    showToast("Vacancy deleted permanently", "success");
                } catch (error) {
                    console.error("Error deleting job", error);
                    showToast("Failed to delete vacancy", "error");
                }
            }
        });
    };

    const handleViewApplicants = (job) => {
        setSelectedJob(job);
        setShowApplicantsModal(true);
    };

    const handleAddDivision = (name) => {
        if (!divisions.includes(name)) {
            setDivisions([...divisions, name]);
            showToast(`Division "${name}" added`, "success");
        }
        setShowCreateDivision(false);
        setActiveTab(name);
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    // Filtering
    const filteredJobs = jobs.filter(job => {
        const matchesTab = activeTab === 'all' || job.division === activeTab;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.division.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    if (loading && !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] gap-3">
                <Loader2 className="animate-spin text-[#655be9]" size={42} />
                <p className="text-[#191e4a] font-bold text-[14px] animate-pulse">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex font-['Inter',sans-serif]">
            {/* TOASTS CONTAINER */}
            <div className="fixed top-0 right-0 z-[100] px-4 py-4 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast {...toast} onClose={() => removeToast(toast.id)} />
                    </div>
                ))}
            </div>

            {/* CONFIRM DIALOG */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            />

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
                        onClick={() => { setCurrentView('dashboard'); setActiveTab('all'); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[14px] font-bold mb-6 transition-all shadow-sm
              ${currentView === 'dashboard' && activeTab === 'all'
                                ? 'bg-[#55c79e] text-white shadow-[0_4px_14px_rgba(85,199,158,0.4)]'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard size={18} />
                        All Vacancies
                    </button>

                    <button
                        onClick={() => setCurrentView('search')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[14px] font-bold mb-6 transition-all shadow-sm
              ${currentView === 'search'
                                ? 'bg-[#55c79e] text-white shadow-[0_4px_14px_rgba(85,199,158,0.4)]'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Search size={18} />
                        Find Talent
                    </button>

                    <div className="mb-4">
                        <div className="flex justify-between items-center px-4 mb-3">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Divisions</span>
                            <button onClick={() => setShowCreateDivision(true)} className="text-[#655be9] text-[10px] font-bold hover:underline bg-[#655be9]/10 px-2 py-0.5 rounded-full">+ NEW</button>
                        </div>
                        <div className="space-y-1">
                            {divisions.map((div, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentView('dashboard'); setActiveTab(div); }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-[8px] text-[13px] font-semibold transition-colors
                                    ${currentView === 'dashboard' && activeTab === div ? 'bg-gray-100 text-[#191e4a]' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span>{div}</span>
                                    {currentView === 'dashboard' && activeTab === div && <div className="w-1.5 h-1.5 rounded-full bg-[#191e4a]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <div className="px-4 py-2 text-xs text-gray-400">
                        Logged in as <br /> <strong className="text-gray-600">{user?.username}</strong>
                    </div>
                    <button
                        onClick={() => setCurrentView('settings')}
                        className={`flex items-center gap-3 px-4 py-2 w-full text-[13px] font-bold transition-colors ${currentView === 'settings' ? 'text-[#655be9]' : 'text-gray-500 hover:text-[#191e4a]'}`}
                    >
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
                            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search vacancy..." className="text-[13px] outline-none w-full placeholder:text-gray-400" />
                        </div>
                        <button onClick={handleLogout} className="text-[#191e4a] font-bold text-[14px] hover:text-[#55c79e] transition-colors">Log Out</button>
                    </div>
                </header>

                {currentView === 'settings' ? (
                    <CompanySettings company={company} user={user} stats={stats} jobs={jobs} />
                ) : currentView === 'search' ? (
                    <CandidateSearch />
                ) : (
                    <>
                        <div className="flex justify-between items-end mb-8 animate-in fade-in duration-500">
                            <div>
                                <h2 className="text-[#191e4a] text-[28px] font-bold">General Overview</h2>
                                <p className="text-gray-500 text-[14px] mt-1">
                                    {activeTab === 'all' ? "Showing all vacancies" : `Filtering by Division: ${activeTab}`}
                                </p>
                            </div>
                            <button onClick={() => { setShowCreateJob(true); setJobToEdit(null); }} className="bg-[#191e4a] hover:bg-[#2c3470] text-white px-6 py-3 rounded-[10px] font-bold text-[14px] shadow-lg shadow-[#191e4a]/20 flex items-center gap-2 transition-all">
                                <Plus size={18} /> Create New Vacancy
                            </button>
                        </div>

                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-in slide-in-from-bottom-2 duration-500">
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
                            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <VacancyCard
                                    key={job.id}
                                    job={job}
                                    stats={job.stats}
                                    onViewApplicants={handleViewApplicants}
                                    onDelete={handleDeleteJob}
                                    onToggleStatus={handleToggleJobStatus}
                                    onEdit={handleEditJob}
                                />
                            )) : (
                                <div className="col-span-full hidden" />
                            )}

                            {/* Add Button Card */}
                            <div onClick={() => { setShowCreateJob(true); setJobToEdit(null); }} className="border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col items-center justify-center text-gray-400 min-h-[200px] hover:border-[#55c79e] hover:text-[#55c79e] hover:bg-[#55c79e]/5 cursor-pointer transition-all">
                                <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <span className="font-bold text-[14px]">Post New Job</span>
                            </div>

                            {filteredJobs.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-400">
                                    <p>No active vacancies found for {activeTab}.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Modals */}
            {showCreateJob && <CreateJobModal onClose={() => setShowCreateJob(false)} onSubmit={handleCreateJob} loading={loading} divisions={divisions} initialDivision={activeTab} />}
            {showCreateDivision && <CreateDivisionModal onClose={() => setShowCreateDivision(false)} onAdd={handleAddDivision} />}
            {showApplicantsModal && selectedJob && <ApplicantsModal job={selectedJob} onClose={() => setShowApplicantsModal(false)} />}
        </div>
    );
}
