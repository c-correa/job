import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Briefcase, Code, Loader2, Mail } from 'lucide-react';
import { candidateService } from '../../services/api';
import Badge from '../ui/Badge';
import CandidateProfileModal from './CandidateProfileModal';

const CandidateSearch = () => {
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filters, setFilters] = useState({
        skill: '',
        minProficiency: ''
    });

    useEffect(() => {
        loadSkills();
        handleSearch(); // Initial load
    }, []);

    const loadSkills = async () => {
        try {
            const data = await candidateService.getAvailableSkills();
            // Flatten categories for simple select or keep structured
            const allSkills = [];
            Object.values(data).forEach(category => {
                if (Array.isArray(category)) allSkills.push(...category);
            });
            setSkills(allSkills.sort((a, b) => a.displayName.localeCompare(b.displayName)));
        } catch (error) {
            console.error("Failed to load skills", error);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const query = {};
            if (filters.skill) query.skill = filters.skill;
            if (filters.minProficiency) query.minProficiency = filters.minProficiency;

            const results = await candidateService.getAll(query);
            setCandidates(results);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
            <div className="mb-8">
                <h2 className="text-[#191e4a] text-[28px] font-bold mb-2">Find Talent</h2>
                <p className="text-gray-500">Search for candidates with specific skills for your projects.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-[16px] shadow-lg shadow-gray-100 border border-gray-100 mb-8 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[13px] font-bold text-[#191e4a] mb-1.5">Required Skill</label>
                    <div className="relative">
                        <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            className="w-full pl-10 h-[42px] bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] outline-none focus:border-[#55c79e] appearance-none"
                            value={filters.skill}
                            onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                        >
                            <option value="">Any Skill</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.id}>{skill.displayName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-[150px]">
                    <label className="block text-[13px] font-bold text-[#191e4a] mb-1.5">Min Proficiency</label>
                    <select
                        className="w-full h-[42px] bg-gray-50 border border-gray-200 rounded-[10px] text-[14px] outline-none focus:border-[#55c79e] px-3"
                        value={filters.minProficiency}
                        onChange={(e) => setFilters({ ...filters, minProficiency: e.target.value })}
                    >
                        <option value="">Any Level</option>
                        <option value="1">1 - Beginner</option>
                        <option value="2">2 - Elementary</option>
                        <option value="3">3 - Intermediate</option>
                        <option value="4">4 - Advanced</option>
                        <option value="5">5 - Expert</option>
                    </select>
                </div>

                <button
                    onClick={handleSearch}
                    className="h-[42px] px-6 bg-[#55c79e] hover:bg-[#46b08a] text-white rounded-[10px] font-bold text-[14px] shadow-lg shadow-[#55c79e]/20 transition-all flex items-center gap-2"
                >
                    <Search size={18} /> Search
                </button>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-[#655be9] mb-3" size={32} />
                    <p className="text-gray-400 font-medium">Searching candidates...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.length > 0 ? (
                        candidates.map(candidate => (
                            <div key={candidate.id} className="bg-white p-6 rounded-[16px] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#655be9]/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-gray-50 p-3 rounded-full group-hover:bg-[#655be9]/5 transition-colors">
                                        <User size={24} className="text-gray-400 group-hover:text-[#655be9]" />
                                    </div>
                                    <button onClick={() => setSelectedCandidate(candidate)} className="text-gray-400 hover:text-[#191e4a] transition-colors p-2" title="View Profile">
                                        <User size={18} />
                                    </button>
                                </div>

                                <div className="cursor-pointer" onClick={() => setSelectedCandidate(candidate)}>
                                    <h3 className="text-[#191e4a] font-bold text-[18px] mb-1 hover:text-[#55c79e] transition-colors">{candidate.fullName || "Candidate"}</h3>
                                    <p className="text-gray-500 text-[13px] mb-4 line-clamp-2">{candidate.summary || "No summary provided."}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600 text-[13px]">
                                        <Briefcase size={14} />
                                        <span>{candidate.yearsOfExperience} years experience</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {candidate.candidateSkills?.slice(0, 3).map((skill, idx) => (
                                            <Badge key={idx} text={getSkillName(skill.skill, skills)} type="gray" />
                                        ))}
                                        {(candidate.candidateSkills?.length || 0) > 3 && (
                                            <span className="text-[11px] text-gray-400 font-bold py-0.5">+{(candidate.candidateSkills.length - 3)} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-100 rounded-[16px]">
                            <p className="text-gray-400 font-medium">No candidates found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
            {selectedCandidate && (
                <CandidateProfileModal
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                />
            )}
        </div>
    );
};

// Helper for skill name display (naive match if skills loaded)
const getSkillName = (skillId, allSkills) => {
    const found = allSkills.find(s => s.id === skillId);
    return found ? found.displayName : `Skill ${skillId}`;
};

export default CandidateSearch;
