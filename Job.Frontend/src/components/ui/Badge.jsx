import React from 'react';

const Badge = ({ text, type = "neutral" }) => {
    const styles = {
        company: "bg-[#f2bdae] text-[#191e4a]",
        active: "bg-[#55c79e]/10 text-[#55c79e] border border-[#55c79e]/20",
        closed: "bg-gray-100 text-gray-500",
        new: "bg-blue-50 text-blue-600 border border-blue-100",
        // Coder Dashboard Styles
        purple: "bg-[#655be9] text-white",
        dark: "bg-[#191e4a] text-white",
        green: "bg-[#bdf2d5] text-[#191e4a]"
    };

    return (
        <span className={`${styles[type] || styles.neutral} text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide`}>
            {text}
        </span>
    );
};

export default Badge;
