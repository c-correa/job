using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Domain.Entities;
using Domain.InterfaceRepository;
using Applications.DTOs;

namespace Job.Controllers;

/// <summary>
/// Controller for managing job postings
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<JobsController> _logger;

    public JobsController(
        IJobRepository repository,
        IMapper mapper,
        ILogger<JobsController> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get all jobs with optional filters
    /// </summary>
    /// <param name="companyId">Filter by company ID</param>
    /// <param name="isActive">Filter by active status</param>
    /// <returns>List of jobs</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<JobDto>>> GetAll(
        [FromQuery] int? companyId = null,
        [FromQuery] bool? isActive = null)
    {
        try
        {
            var jobs = await _repository.GetAllWithDetailsAsync();
            
            if (companyId.HasValue)
            {
                jobs = jobs.Where(j => j.CompanyProfileId == companyId.Value).ToList();
            }
            
            if (isActive.HasValue)
            {
                jobs = jobs.Where(j => j.IsActive == isActive.Value).ToList();
            }
            
            var dtos = _mapper.Map<IEnumerable<JobDto>>(jobs);
            _logger.LogInformation("Retrieved {Count} jobs", dtos.Count());
            
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving jobs");
            return StatusCode(500, "An error occurred while retrieving jobs");
        }
    }

    /// <summary>
    /// Get a job by ID
    /// </summary>
    /// <param name="id">Job ID</param>
    /// <returns>Job details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<JobDto>> GetById(int id)
    {
        try
        {
            var job = await _repository.GetByIdWithDetailsAsync(id);
            
            if (job == null)
            {
                _logger.LogWarning("Job with ID {Id} not found", id);
                return NotFound(new { message = $"Job with ID {id} not found" });
            }
            
            var dto = _mapper.Map<JobDto>(job);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving job {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the job");
        }
    }

    /// <summary>
    /// Create a new job posting
    /// </summary>
    /// <param name="dto">Job data</param>
    /// <returns>Created job</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<JobDto>> Create([FromBody] JobDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var job = _mapper.Map<Domain.Entities.Job>(dto);
            job.CreatedAt = DateTime.UtcNow;
            job.IsActive = true; // New jobs are active by default
            
            var created = await _repository.CreateAsync(job);
            await _repository.SaveAsync();
            
            var createdDto = _mapper.Map<JobDto>(created);
            _logger.LogInformation("Created job {Id}: {Title}", created.Id, created.Title);
            
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job");
            return StatusCode(500, "An error occurred while creating the job");
        }
    }

    /// <summary>
    /// Update an existing job posting
    /// </summary>
    /// <param name="id">Job ID</param>
    /// <param name="dto">Updated job data</param>
    /// <returns>Updated job</returns>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<JobDto>> Update(int id, [FromBody] JobDto dto)
    {
        try
        {
            if (id != dto.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var job = await _repository.GetByIdAsync(id);
            if (job == null)
            {
                _logger.LogWarning("Job with ID {Id} not found for update", id);
                return NotFound(new { message = $"Job with ID {id} not found" });
            }

            // Update existing entity properties
            _mapper.Map(dto, job);
            job.UpdatedAt = DateTime.UtcNow;
            
            // Rely on change tracking for update
            await _repository.SaveAsync();
            
            var updatedDto = _mapper.Map<JobDto>(job);
            _logger.LogInformation("Updated job {Id}: {Title}", job.Id, job.Title);
            
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job {Id}", id);
            return StatusCode(500, "An error occurred while updating the job");
        }
    }

    /// <summary>
    /// Delete a job posting
    /// </summary>
    /// <param name="id">Job ID</param>
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
                _logger.LogWarning("Job with ID {Id} not found for deletion", id);
                return NotFound(new { message = $"Job with ID {id} not found" });
            }

            await _repository.DeletedAsync(id);
            await _repository.SaveAsync();
            
            _logger.LogInformation("Deleted job {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job {Id}", id);
            return StatusCode(500, "An error occurred while deleting the job");
        }
    }

    /// <summary>
    /// Activate or deactivate a job posting
    /// </summary>
    /// <param name="id">Job ID</param>
    /// <param name="isActive">Active status</param>
    /// <returns>Updated job</returns>
    [HttpPatch("{id}/status")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<JobDto>> UpdateStatus(int id, [FromBody] bool isActive)
    {
        try
        {
            var job = await _repository.GetByIdAsync(id);
            if (job == null)
            {
                _logger.LogWarning("Job with ID {Id} not found for status update", id);
                return NotFound(new { message = $"Job with ID {id} not found" });
            }

            job.IsActive = isActive;
            job.UpdatedAt = DateTime.UtcNow;
            
            // Rely on change tracking
            await _repository.SaveAsync();
            
            var updatedDto = _mapper.Map<JobDto>(job);
            _logger.LogInformation("Updated job {Id} status to {IsActive}", id, isActive);
            
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job {Id} status", id);
            return StatusCode(500, "An error occurred while updating the job status");
        }
    }

    /// <summary>
    /// Get active jobs only
    /// </summary>
    /// <returns>List of active jobs</returns>
    [HttpGet("active")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<JobDto>>> GetActiveJobs()
    {
        try
        {
            var jobs = await _repository.GetAllAsync();
            var activeJobs = jobs.Where(j => j.IsActive).ToList();
            
            var dtos = _mapper.Map<IEnumerable<JobDto>>(activeJobs);
            _logger.LogInformation("Retrieved {Count} active jobs", dtos.Count());
            
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active jobs");
            return StatusCode(500, "An error occurred while retrieving active jobs");
        }
    }
}
