import React, { useState, useEffect } from 'react';
import { Building2, Send, Eye, CheckCircle, XCircle, Loader2, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService, applicationService, candidateService, jobService } from '../services/api';
import Badge from '../components/ui/Badge';

// --- Application Card Component ---
const ApplicationCard = ({ application }) => (
    <div className="bg-white rounded-[12px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_4px_16px_rgba(101,91,233,0.15)] hover:border-[#655be9]/30 transition-all cursor-pointer group">

        <div className="flex justify-between items-start mb-3">
            <h3 className="text-[#191e4a] text-[18px] font-bold group-hover:text-[#655be9] transition-colors">
                {application.jobTitle || "Job Position"}
            </h3>
            <Badge text={application.jobType === 1 ? 'Full-Time' : 'Part-Time'} type="dark" />
        </div>

        <div className="flex items-center gap-2 text-gray-500 mb-6">
            <Building2 size={14} />
            <span className="text-[13px] font-medium">{application.companyName || "Company"}</span>
        </div>

        <div className="h-px bg-gray-100 w-full mb-3" />

        <div className="flex items-center gap-1.5 text-[#655be9] text-[11px] font-bold">
            <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
        </div>
    </div>
);

// --- Kanban Column Component ---
const StatusColumn = ({ title, icon: Icon, apps = [], color = "#191e4a" }) => {
    return (
        <div className="flex flex-col min-h-[400px] w-full">
            {/* Column Header */}
            <div className="border-b-2 pb-3 mb-6 flex items-center gap-2" style={{ borderColor: color }}>
                {Icon && <Icon size={18} style={{ color }} />}
                <h3 className="text-[18px] font-bold" style={{ color }}>{title}</h3>
                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto">
                    {apps.length}
                </span>
            </div>

            {/* Card List */}
            <div className="flex flex-col gap-4">
                {apps.length > 0 ? (
                    apps.map((app) => <ApplicationCard key={app.id} application={app} />)
                ) : (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-[12px] flex items-center justify-center text-gray-300 text-sm font-medium">
                        No applications
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Component ---
export default function ApplicationTracking() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState({
        pending: [],
        underReview: [],
        interview: [],
        rejected: [],
        accepted: []
    });

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            setLoading(true);

            // Get current user
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            let userId = storedUser.userId || storedUser.UserId;

            // Fallback to API
            if (!userId) {
                const userData = await authService.getMe();
                userId = parseInt(userData.userId) || parseInt(userData.UserId);
            }

            // Ensure numeric
            userId = parseInt(userId);
            console.log("ApplicationTracking - Using userId:", userId, "Type:", typeof userId);

            // Get candidate profile
            const candidateProfile = await candidateService.getMyCandidate(userId);

            if (!candidateProfile) {
                console.error("No candidate profile found");
                return;
            }

            // Get all applications and jobs in parallel
            const [allApps, allJobs] = await Promise.all([
                applicationService.getAll(),
                jobService.getAll()
            ]);

            // Filter my applications
            const myApps = allApps.filter(app => app.candidateProfileId === candidateProfile.id);

            // Create a job lookup map for quick access
            const jobMap = new Map(allJobs.map(job => [job.id, job]));

            // Enrich applications with job details
            const enrichedApps = myApps.map(app => {
                const job = jobMap.get(app.jobId);
                return {
                    ...app,
                    jobTitle: job?.title || 'Job Position',
                    companyName: job?.companyName || 'Company',
                    jobType: job?.jobType || 1,
                    location: job?.location || 'Unknown'
                };
            });

            // Group by status (ApplicationStatus enum: 1=Pending, 2=UnderReview, 3=Shortlisted, 4=Interview, 5=Accepted, 6=Rejected)
            const grouped = {
                pending: enrichedApps.filter(app => app.status === 1),
                underReview: enrichedApps.filter(app => app.status === 2 || app.status === 3),
                interview: enrichedApps.filter(app => app.status === 4),
                accepted: enrichedApps.filter(app => app.status === 5),
                rejected: enrichedApps.filter(app => app.status === 6)
            };

            setApplications(grouped);
        } catch (error) {
            console.error("Failed to load applications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] gap-3">
                <Loader2 className="animate-spin text-[#655be9]" size={42} />
                <p className="text-[#191e4a] font-bold text-[14px] animate-pulse">Loading Applications...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-['Inter',sans-serif]">

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-[#191e4a] text-[28px] font-black tracking-tighter">HireTech</h1>
                    <Badge text="CODER" type="green" />
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-[#191e4a] font-bold text-[14px]">
                    <button
                        onClick={() => navigate('/dashboard-coder')}
                        className="hover:text-[#655be9] transition-colors opacity-60 hover:opacity-100"
                    >
                        Search For Applications
                    </button>
                    <button className="text-[#655be9] relative">
                        My Applications
                        <span className="absolute -bottom-[21px] left-0 w-full h-[3px] bg-[#655be9] rounded-t-full"></span>
                    </button>
                    <button onClick={handleLogout} className="hover:text-[#655be9] transition-colors opacity-60 hover:opacity-100">
                        Log Out
                    </button>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-10">

                {/* Section Header */}
                <div className="mb-10">
                    <h2 className="text-[#191e4a] text-[32px] font-bold mb-2">Application Tracking</h2>
                    <p className="text-gray-500 text-[16px]">Monitor the status of your ongoing job applications in real-time.</p>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <StatusColumn
                        title="Sent"
                        icon={Send}
                        apps={applications.pending}
                        color="#6b7280"
                    />

                    <StatusColumn
                        title="Under Review"
                        icon={Eye}
                        apps={applications.underReview}
                        color="#655be9"
                    />

                    <StatusColumn
                        title="Interview"
                        icon={CheckCircle}
                        apps={applications.interview}
                        color="#f59e0b"
                    />

                    <StatusColumn
                        title="Accepted"
                        icon={UserCheck}
                        apps={applications.accepted}
                        color="#10b981"
                    />

                </div>

                {/* Rejected section below (optional, or you can add it to the grid) */}
                {applications.rejected.length > 0 && (
                    <div className="mt-8">
                        <StatusColumn
                            title="Rejected"
                            icon={XCircle}
                            apps={applications.rejected}
                            color="#ef4444"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
