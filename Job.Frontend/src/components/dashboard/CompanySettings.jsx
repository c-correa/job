import React from 'react';
import { Building2, Mail, Hash, TrendingUp, Users, Award, MapPin } from 'lucide-react';

export default function CompanySettings({ company, user, stats, jobs }) {
    // Derived Metrics
    const totalApplicants = jobs.reduce((acc, job) => acc + (job.stats?.applicants || 0), 0);
    const avgApplicantsPerJob = jobs.length ? (totalApplicants / jobs.length).toFixed(1) : 0;

    // Calculate Division breakdown
    const divisionStats = jobs.reduce((acc, job) => {
        const div = job.division || 'General';
        acc[div] = (acc[div] || 0) + 1;
        return acc;
    }, {});
    const topDivision = Object.entries(divisionStats).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    // Funnel Calculations
    const interviewRate = totalApplicants ? ((stats.interviews / totalApplicants) * 100).toFixed(1) : 0;
    const hireRate = stats.interviews ? ((stats.hired / stats.interviews) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h2 className="text-[#191e4a] text-[28px] font-bold">Company Settings</h2>
                <p className="text-gray-500 text-[14px] mt-1">Manage your profile and view performance availability.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#191e4a] to-[#2c3470]" />
                        <div className="relative mt-8 mb-4">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center p-2 mx-auto lg:mx-0">
                                <Building2 size={32} className="text-[#655be9]" />
                            </div>
                        </div>

                        <h3 className="text-[20px] font-bold text-[#191e4a] mb-1">{company?.companyName || "Your Company"}</h3>
                        <p className="text-gray-400 text-[13px] mb-6">Recruitment Account</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[13px] text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                    <Hash size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Company ID</p>
                                    <p className="font-mono">{company?.id}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[13px] text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                    <Mail size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Contact Email</p>
                                    <p>{user?.email || user?.username || "Not set"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[13px] text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                    <MapPin size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Jobs Location</p>
                                    <p>Varied ({jobs.length} locations)</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2.5 rounded-[8px] bg-gray-50 text-[#191e4a] text-[13px] font-bold hover:bg-gray-100 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Right Column: Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#0ea5e9]">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Avg. Applicants</p>
                                <p className="text-[24px] font-black text-[#191e4a]">{avgApplicantsPerJob} <span className="text-[14px] font-medium text-gray-400">/ job</span></p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-[16px] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#9333ea]">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Top Division</p>
                                <p className="text-[24px] font-black text-[#191e4a]">{topDivision[0]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Funnel Chart */}
                    <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
                        <h4 className="text-[16px] font-bold text-[#191e4a] mb-6">Recruitment Funnel</h4>

                        <div className="space-y-6 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10" />

                            {/* Stage 1 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#191e4a] text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                                    <Users size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[14px] font-bold text-[#191e4a]">Total Applicants</span>
                                        <span className="text-[14px] font-bold text-[#191e4a]">{totalApplicants}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#191e4a] w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Stage 2 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#655be9] text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                                    <Users size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[14px] font-bold text-[#191e4a]">Invited to Interview</span>
                                        <span className="text-[14px] font-bold text-[#655be9]">{stats.interviews} <span className="text-[12px] text-gray-400 font-normal">({interviewRate}%)</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#655be9]" style={{ width: `${interviewRate}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Stage 3 */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#55c79e] text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                                    <Award size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-[14px] font-bold text-[#191e4a]">Hired Candidates</span>
                                        <span className="text-[14px] font-bold text-[#55c79e]">{stats.hired} <span className="text-[12px] text-gray-400 font-normal">({hireRate}% of interviews)</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#55c79e]" style={{ width: `${Math.min(hireRate, 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
