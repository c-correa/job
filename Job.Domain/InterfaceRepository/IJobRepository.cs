using Domain.Entities;

namespace Domain.InterfaceRepository;

/// <summary>
/// Repository interface for Job specific operations
/// </summary>
public interface IJobRepository : IGenericRepository<Job>
{
    /// <summary>
    /// Get all jobs with details (Company, Skills)
    /// </summary>
    Task<IEnumerable<Job>> GetAllWithDetailsAsync();
    
    /// <summary>
    /// Get job by ID with details (Company, Skills)
    /// </summary>
    Task<Job?> GetByIdWithDetailsAsync(int id);

    /// <summary>
    /// Get top required skills across all jobs
    /// </summary>
    Task<IEnumerable<(string SkillName, int Count)>> GetTopRequiredSkillsAsync(int count);
}
