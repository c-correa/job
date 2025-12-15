import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle size={18} className="text-[#55c79e]" />,
        error: <AlertCircle size={18} className="text-red-500" />,
        info: <Info size={18} className="text-blue-500" />
    };

    const borders = {
        success: "border-[#55c79e]",
        error: "border-red-500",
        info: "border-blue-500"
    };

    return (
        <div className={`fixed top-6 right-6 z-[100] bg-white border-l-4 ${borders[type]} shadow-2xl rounded-[8px] p-4 flex items-start gap-3 min-w-[300px] animate-in slide-in-from-top-5 duration-300`}>
            <div className="mt-0.5">{icons[type]}</div>
            <div className="flex-1">
                <h4 className="text-[14px] font-bold text-[#191e4a] capitalize">{type}</h4>
                <p className="text-[13px] text-gray-500 leading-snug">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-[#191e4a] transition-colors">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
