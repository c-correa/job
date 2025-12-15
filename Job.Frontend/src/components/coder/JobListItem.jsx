import React from 'react';
import { Building2, MapPin, DollarSign } from 'lucide-react';
import Badge from '../ui/Badge';

export default function JobListItem({ job, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-5 rounded-[16px] cursor-pointer transition-all border mb-4 
            ${isSelected
                    ? 'bg-white border-[#655be9] shadow-[0_4px_20px_rgba(101,91,233,0.15)]'
                    : 'bg-white border-transparent hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-[#191e4a] text-[18px] font-bold">{job.title}</h3>
                <Badge text={job.jobType === 1 ? 'Full-Time' : job.jobType === 2 ? 'Part-Time' : 'Contract'} type="dark" />
            </div>

            <div className="flex items-center gap-2 text-gray-400 mb-3">
                <Building2 size={14} />
                <span className="text-[13px] font-medium">{job.companyName || "Unknown Company"}</span>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
                {job.requiredSkills && typeof job.requiredSkills === 'string'
                    ? job.requiredSkills.split(',').slice(0, 3).map((tag, i) => (
                        <Badge key={i} text={tag.trim()} type="purple" />
                    ))
                    : <Badge text="General" type="purple" />
                }
            </div>

            <div className="h-px bg-gray-100 w-full mb-3" />

            <div className="flex gap-4 text-gray-400 text-[12px]">
                <div className="flex items-center gap-1">
                    <MapPin size={12} /> <span>{job.location}</span>
                </div>
                {job.salary && (
                    <div className="flex items-center gap-1">
                        <DollarSign size={12} /> <span>${job.salary.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
