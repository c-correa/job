using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Domain.Entities;
using Domain.InterfaceRepository;
using Applications.DTOs;
using Domain.Enums;

namespace Job.Controllers;

/// <summary>
/// Controller for managing company profiles
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly IGenericRepository<CompanyProfile> _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<CompaniesController> _logger;

    public CompaniesController(
        IGenericRepository<CompanyProfile> repository,
        IMapper mapper,
        ILogger<CompaniesController> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get all companies with optional industry filter
    /// </summary>
    /// <param name="industry">Optional industry filter</param>
    /// <returns>List of companies</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CompanyProfileDto>>> GetAll([FromQuery] Industry? industry = null)
    {
        try
        {
            var companies = await _repository.GetAllAsync();
            
            if (industry.HasValue)
            {
                companies = companies.Where(c => c.Industry == industry).ToList();
            }
            
            var dtos = _mapper.Map<IEnumerable<CompanyProfileDto>>(companies);
            _logger.LogInformation("Retrieved {Count} companies", dtos.Count());
            
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving companies");
            return StatusCode(500, "An error occurred while retrieving companies");
        }
    }

    /// <summary>
    /// Get a company by ID
    /// </summary>
    /// <param name="id">Company ID</param>
    /// <returns>Company profile</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CompanyProfileDto>> GetById(int id)
    {
        try
        {
            var company = await _repository.GetByIdAsync(id);
            
            if (company == null)
            {
                _logger.LogWarning("Company with ID {Id} not found", id);
                return NotFound(new { message = $"Company with ID {id} not found" });
            }
            
            var dto = _mapper.Map<CompanyProfileDto>(company);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving company {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the company");
        }
    }

    /// <summary>
    /// Create a new company profile
    /// </summary>
    /// <param name="dto">Company profile data</param>
    /// <returns>Created company profile</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CompanyProfileDto>> Create([FromBody] CompanyProfileDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var company = _mapper.Map<CompanyProfile>(dto);
            company.CreatedAt = DateTime.UtcNow;
            
            var created = await _repository.CreateAsync(company);
            await _repository.SaveAsync();
            
            var createdDto = _mapper.Map<CompanyProfileDto>(created);
            _logger.LogInformation("Created company {Id}: {Name}", created.Id, created.CompanyName);
            
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating company");
            return StatusCode(500, "An error occurred while creating the company");
        }
    }

    /// <summary>
    /// Update an existing company profile
    /// </summary>
    /// <param name="id">Company ID</param>
    /// <param name="dto">Updated company data</param>
    /// <returns>Updated company profile</returns>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CompanyProfileDto>> Update(int id, [FromBody] CompanyProfileDto dto)
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

            var company = await _repository.GetByIdAsync(id);
            if (company == null)
            {
                _logger.LogWarning("Company with ID {Id} not found for update", id);
                return NotFound(new { message = $"Company with ID {id} not found" });
            }

            // Update existing entity properties
            _mapper.Map(dto, company);
            company.UpdatedAt = DateTime.UtcNow;
            
            // Assuming generic repository handles tracking correctly or is just a wrapper for DbContext updates
            // Since we fetched it with GetByIdAsync (tracked), modifying it and saving is enough.
            // Explicit UpdateAsync might cause issues if it tries to re-attach.
            _logger.LogInformation("Updating company properties directly regarding tracking...");
            await _repository.SaveAsync();
            
            var updatedDto = _mapper.Map<CompanyProfileDto>(company);
            _logger.LogInformation("Updated company {Id}: {Name}", company.Id, company.CompanyName);
            
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating company {Id}", id);
            return StatusCode(500, "An error occurred while updating the company");
        }
    }

    /// <summary>
    /// Delete a company profile
    /// </summary>
    /// <param name="id">Company ID</param>
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
                _logger.LogWarning("Company with ID {Id} not found for deletion", id);
                return NotFound(new { message = $"Company with ID {id} not found" });
            }

            await _repository.DeletedAsync(id);
            await _repository.SaveAsync();
            
            _logger.LogInformation("Deleted company {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting company {Id}", id);
            return StatusCode(500, "An error occurred while deleting the company");
        }
    }

    /// <summary>
    /// Get all available industries
    /// </summary>
    /// <returns>List of industries</returns>
    [HttpGet("industries")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetIndustries()
    {
        var industries = Enum.GetValues<Industry>()
            .Select(i => new
            {
                id = (int)i,
                name = i.ToString(),
                displayName = GetIndustryDisplayName(i)
            })
            .OrderBy(i => i.name);

        return Ok(industries);
    }

    private static string GetIndustryDisplayName(Industry industry)
    {
        return industry switch
        {
            Industry.Technology => "Technology & Software",
            Industry.Finance => "Finance & Banking",
            Industry.Healthcare => "Healthcare & Medical",
            Industry.Education => "Education & Training",
            Industry.Retail => "Retail & E-commerce",
            Industry.Manufacturing => "Manufacturing & Production",
            Industry.Construction => "Construction & Real Estate",
            Industry.Transportation => "Transportation & Logistics",
            Industry.Hospitality => "Hospitality & Tourism",
            Industry.Marketing => "Marketing & Advertising",
            Industry.Telecommunications => "Telecommunications",
            Industry.Energy => "Energy & Utilities",
            Industry.Agriculture => "Agriculture & Farming",
            Industry.Media => "Media & Entertainment",
            Industry.Legal => "Legal Services",
            Industry.Consulting => "Consulting & Professional Services",
            Industry.NonProfit => "Non-Profit & NGO",
            Industry.Government => "Government & Public Sector",
            Industry.Automotive => "Automotive",
            Industry.Aerospace => "Aerospace & Defense",
            Industry.Biotechnology => "Biotechnology & Pharmaceuticals",
            Industry.FoodAndBeverage => "Food & Beverage",
            Industry.Fashion => "Fashion & Apparel",
            Industry.Sports => "Sports & Recreation",
            Industry.Other => "Other",
            _ => industry.ToString()
        };
    }
}
