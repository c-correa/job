import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateJobModal = ({ onClose, onSubmit, loading, divisions, initialDivision }) => {
    const [formData, setFormData] = useState({
        title: '',
        division: (initialDivision && initialDivision !== 'all') ? initialDivision : (divisions[0] || 'General'),
        description: '',
        location: '',
        salary: '',
        jobType: 1, // FullTime default
        requiredSkills: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] w-[600px] max-w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#191e4a] text-white">
                    <h3 className="text-[18px] font-bold">Create New Vacancy</h3>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Division</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[40px] px-3 text-[14px] outline-none focus:border-[#55c79e]"
                            value={formData.division}
                            onChange={e => setFormData({ ...formData, division: e.target.value })}
                        >
                            {divisions.map(div => (
                                <option key={div} value={div}>{div}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Job Title</label>
                        <input required className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[40px] px-3 text-[14px] outline-none focus:border-[#55c79e]" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Senior React Developer" />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Description</label>
                        <textarea required maxLength={1900} className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[100px] p-3 text-[14px] outline-none focus:border-[#55c79e]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the role..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Location</label>
                            <input required className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[40px] px-3 text-[14px] outline-none focus:border-[#55c79e]" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Remote, New York" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Salary (Optional)</label>
                            <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[40px] px-3 text-[14px] outline-none focus:border-[#55c79e]" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} placeholder="50000" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Job Type</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[40px] px-3 text-[14px] outline-none focus:border-[#55c79e]" value={formData.jobType} onChange={e => setFormData({ ...formData, jobType: parseInt(e.target.value) })}>
                                <option value={1}>Full Time</option>
                                <option value={2}>Part Time</option>
                                <option value={3}>Contract</option>
                                <option value={6}>Freelance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#191e4a] mb-1">Required Skills</label>
                            <input className="w-full bg-gray-50 border border-gray-200 rounded-[8px] h-[40px] px-3 text-[14px] outline-none focus:border-[#55c79e]" value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} placeholder="React, Node.js (comma separated)" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-[14px] font-bold text-gray-400 hover:text-gray-600">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-[#55c79e] hover:bg-[#46b08a] text-white rounded-[8px] text-[14px] font-bold shadow-lg shadow-[#55c79e]/20 transition-all">
                            {loading ? 'Creating...' : 'Post Vacancy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;
