import React from 'react';
import { TrendingUp } from 'lucide-react';

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

export default StatCard;
