import React, { useState } from 'react';
import { X, Building2, Calendar, MapPin, AlertCircle, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';

const ApplicationDetailsModal = ({ application, onClose, onWithdraw, loading }) => {
    if (!application) return null;

    const canWithdraw = application.status === 1 || application.status === 2; // Pending or Under Review

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[16px] w-[600px] max-w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h3 className="text-[20px] font-bold text-[#191e4a]">{application.jobTitle}</h3>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Building2 size={14} />
                            <span className="text-[14px] font-medium">{application.companyName}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-gray-100 p-1.5 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Status Sections */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div>
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Current Status</p>
                            <Badge text={getStatusText(application.status)} type={getStatusType(application.status)} />
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Applied On</p>
                            <div className="flex items-center gap-1.5 text-gray-600 text-[14px] font-medium">
                                <Calendar size={14} />
                                {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                            <div className="flex items-center gap-1.5 text-gray-700">
                                <MapPin size={14} />
                                <span className="text-[14px]">{application.location}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Job Type</p>
                            <span className="text-[14px] text-gray-700 font-medium">
                                {application.jobType === 1 ? 'Full-Time' : 'Part-Time'}
                            </span>
                        </div>
                    </div>

                    {/* Description or Notes could go here */}

                    {/* Actions */}
                    {canWithdraw && (
                        <div className="pt-4 border-t border-gray-100">
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                <h4 className="flex items-center gap-2 text-red-700 font-bold text-[14px] mb-2">
                                    <AlertCircle size={16} /> Withdraw Application
                                </h4>
                                <p className="text-[13px] text-red-600 mb-4">
                                    Are you sure? Retrieving your application will remove you from the candidate list. This action cannot be undone.
                                </p>
                                <button
                                    onClick={() => onWithdraw(application.id)}
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 w-full bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold py-2 rounded-lg transition-all text-[14px]"
                                >
                                    {loading ? 'Processing...' : <><Trash2 size={16} /> Withdraw Application</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Utils (could be shared)
const getStatusText = (status) => {
    switch (status) {
        case 1: return 'Pending';
        case 2: return 'Under Review';
        case 3: return 'Shortlisted';
        case 4: return 'Interview';
        case 5: return 'Accepted';
        case 6: return 'Rejected';
        default: return 'Unknown';
    }
};

const getStatusType = (status) => {
    switch (status) {
        case 1: return 'pending';
        case 2: return 'review'; // Assuming custom type or warning
        case 3: return 'info';
        case 4: return 'warning';
        case 5: return 'success';
        case 6: return 'danger';
        default: return 'default';
    }
};

export default ApplicationDetailsModal;
