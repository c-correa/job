using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Domain.InterfaceRepository;
using Domain.Enums;

namespace Job.Controllers;

/// <summary>
/// Controller for platform metrics and analytics
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MetricsController : ControllerBase
{
    private readonly IJobRepository _jobRepository;
    private readonly IApplicationRepository _applicationRepository;
    private readonly ILogger<MetricsController> _logger;

    public MetricsController(
        IJobRepository jobRepository,
        IApplicationRepository applicationRepository,
        ILogger<MetricsController> logger)
    {
        _jobRepository = jobRepository;
        _applicationRepository = applicationRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get key platform metrics
    /// </summary>
    /// <returns>Metrics object</returns>
    [HttpGet]
    [Authorize] // Or allow anonymous if needed for public dashboard
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMetrics()
    {
        try
        {
            // 1. Top required skills
            var topSkills = await _jobRepository.GetTopRequiredSkillsAsync(5);
            
            // 2. Top applied jobs
            var topJobs = await _applicationRepository.GetTopAppliedJobsAsync(5);
            
            // 3. Application status distribution
            var statusCounts = await _applicationRepository.GetApplicationCountsByStatusAsync();
            
            // 4. Total counts (simple approximations)
            var totalJobs = (await _jobRepository.GetAllAsync()).Count();
            var totalApplications = statusCounts.Values.Sum();

            var metrics = new
            {
                TotalJobs = totalJobs,
                TotalApplications = totalApplications,
                TopSkills = topSkills.Select(x => new { Skill = x.SkillName, Count = x.Count }),
                TopAppliedJobs = topJobs.Select(x => new { JobId = x.JobId, Title = x.JobTitle, Applications = x.Count }),
                ApplicationStatusDistribution = statusCounts.Select(x => new { Status = x.Key.ToString(), Count = x.Value })
            };
            
            _logger.LogInformation("Retrieved platform metrics");
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving metrics");
            return StatusCode(500, "An error occurred while retrieving metrics");
        }
    }
}
