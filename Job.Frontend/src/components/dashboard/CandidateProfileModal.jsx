import React from 'react';
import { X, Mail, Calendar, Award, FileText, Code } from 'lucide-react';

const CandidateProfileModal = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[16px] w-[600px] max-w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#655be9] to-[#544bc2] text-white sticky top-0 z-10 rounded-t-[16px]">
                    <div>
                        <h3 className="text-[20px] font-bold">Candidate Profile</h3>
                        <p className="text-[12px] opacity-80">Candidate ID: {candidate.id}</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-[12px]">
                        <div className="flex items-center gap-2 mb-3">
                            <Mail size={18} className="text-[#655be9]" />
                            <h4 className="font-bold text-[#191e4a]">Contact Information</h4>
                        </div>
                        <div className="space-y-2 text-[14px]">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email:</span>
                                <span className="font-medium text-[#191e4a]">{candidate.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="bg-blue-50 p-4 rounded-[12px]">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={18} className="text-blue-600" />
                            <h4 className="font-bold text-[#191e4a]">Professional Experience</h4>
                        </div>
                        <div className="space-y-2 text-[14px]">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Years of Experience:</span>
                                <span className="font-bold text-[18px] text-blue-700">
                                    {candidate.yearsOfExperience || 0} {candidate.yearsOfExperience === 1 ? 'year' : 'years'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {candidate.summary && (
                        <div className="bg-purple-50 p-4 rounded-[12px]">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={18} className="text-purple-600" />
                                <h4 className="font-bold text-[#191e4a]">Professional Summary</h4>
                            </div>
                            <p className="text-[14px] text-gray-700 leading-relaxed">
                                {candidate.summary}
                            </p>
                        </div>
                    )}

                    {/* Skills */}
                    {candidate.candidateSkills && candidate.candidateSkills.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-[12px]">
                            <div className="flex items-center gap-2 mb-3">
                                <Code size={18} className="text-green-600" />
                                <h4 className="font-bold text-[#191e4a]">Skills & Technologies</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {candidate.candidateSkills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-full text-[12px] font-medium"
                                    >
                                        {skill.skill || `Skill ${skill.skillId}`}
                                        {skill.proficiencyLevel && (
                                            <span className="ml-1 text-green-500">
                                                {'★'.repeat(skill.proficiencyLevel)}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resume Link */}
                    {candidate.resumeUrl && (
                        <div className="bg-orange-50 p-4 rounded-[12px]">
                            <div className="flex items-center gap-2 mb-3">
                                <Award size={18} className="text-orange-600" />
                                <h4 className="font-bold text-[#191e4a]">Resume / CV</h4>
                            </div>
                            <a
                                href={candidate.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[14px] text-orange-600 hover:text-orange-700 font-medium underline"
                            >
                                View Resume (External Link)
                            </a>
                        </div>
                    )}

                    {/* Registration Date */}
                    <div className="text-center text-[12px] text-gray-400 pt-4 border-t border-gray-100">
                        Registered: {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfileModal;
