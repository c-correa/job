import React from 'react';
import { X, Mail, Calendar, Award, FileText, Code } from 'lucide-react';

const CandidateProfileModal = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-[24px] w-[700px] max-w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/20" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-[#191e4a] to-[#2a3270] text-white sticky top-0 z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-[24px] font-bold tracking-tight">Candidate Profile</h3>
                            <p className="text-[#a0a6d5] text-[14px] mt-1 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Candidate ID: #{candidate.id}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200 backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* Summary Section */}
                    {candidate.summary && (
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-[20px] border border-indigo-100 shadow-sm">
                            <h4 className="font-bold text-[#191e4a] flex items-center gap-2 mb-4 text-[16px]">
                                <FileText size={20} className="text-indigo-600" />
                                Professional Summary
                            </h4>
                            <p className="text-[15px] text-slate-700 leading-relaxed text-justify">
                                {candidate.summary}
                            </p>
                        </div>
                    )}

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Experience */}
                        <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-[20px] border border-blue-100 shadow-sm flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-[13px] text-blue-600 font-bold uppercase tracking-wider">Experience</p>
                                <p className="text-[24px] font-black text-[#191e4a]">
                                    {candidate.yearsOfExperience || 0}
                                    <span className="text-[14px] font-normal text-gray-500 ml-1">years</span>
                                </p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-[20px] border border-purple-100 shadow-sm flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                                <Mail size={24} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[13px] text-purple-600 font-bold uppercase tracking-wider">Contact</p>
                                <p className="text-[16px] font-bold text-[#191e4a] truncate" title={candidate.email}>
                                    {candidate.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    {candidate.candidateSkills && candidate.candidateSkills.length > 0 ? (
                        <div>
                            <h4 className="font-bold text-[#191e4a] mb-4 flex items-center gap-2 text-[18px]">
                                <Code size={20} className="text-pink-500" />
                                Skills & Technologies
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {candidate.candidateSkills.map((skill, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-[12px] hover:shadow-md hover:border-pink-200 transition-all duration-300 group"
                                    >
                                        <span className="font-bold text-gray-700 group-hover:text-pink-600 transition-colors">
                                            {skill.skill || `Skill #${skill.skillId}`}
                                        </span>
                                        {skill.proficiencyLevel && (
                                            <div className="flex bg-gray-50 px-2 py-1 rounded-md">
                                                <span className="text-[12px] text-yellow-400 tracking-[1px]">
                                                    {'★'.repeat(skill.proficiencyLevel)}
                                                </span>
                                                <span className="text-[12px] text-gray-200 tracking-[1px]">
                                                    {'★'.repeat(5 - skill.proficiencyLevel)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-[20px] border border-dashed border-gray-200 text-gray-400">
                            No skills listed
                        </div>
                    )}

                    {/* Resume Button */}
                    {candidate.resumeUrl && (
                        <div className="pt-4">
                            <a
                                href={candidate.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#191e4a] hover:bg-[#252b5e] text-white p-4 rounded-[16px] flex items-center justify-center gap-3 font-bold text-[16px] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <Award size={20} className="group-hover:rotate-12 transition-transform" />
                                View Full Resume / CV
                            </a>
                        </div>
                    )}

                    {/* Footer Date */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-[12px] text-gray-400 font-medium">
                            Member since {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CandidateProfileModal;
