import React, { useState } from 'react';
import { MoreHorizontal, Users, X, TrendingUp, Clock } from 'lucide-react';
import Badge from '../ui/Badge';
import { getDivisionFromJob } from '../../utils/jobUtils';

const VacancyCard = ({ job, stats, onToggleStatus, onDelete, onViewApplicants }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-white rounded-[12px] border border-gray-200 p-5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#55c79e]/50 transition-all cursor-pointer group relative overflow-visible">
            <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${job.isActive ? 'bg-[#55c79e]' : 'bg-gray-300'}`} />

            <div className="flex justify-between items-start mb-4 pl-2">
                <div>
                    <h3 onClick={() => onViewApplicants && onViewApplicants(job)} className="text-[#191e4a] text-[18px] font-bold group-hover:text-[#55c79e] transition-colors hover:underline">
                        {job.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-wider">
                            {getDivisionFromJob(job)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <p className="text-gray-400 text-[12px] font-medium">{job.jobType === 1 ? 'FullTime' : 'Contract'} • {job.location}</p>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="text-gray-300 hover:text-[#191e4a] p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreHorizontal size={18} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 text-[13px] font-medium animate-in fade-in zoom-in duration-100 origin-top-right">
                                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onViewApplicants && onViewApplicants(job); }} className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#191e4a] flex items-center gap-2">
                                    <Users size={14} /> View Applicants
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onToggleStatus && onToggleStatus(job.id, job.isActive); }} className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#191e4a] flex items-center gap-2">
                                    {job.isActive ? <X size={14} /> : <TrendingUp size={14} />}
                                    {job.isActive ? 'Close Vacancy' : 'Re-activate'}
                                </button>
                                <div className="h-px bg-gray-100 my-1" />
                                <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete && onDelete(job.id); }} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center gap-2">
                                    <X size={14} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div onClick={() => onViewApplicants && onViewApplicants(job)} className="flex gap-4 mb-5 pl-2">
                <div className="bg-gray-50 px-3 py-2 rounded-lg flex-1 text-center group-hover:bg-[#55c79e]/10 transition-colors">
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
};

export default VacancyCard;
