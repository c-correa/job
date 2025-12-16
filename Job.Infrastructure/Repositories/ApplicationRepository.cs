using Domain.Entities;
using Domain.Enums;
using Domain.InterfaceRepository;
using Job.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Job.Infra.Repositories;

/// <summary>
/// Repository implementation for Application specific operations
/// </summary>
public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
{
    private readonly AppDBContext _context;

    public ApplicationRepository(AppDBContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Dictionary<ApplicationStatus, int>> GetApplicationCountsByStatusAsync()
    {
        return await _context.Applications
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Status, x => x.Count);
    }

    public async Task<IEnumerable<(int JobId, string JobTitle, int Count)>> GetTopAppliedJobsAsync(int count)
    {
        var topJobs = await _context.Applications
            .GroupBy(a => a.JobId)
            .Select(g => new 
            { 
                JobId = g.Key, 
                Count = g.Count() 
            })
            .OrderByDescending(x => x.Count)
            .Take(count)
            .ToListAsync();

        // Fetch titles separately or include them. 
        // To keep it efficient, we'll fetch the job titles for these IDs.
        var jobIds = topJobs.Select(x => x.JobId).ToList();
        var jobs = await _context.Jobs
            .Where(j => jobIds.Contains(j.Id))
            .Select(j => new { j.Id, j.Title })
            .ToDictionaryAsync(j => j.Id, j => j.Title);

        return topJobs.Select(x => (x.JobId, jobs.ContainsKey(x.JobId) ? jobs[x.JobId] : "Unknown", x.Count));
    }

    public async Task<IEnumerable<Application>> GetRecentApplicationsAsync(int count)
    {
        return await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.CandidateProfile)
            .OrderByDescending(a => a.CreatedAt)
            .Take(count)
            .ToListAsync();
    }
}
