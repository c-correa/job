using Domain.Entities;
using Domain.InterfaceRepository;
using Job.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Job.Infra.Repositories;

/// <summary>
/// Repository implementation for Job specific operations
/// </summary>
public class JobRepository : GenericRepository<Domain.Entities.Job>, IJobRepository
{
    private readonly AppDBContext _context;

    public JobRepository(AppDBContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Domain.Entities.Job>> GetAllWithDetailsAsync()
    {
        return await _context.Jobs
            .Include(j => j.CompanyProfile)
            .Include(j => j.JobSkills)
            .ToListAsync();
    }

    public async Task<Domain.Entities.Job?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Jobs
            .Include(j => j.CompanyProfile)
            .Include(j => j.JobSkills)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<IEnumerable<(string SkillName, int Count)>> GetTopRequiredSkillsAsync(int count)
    {
        var topSkills = await _context.JobSkills
            .GroupBy(js => js.Skill)
            .Select(g => new 
            { 
                Skill = g.Key, 
                Count = g.Count() 
            })
            .OrderByDescending(x => x.Count)
            .Take(count)
            .ToListAsync();

        return topSkills.Select(x => (x.Skill.ToString(), x.Count));
    }
}
