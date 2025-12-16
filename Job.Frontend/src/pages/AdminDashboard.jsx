import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trash2, Search, Loader2, ShieldAlert } from 'lucide-react';
import { userService, authService } from '../services/api';
import { Toaster, toast } from 'sonner';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            await userService.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user");
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#f2f6ff] font-['Inter',sans-serif]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-[1200px] mx-auto px-6 h-[70px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#191e4a] p-2 rounded-lg">
                            <ShieldAlert size={20} className="text-white" />
                        </div>
                        <h1 className="text-[20px] font-black text-[#191e4a] tracking-tight">Admin<span className="text-[#655be9]">Console</span></h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[14px] font-bold text-gray-500 hover:text-[#191e4a] transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-[28px] font-bold text-[#191e4a]">User Management</h2>
                        <p className="text-gray-500">View and manage all registered users.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-white border border-gray-200 pl-10 pr-4 h-[45px] rounded-[10px] w-full md:w-[300px] text-[14px] outline-none focus:border-[#655be9] shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#655be9]" size={32} />
                    </div>
                ) : (
                    <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-[12px] uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="p-5">User</th>
                                    <th className="p-5">Role/Email</th>
                                    <th className="p-5">Joined</th>
                                    <th className="p-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#655be9] font-bold">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#191e4a] text-[15px]">{user.username}</p>
                                                    <p className="text-[12px] text-gray-400">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-[14px] text-gray-600 font-medium">{user.email || "No email"}</p>
                                            {/* Since we don't have explicit role, we might imply or fetch it, currently just showing email */}
                                        </td>
                                        <td className="p-5 text-[14px] text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-gray-400">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
