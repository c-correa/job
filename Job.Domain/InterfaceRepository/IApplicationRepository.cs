using Domain.Entities;
using Domain.Enums;

namespace Domain.InterfaceRepository;

/// <summary>
/// Repository interface for Application specific operations
/// </summary>
public interface IApplicationRepository : IGenericRepository<Application>
{
    /// <summary>
    /// Get application counts grouped by status
    /// </summary>
    Task<Dictionary<ApplicationStatus, int>> GetApplicationCountsByStatusAsync();
    
    /// <summary>
    /// Get top jobs by number of applications
    /// </summary>
    Task<IEnumerable<(int JobId, string JobTitle, int Count)>> GetTopAppliedJobsAsync(int count);
    
    /// <summary>
    /// Get recent applications with details
    /// </summary>
    Task<IEnumerable<Application>> GetRecentApplicationsAsync(int count);
}
