import React from 'react';

const FilterTag = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`text-[11px] px-4 py-1.5 rounded-[4px] font-medium transition-colors border
      ${isActive
                ? 'bg-[#655be9] text-white border-[#655be9]'
                : 'bg-[#d9d9d9] hover:bg-[#c0c0c0] text-gray-600 border-transparent'
            }`}
    >
        {label}
    </button>
);

export default FilterTag;
