export const getDivisionFromJob = (job) => {
    // Looks for "[Division: Name]" at the start of the description
    const match = job.description?.match(/^\[Division: (.*?)\]/);
    return match ? match[1] : 'General';
};
