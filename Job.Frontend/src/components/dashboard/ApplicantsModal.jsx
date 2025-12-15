import React, { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { applicationService } from '../../services/api';
// Note: Relative path assumes src/components/dashboard/ApplicantsModal.jsx so ../../services/api.js

const ApplicantsModal = ({ job, onClose }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadApplicants = async () => {
            if (!job) return;
            try {
                // Get applications for this job
                const apps = await applicationService.getByJobId(job.id);
                // In a real app we'd fetch candidate profiles here if name is missing
                // Assuming apps includes some candidate info or we display basic info
                setApplicants(apps);
            } catch (error) {
                console.error("Error loading applicants", error);
            } finally {
                setLoading(false);
            }
        };
        loadApplicants();
    }, [job]);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] w-[700px] max-w-full h-[600px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#191e4a] text-white">
                    <div>
                        <h3 className="text-[18px] font-bold">Applicants for {job?.title}</h3>
                        <p className="text-[12px] opacity-70">Reviewing {applicants.length} candidates</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa]">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-gray-400">Loading candidates...</div>
                    ) : applicants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p>No applicants yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applicants.map((app) => (
                                <div key={app.id} className="bg-white p-4 rounded-[12px] border border-gray-100 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h4 className="font-bold text-[#191e4a]">Candidate #{app.candidateProfileId}</h4>
                                        <p className="text-[12px] text-gray-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        <div className="mt-2 text-[13px] bg-blue-50 text-blue-800 inline-block px-2 py-0.5 rounded font-medium">Status: {app.status}</div>
                                    </div>
                                    <button className="text-[#55c79e] font-bold text-[13px] hover:underline">View Profile</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicantsModal;
