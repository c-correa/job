import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle, XCircle, Eye, UserCheck, Send } from 'lucide-react';
import { applicationService, candidateService } from '../../services/api';
import CandidateProfileModal from './CandidateProfileModal';

// Status Enum mapping (from backend ApplicationStatus)
const STATUS_CONFIG = {
    1: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Send },
    2: { label: 'Under Review', color: 'bg-blue-100 text-blue-700', icon: Eye },
    3: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
    4: { label: 'Interview', color: 'bg-yellow-100 text-yellow-700', icon: UserCheck },
    5: { label: 'Accepted', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    6: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const ApplicantsModal = ({ job, onClose }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        loadApplicants();
    }, [job]);

    const loadApplicants = async () => {
        if (!job) return;
        try {
            const apps = await applicationService.getByJobId(job.id);
            setApplicants(apps);
        } catch (error) {
            console.error("Error loading applicants", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewProfile = async (candidateProfileId) => {
        try {
            setLoadingProfile(true);
            const candidateData = await candidateService.getById(candidateProfileId);
            setSelectedCandidate(candidateData);
        } catch (error) {
            console.error("Error loading candidate profile", error);
            alert("Failed to load candidate profile");
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdating(applicationId);
            await applicationService.updateStatus(applicationId, newStatus);
            // Reload applicants to reflect changes
            await loadApplicants();
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[16px] w-[800px] max-w-full h-[700px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#191e4a] text-white">
                    <div>
                        <h3 className="text-[18px] font-bold">Applicants for {job?.title}</h3>
                        <p className="text-[12px] opacity-70">Managing {applicants.length} applications</p>
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
                            {applicants.map((app) => {
                                const statusInfo = STATUS_CONFIG[app.status] || STATUS_CONFIG[1];
                                const StatusIcon = statusInfo.icon;
                                const isUpdating = updating === app.id;

                                return (
                                    <div key={app.id} className="bg-white p-5 rounded-[12px] border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-[#191e4a] text-[16px]">Candidate #{app.candidateProfileId}</h4>
                                                <p className="text-[12px] text-gray-500 mt-1">Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</p>
                                                {app.coverLetter && (
                                                    <p className="text-[13px] text-gray-600 mt-2 italic">"{app.coverLetter}"</p>
                                                )}
                                                {app.resumeUrl && (
                                                    <a
                                                        href={`http://localhost:5000${app.resumeUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 mt-2 text-[12px] font-bold text-[#655be9] hover:underline"
                                                    >
                                                        <Eye size={12} /> View CV/Resume
                                                    </a>
                                                )}
                                            </div>

                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${statusInfo.color}`}>
                                                <StatusIcon size={14} />
                                                {statusInfo.label}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 flex-wrap pt-3 border-t border-gray-100">
                                            {app.status === 1 && (
                                                <button
                                                    onClick={() => handleStatusChange(app.id, 2)}
                                                    disabled={isUpdating}
                                                    className="px-3 py-1.5 text-[12px] font-bold bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 disabled:opacity-50 transition-colors"
                                                >
                                                    {isUpdating ? 'Updating...' : 'Mark as Under Review'}
                                                </button>
                                            )}

                                            {(app.status === 2 || app.status === 3) && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 4)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 text-[12px] font-bold bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 disabled:opacity-50"
                                                    >
                                                        Invite to Interview
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 6)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 text-[12px] font-bold bg-red-50 text-red-700 rounded-md hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {app.status === 4 && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 5)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 text-[12px] font-bold bg-green-50 text-green-700 rounded-md hover:bg-green-100 disabled:opacity-50"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(app.id, 6)}
                                                        disabled={isUpdating}
                                                        className="px-3 py-1.5 text-[12px] font-bold bg-red-50 text-red-700 rounded-md hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {(app.status === 5 || app.status === 6) && (
                                                <span className="text-[12px] text-gray-500 italic">Process completed</span>
                                            )}
                                        </div>

                                        {/* View Profile Button */}
                                        <button
                                            onClick={() => handleViewProfile(app.candidateProfileId)}
                                            disabled={loadingProfile}
                                            className="mt-3 w-full px-3 py-2 text-[13px] font-bold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                        >
                                            {loadingProfile ? 'Loading...' : 'View Candidate Profile'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Candidate Profile Modal */}
                {selectedCandidate && (
                    <CandidateProfileModal
                        candidate={selectedCandidate}
                        onClose={() => setSelectedCandidate(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ApplicantsModal;
