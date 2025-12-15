import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", confirmType = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[16px] w-[400px] max-w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#191e4a] mb-2">{title}</h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{message}</p>
                </div>
                <div className="bg-gray-50 p-4 flex gap-3 justify-center border-t border-gray-100">
                    <button onClick={onCancel} className="px-5 py-2 text-[14px] font-bold text-gray-500 hover:text-[#191e4a] bg-white border border-gray-200 rounded-[8px] hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={`px-5 py-2 text-[14px] font-bold text-white rounded-[8px] shadow-lg transition-all ${confirmType === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#55c79e] hover:bg-[#46b08a] shadow-[#55c79e]/20'}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
