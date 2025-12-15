using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Domain.Entities;
using Domain.InterfaceRepository;
using Applications.DTOs;
using Domain.Enums;

namespace Job.Controllers;

/// <summary>
/// Controller for managing job applications/postulations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly IGenericRepository<Domain.Entities.Application> _repository;
    private readonly IGenericRepository<Domain.Entities.Job> _jobRepository;
    private readonly IGenericRepository<CandidateProfile> _candidateRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<ApplicationsController> _logger;

    public ApplicationsController(
        IGenericRepository<Domain.Entities.Application> repository,
        IGenericRepository<Domain.Entities.Job> jobRepository,
        IGenericRepository<CandidateProfile> candidateRepository,
        IMapper mapper,
        ILogger<ApplicationsController> logger)
    {
        _repository = repository;
        _jobRepository = jobRepository;
        _candidateRepository = candidateRepository;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get all applications with optional filters
    /// </summary>
    /// <param name="jobId">Filter by job ID</param>
    /// <param name="candidateId">Filter by candidate profile ID</param>
    /// <param name="status">Filter by application status</param>
    /// <returns>List of applications</returns>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetAll(
        [FromQuery] int? jobId = null,
        [FromQuery] int? candidateId = null,
        [FromQuery] ApplicationStatus? status = null)
    {
        try
        {
            var applications = await _repository.GetAllAsync();
            
            if (jobId.HasValue)
            {
                applications = applications.Where(a => a.JobId == jobId.Value).ToList();
            }
            
            if (candidateId.HasValue)
            {
                applications = applications.Where(a => a.CandidateProfileId == candidateId.Value).ToList();
            }
            
            if (status.HasValue)
            {
                applications = applications.Where(a => a.Status == status.Value).ToList();
            }
            
            var dtos = _mapper.Map<IEnumerable<ApplicationDto>>(applications);
            _logger.LogInformation("Retrieved {Count} applications", dtos.Count());
            
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications");
            return StatusCode(500, "An error occurred while retrieving applications");
        }
    }

    /// <summary>
    /// Get an application by ID
    /// </summary>
    /// <param name="id">Application ID</param>
    /// <returns>Application details</returns>
    [HttpGet("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApplicationDto>> GetById(int id)
    {
        try
        {
            var application = await _repository.GetByIdAsync(id);
            
            if (application == null)
            {
                _logger.LogWarning("Application with ID {Id} not found", id);
                return NotFound(new { message = $"Application with ID {id} not found" });
            }
            
            var dto = _mapper.Map<ApplicationDto>(application);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving application {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the application");
        }
    }

    /// <summary>
    /// Submit a new job application (coder applies to a job)
    /// </summary>
    /// <param name="dto">Application data</param>
    /// <returns>Created application</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApplicationDto>> Create([FromBody] ApplicationDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate job exists and is active
            var job = await _jobRepository.GetByIdAsync(dto.JobId);
            if (job == null)
            {
                _logger.LogWarning("Job with ID {JobId} not found", dto.JobId);
                return NotFound(new { message = $"Job with ID {dto.JobId} not found" });
            }

            if (!job.IsActive)
            {
                return BadRequest(new { message = "This job posting is no longer accepting applications" });
            }

            // Validate candidate exists
            var candidateExists = await _candidateRepository.ExistAsync(dto.CandidateProfileId);
            if (!candidateExists)
            {
                _logger.LogWarning("Candidate with ID {CandidateId} not found", dto.CandidateProfileId);
                return NotFound(new { message = $"Candidate with ID {dto.CandidateProfileId} not found" });
            }

            // Check for duplicate application
            var existingApplications = await _repository.GetAllAsync();
            var duplicateApplication = existingApplications.FirstOrDefault(a => 
                a.JobId == dto.JobId && a.CandidateProfileId == dto.CandidateProfileId);

            if (duplicateApplication != null)
            {
                _logger.LogWarning("Candidate {CandidateId} has already applied to job {JobId}", 
                    dto.CandidateProfileId, dto.JobId);
                return BadRequest(new { message = "You have already applied to this job" });
            }

            var application = _mapper.Map<Domain.Entities.Application>(dto);
            application.CreatedAt = DateTime.UtcNow;
            application.Status = ApplicationStatus.Pending;
            
            var created = await _repository.CreateAsync(application);
            await _repository.SaveAsync();
            
            var createdDto = _mapper.Map<ApplicationDto>(created);
            _logger.LogInformation("Created application {Id} for job {JobId} by candidate {CandidateId}", 
                created.Id, created.JobId, created.CandidateProfileId);
            
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating application");
            return StatusCode(500, "An error occurred while creating the application");
        }
    }

    /// <summary>
    /// Update application status (for employability team)
    /// </summary>
    /// <param name="id">Application ID</param>
    /// <param name="status">New application status</param>
    /// <returns>Updated application</returns>
    [HttpPatch("{id}/status")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApplicationDto>> UpdateStatus(int id, [FromBody] ApplicationStatus status)
    {
        try
        {
            var application = await _repository.GetByIdAsync(id);
            if (application == null)
            {
                _logger.LogWarning("Application with ID {Id} not found for status update", id);
                return NotFound(new { message = $"Application with ID {id} not found" });
            }

            application.Status = status;
            application.UpdatedAt = DateTime.UtcNow;
            
            var updated = await _repository.UpdateAsync(application);
            await _repository.SaveAsync();
            
            var updatedDto = _mapper.Map<ApplicationDto>(updated);
            _logger.LogInformation("Updated application {Id} status to {Status}", id, status);
            
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating application {Id} status", id);
            return StatusCode(500, "An error occurred while updating the application status");
        }
    }

    /// <summary>
    /// Get applications by job ID
    /// </summary>
    /// <param name="jobId">Job ID</param>
    /// <returns>List of applications for the job</returns>
    [HttpGet("job/{jobId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetByJobId(int jobId)
    {
        try
        {
            var applications = await _repository.GetAllAsync();
            var jobApplications = applications.Where(a => a.JobId == jobId).ToList();
            
            var dtos = _mapper.Map<IEnumerable<ApplicationDto>>(jobApplications);
            _logger.LogInformation("Retrieved {Count} applications for job {JobId}", dtos.Count(), jobId);
            
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications for job {JobId}", jobId);
            return StatusCode(500, "An error occurred while retrieving applications");
        }
    }

    /// <summary>
    /// Get applications by candidate ID
    /// </summary>
    /// <param name="candidateId">Candidate profile ID</param>
    /// <returns>List of candidate's applications</returns>
    [HttpGet("candidate/{candidateId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetByCandidateId(int candidateId)
    {
        try
        {
            var applications = await _repository.GetAllAsync();
            var candidateApplications = applications.Where(a => a.CandidateProfileId == candidateId).ToList();
            
            var dtos = _mapper.Map<IEnumerable<ApplicationDto>>(candidateApplications);
            _logger.LogInformation("Retrieved {Count} applications for candidate {CandidateId}", 
                dtos.Count(), candidateId);
            
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications for candidate {CandidateId}", candidateId);
            return StatusCode(500, "An error occurred while retrieving applications");
        }
    }

    /// <summary>
    /// Delete an application (withdraw)
    /// </summary>
    /// <param name="id">Application ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var exists = await _repository.ExistAsync(id);
            if (!exists)
            {
                _logger.LogWarning("Application with ID {Id} not found for deletion", id);
                return NotFound(new { message = $"Application with ID {id} not found" });
            }

            await _repository.DeletedAsync(id);
            await _repository.SaveAsync();
            
            _logger.LogInformation("Deleted application {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting application {Id}", id);
            return StatusCode(500, "An error occurred while deleting the application");
        }
    }
}
