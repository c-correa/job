import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateDivisionModal = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] w-[400px] shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-[16px] font-bold text-[#191e4a]">New Division</h3>
                    <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-red-500" /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); onAdd(name); }} className="p-5">
                    <label className="block text-[13px] font-bold text-gray-500 mb-2">Division Name</label>
                    <input autoFocus required value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-[8px] h-[40px] px-3 mb-4 outline-none focus:border-[#655be9] text-[14px]" placeholder="e.g. Engineering, Marketing" />
                    <button disabled={!name} className="w-full bg-[#191e4a] text-white rounded-[8px] h-[40px] font-bold text-[14px]">Create Division</button>
                </form>
            </div>
        </div>
    );
};

export default CreateDivisionModal;
