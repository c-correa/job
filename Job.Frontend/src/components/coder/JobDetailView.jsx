import React, { useState } from 'react';
import { Building2, MapPin, DollarSign, Loader2, CheckCircle, Upload } from 'lucide-react';
import Badge from '../ui/Badge';
import { authService, candidateService, applicationService, fileService } from '../../services/api';

export default function JobDetailView({ job, onApplicationSubmitted }) {
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    if (!job) return <div className="bg-white rounded-[16px] p-8 h-full flex items-center justify-center text-gray-400">Select a job to view details</div>;

    const skills = job.requiredSkills && typeof job.requiredSkills === 'string'
        ? job.requiredSkills.split(',')
        : [];

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleApply = async () => {
        try {
            setApplying(true);
            setError(null);

            // Get current user - prefer localStorage for reliable userId
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            let userId = storedUser.userId || storedUser.UserId;

            // Fallback to API if not in localStorage
            if (!userId) {
                const userData = await authService.getMe();
                // Parse userId since it might come as string from claims
                userId = parseInt(userData.userId) || parseInt(userData.UserId);
            }

            // Ensure it's a number
            userId = parseInt(userId);
            console.log("Using userId:", userId, "Type:", typeof userId);

            // Get candidate profile
            const candidateProfile = await candidateService.getMyCandidate(userId);

            if (!candidateProfile) {
                setError("No candidate profile found. Please complete your registration as a Coder.");
                return;
            }

            let resumeUrl = null;
            if (selectedFile) {
                setUploading(true);
                try {
                    const uploadResponse = await fileService.upload(selectedFile);
                    resumeUrl = uploadResponse.url;
                } catch (uploadErr) {
                    console.error("Error uploading file:", uploadErr);
                    setError("Failed to upload CV. Please try again.");
                    setApplying(false);
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            // Create application
            await applicationService.create({
                jobId: job.id,
                candidateProfileId: candidateProfile.id,
                coverLetter: `Application for ${job.title}`,
                resumeUrl: resumeUrl
            });

            setApplied(true);
            if (onApplicationSubmitted) onApplicationSubmitted();

        } catch (err) {
            console.error("Error applying to job:", err);
            if (err.response?.status === 400 && err.response?.data?.message?.includes("already applied")) {
                setError("You have already applied to this job!");
            } else {
                setError(err.response?.data?.message || "Failed to submit application. Please try again.");
            }
        } finally {
            setApplying(false);
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-[16px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.05)] h-full border border-gray-100 sticky top-24">
            {/* Header Detalle */}
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-[#191e4a] text-[28px] font-bold">{job.title}</h2>
                <Badge text={job.jobType === 1 ? 'Full-Time' : job.jobType === 2 ? 'Part-Time' : 'Contract'} type="dark" />
            </div>

            <div className="flex items-center gap-6 text-gray-500 mb-6 text-[14px]">
                <div className="flex items-center gap-2">
                    <Building2 size={16} /> <span className="font-medium">{job.companyName || "Unknown Company"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} /> <span>{job.location}</span>
                </div>
                {job.salary && (
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} /> <span>${job.salary.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mb-8 flex-wrap">
                {skills.map((tag, i) => (
                    <Badge key={i} text={tag.trim()} type="purple" />
                ))}
            </div>

            <div className="h-px bg-gray-200 w-full mb-6" />

            {/* Descripción del Trabajo */}
            <h3 className="text-[#191e4a] text-[18px] font-bold mb-4">Complete job description</h3>

            <div className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap mb-6">
                {job.description}
            </div>

            {/* CV Upload Section */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach your CV/Resume (Optional)
                </label>
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-600">
                        <Upload size={16} />
                        <span>{selectedFile ? selectedFile.name : "Choose file (PDF, DOCX)"}</span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                    </label>
                    {selectedFile && (
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="mt-8">
                {applied ? (
                    <div className="w-full bg-green-50 border-2 border-green-500 text-green-700 py-3 rounded-[8px] font-bold text-[16px] flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        Application Submitted!
                    </div>
                ) : (
                    <button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full bg-[#655be9] hover:bg-[#544bc2] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-[8px] font-bold text-[16px] shadow-lg shadow-[#655be9]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {applying ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                {uploading ? 'Uploading CV...' : 'Applying...'}
                            </>
                        ) : (
                            'Apply Now'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
