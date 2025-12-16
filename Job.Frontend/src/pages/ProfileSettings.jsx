import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, Briefcase, FileText, Award, Plus, X, Loader2 } from 'lucide-react';
import { authService, candidateService } from '../services/api';
import Badge from '../components/ui/Badge';
import { toast } from 'sonner';

export default function ProfileSettings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [candidate, setCandidate] = useState(null);
    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        summary: '',
        yearsOfExperience: 0,
        resumeUrl: ''
    });

    // Skill addition state
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [proficiency, setProficiency] = useState(3);
    const [showSkillPicker, setShowSkillPicker] = useState(false);

    useEffect(() => {
        loadProfile();
        loadAvailableSkills();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            let userId = parseInt(storedUser.userId || storedUser.UserId);

            if (!userId) {
                const userData = await authService.getMe();
                userId = parseInt(userData.userId);
            }

            console.log('🔍 Loading profile for userId:', userId);
            const profile = await candidateService.getMyCandidate(userId);

            if (!profile) {
                toast.error('Profile not found');
                navigate('/dashboard-coder');
                return;
            }

            console.log('✅ Profile loaded:', profile);
            console.log('📊 Skills in profile:', profile.candidateSkills);

            setCandidate(profile);
            setFormData({
                email: profile.email || '',
                summary: profile.summary || '',
                yearsOfExperience: profile.yearsOfExperience || 0,
                resumeUrl: profile.resumeUrl || ''
            });
            setSkills(profile.candidateSkills || []);
            console.log('🎯 Skills set to state:', profile.candidateSkills || []);
        } catch (error) {
            console.error('Failed to load profile', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableSkills = async () => {
        try {
            const skillsData = await candidateService.getAvailableSkills();
            setAvailableSkills(skillsData);
        } catch (error) {
            console.error('Failed to load skills', error);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Only send core profile data, NOT skills
            // Skills are managed separately via addSkill endpoint
            const updateData = {
                id: candidate.id,
                userId: candidate.userId,
                email: formData.email,
                summary: formData.summary,
                yearsOfExperience: formData.yearsOfExperience,
                resumeUrl: formData.resumeUrl,
                candidateSkills: null // Explicitly null to prevent mapping issues
            };

            console.log('📤 Sending update:', updateData);

            await candidateService.update(candidate.id, updateData);
            toast.success('Profile updated successfully!');

            // Reload to get fresh data
            await loadProfile();
        } catch (error) {
            console.error('Failed to update profile', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleAddSkill = async () => {
        if (!selectedSkill) return;

        try {
            // Backend DTO expects: Skill (enum value) and ProficiencyLevel
            const skillData = {
                skill: parseInt(selectedSkill), // Maps to Skill enum property
                proficiencyLevel: proficiency   // Maps to ProficiencyLevel property
            };

            console.log('Adding skill:', skillData);
            await candidateService.addSkill(candidate.id, skillData);

            // Reload profile to get updated skills
            await loadProfile();

            // Reset
            setSelectedSkill('');
            setSelectedCategory('');
            setProficiency(3);
            setShowSkillPicker(false);
            toast.success('Skill added successfully!');
        } catch (error) {
            console.error('Failed to add skill', error);
            const errorMsg = error.response?.data?.title || error.response?.data?.message || error.message;
            toast.error('Failed to add skill: ' + errorMsg);
        }
    };

    const getSkillName = (skillId) => {
        if (!availableSkills) return `Skill #${skillId}`;

        for (const category of Object.values(availableSkills)) {
            const found = category.find(s => s.id === skillId);
            if (found) return found.displayName;
        }
        return `Skill #${skillId}`;
    };

    const removeSkill = async (skillId) => {
        console.log('🗑️ Attempting to delete skill with ID:', skillId);
        try {
            await candidateService.deleteSkill(candidate.id, skillId);
            toast.success('Skill removed successfully');

            // Reload profile to get updated list
            await loadProfile();
        } catch (error) {
            console.error('Failed to remove skill', error);
            const errorMsg = error.response?.data?.message || 'Failed to remove skill';
            toast.error(errorMsg);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fafafa] to-white">
                <Loader2 className="animate-spin text-[#655be9]" size={42} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fafafa] to-white font-['Inter',sans-serif]">

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="text-[#191e4a] text-[28px] font-black tracking-tighter">HireTech</h1>
                    <Badge text="CODER" type="green" />
                </div>
                <button onClick={() => navigate('/dashboard-coder')} className="text-[#191e4a] font-bold text-[14px] hover:text-[#655be9] transition-colors">
                    ← Back to Dashboard
                </button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-[#191e4a] text-[36px] font-black mb-2 flex items-center gap-3">
                        <User size={36} className="text-[#655be9]" />
                        Profile Settings
                    </h2>
                    <p className="text-gray-600">Manage your professional information and skills</p>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-[20px] p-8 shadow-lg border border-gray-100 mb-6">
                    <h3 className="text-[#191e4a] text-[22px] font-bold mb-6 flex items-center gap-2">
                        <Briefcase size={22} className="text-[#655be9]" />
                        Professional Information
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[14px] font-bold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-2 border-gray-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#655be9] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-bold text-gray-700 mb-2">Years of Experience</label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={formData.yearsOfExperience}
                                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                                className="w-full border-2 border-gray-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#655be9] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-bold text-gray-700 mb-2">Professional Summary</label>
                            <textarea
                                rows="4"
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                placeholder="Tell companies about yourself, your experience, and what you're looking for..."
                                className="w-full border-2 border-gray-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#655be9] transition-colors resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[14px] font-bold text-gray-700 mb-2">Resume URL</label>
                            <input
                                type="url"
                                value={formData.resumeUrl}
                                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                placeholder="https://drive.google.com/..."
                                className="w-full border-2 border-gray-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#655be9] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills Management */}
                <div className="bg-white rounded-[20px] p-8 shadow-lg border border-gray-100 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#191e4a] text-[22px] font-bold flex items-center gap-2">
                            <Award size={22} className="text-[#655be9]" />
                            Skills
                        </h3>
                        <button
                            onClick={() => setShowSkillPicker(!showSkillPicker)}
                            className="flex items-center gap-2 bg-[#655be9] text-white px-4 py-2 rounded-[10px] font-bold text-[14px] hover:bg-[#544bc2] transition-colors"
                        >
                            <Plus size={16} />
                            Add Skill
                        </button>
                    </div>

                    {/* Current Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 text-purple-700 px-4 py-3 rounded-[12px] hover:shadow-md transition-shadow">
                                <div className="flex-1">
                                    <span className="font-bold text-[14px] block">
                                        {getSkillName(skill.skillId || skill.skill)}
                                    </span>
                                    {skill.proficiencyLevel && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[11px] text-purple-600">Proficiency:</span>
                                            <span className="text-yellow-500">{'★'.repeat(skill.proficiencyLevel)}{'☆'.repeat(5 - skill.proficiencyLevel)}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeSkill(skill.id)}
                                    className="ml-3 p-1.5 hover:bg-purple-200 rounded-full transition-colors"
                                    title="Remove skill"
                                >
                                    <X size={16} className="text-purple-600" />
                                </button>
                            </div>
                        ))}
                        {skills.length === 0 && (
                            <div className="col-span-2 text-center py-8 text-gray-400 italic bg-gray-50 rounded-[12px] border-2 border-dashed border-gray-200">
                                <Award size={32} className="mx-auto mb-2 opacity-30" />
                                <p>No skills added yet. Click "Add Skill" to get started!</p>
                            </div>
                        )}
                    </div>

                    {/* Skill Picker */}
                    {showSkillPicker && availableSkills && (
                        <div className="border-2 border-gray-200 rounded-[12px] p-6 bg-gray-50">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[14px] font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-[10px] px-4 py-2 outline-none focus:border-[#655be9]"
                                    >
                                        <option value="">Select Category</option>
                                        {Object.keys(availableSkills).map(category => (
                                            <option key={category} value={category}>
                                                {availableSkills[category][0]?.category || category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[14px] font-bold text-gray-700 mb-2">Skill</label>
                                    <select
                                        value={selectedSkill}
                                        onChange={(e) => setSelectedSkill(e.target.value)}
                                        disabled={!selectedCategory}
                                        className="w-full border-2 border-gray-200 rounded-[10px] px-4 py-2 outline-none focus:border-[#655be9] disabled:bg-gray-100"
                                    >
                                        <option value="">Select Skill</option>
                                        {selectedCategory && availableSkills[selectedCategory]?.map(skill => (
                                            <option key={skill.id} value={skill.id}>
                                                {skill.displayName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[14px] font-bold text-gray-700 mb-2">
                                    Proficiency Level: {proficiency}/5
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={proficiency}
                                    onChange={(e) => setProficiency(parseInt(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-[12px] text-gray-500 mt-1">
                                    <span>Beginner</span>
                                    <span>Expert</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddSkill}
                                    disabled={!selectedSkill}
                                    className="bg-[#655be9] text-white px-6 py-2 rounded-[10px] font-bold hover:bg-[#544bc2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add Skill
                                </button>
                                <button
                                    onClick={() => setShowSkillPicker(false)}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-[10px] font-bold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#655be9] text-white px-8 py-4 rounded-[12px] font-bold text-[16px] hover:bg-[#544bc2] disabled:opacity-50 transition-all shadow-lg shadow-[#655be9]/30"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
