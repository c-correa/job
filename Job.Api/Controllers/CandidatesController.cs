using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Domain.Entities;
using Domain.InterfaceRepository;
using Applications.DTOs;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Job.Infra.Persistence;

namespace Job.Controllers;

/// <summary>
/// Controller for managing candidate profiles
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CandidatesController : ControllerBase
{
    private readonly IGenericRepository<CandidateProfile> _repository;
    private readonly IGenericRepository<CandidateSkill> _skillRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CandidatesController> _logger;
    private readonly AppDBContext _context; // Add DbContext for Include queries

    public CandidatesController(
        IGenericRepository<CandidateProfile> repository,
        IGenericRepository<CandidateSkill> skillRepository,
        IMapper mapper,
        ILogger<CandidatesController> logger,
        AppDBContext context) // Inject DbContext
    {
        _repository = repository;
        _skillRepository = skillRepository;
        _mapper = mapper;
        _logger = logger;
        _context = context;
    }

    /// <summary>
    /// Get all candidates with optional skill filter
    /// </summary>
    /// <param name="skill">Optional skill filter</param>
    /// <param name="minProficiency">Minimum proficiency level (1-5)</param>
    /// <returns>List of candidates</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CandidateProfileDto>>> GetAll(
        [FromQuery] Skill? skill = null,
        [FromQuery] int? minProficiency = null)
    {
        try
        {
            // Use DbContext to include CandidateSkills navigation property
            // AsNoTracking prevents EF from tracking these entities, avoiding conflicts with UPDATE
            var candidates = await _context.CandidateProfiles
                .Include(c => c.CandidateSkills)
                .AsNoTracking() // IMPORTANT: Prevents tracking conflicts
                .ToListAsync();
            
            // Map to DTOs - Now skills will be included
            var dtos = _mapper.Map<IEnumerable<CandidateProfileDto>>(candidates);
            
            // Log to verify skills are being loaded
            _logger.LogInformation("Retrieved {Count} candidates with skills", candidates.Count);
            foreach (var candidate in candidates.Take(3)) // Log first 3 for debugging
            {
                _logger.LogInformation("Candidate {Id} has {SkillCount} skills in DB", 
                    candidate.Id, candidate.CandidateSkills?.Count ?? 0);
            }
            
            if (skill.HasValue || minProficiency.HasValue)
            {
                dtos = dtos.Where(c => c.CandidateSkills != null && c.CandidateSkills.Any(s =>
                    (!skill.HasValue || s.Skill == skill.Value) &&
                    (!minProficiency.HasValue || (s.ProficiencyLevel ?? 0) >= minProficiency.Value)
                ));
            }
            
            _logger.LogInformation("Returning {Count} candidates after filtering", dtos.Count());
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving candidates");
            return StatusCode(500, "An error occurred while retrieving candidates");
        }
    }

    /// <summary>
    /// Get a candidate by ID
    /// </summary>
    /// <param name="id">Candidate ID</param>
    /// <returns>Candidate profile</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CandidateProfileDto>> GetById(int id)
    {
        try
        {
            // Use DbContext to include skills
            var candidate = await _context.CandidateProfiles
                .Include(c => c.CandidateSkills)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);
            
            if (candidate == null)
            {
                _logger.LogWarning("Candidate with ID {Id} not found", id);
                return NotFound(new { message = $"Candidate with ID {id} not found" });
            }
            
            var dto = _mapper.Map<CandidateProfileDto>(candidate);
            _logger.LogInformation("Retrieved candidate {Id} with {SkillCount} skills", id, dto.CandidateSkills?.Count ?? 0);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving candidate {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the candidate");
        }
    }

    /// <summary>
    /// Create a new candidate profile
    /// </summary>
    /// <param name="dto">Candidate profile data</param>
    /// <returns>Created candidate profile</returns>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CandidateProfileDto>> Create([FromBody] CandidateProfileDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var candidate = _mapper.Map<CandidateProfile>(dto);
            candidate.CreatedAt = DateTime.UtcNow;
            
            // Set CreatedAt for skills
            if (candidate.CandidateSkills != null)
            {
                foreach (var skill in candidate.CandidateSkills)
                {
                    skill.CreatedAt = DateTime.UtcNow;
                }
            }
            
            var created = await _repository.CreateAsync(candidate);
            await _repository.SaveAsync();
            
            var createdDto = _mapper.Map<CandidateProfileDto>(created);
            _logger.LogInformation("Created candidate {Id}: {Email}", created.Id, created.Email);
            
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating candidate");
            return StatusCode(500, "An error occurred while creating the candidate");
        }
    }

    /// <summary>
    /// Update an existing candidate profile
    /// </summary>
    /// <param name="id">Candidate ID</param>
    /// <param name="dto">Updated candidate data</param>
    /// <returns>Updated candidate profile</returns>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CandidateProfileDto>> Update(int id, [FromBody] CandidateProfileDto dto)
    {
        try
        {
            _logger.LogInformation("🔧 UPDATE Request - ID: {Id}", id);
            
            if (id != dto.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1. Fetch existing entity WITH usage of the context (Keep tracking ON)
            var existingCandidate = await _context.CandidateProfiles
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existingCandidate == null)
            {
                _logger.LogWarning("Candidate with ID {Id} not found for update", id);
                return NotFound(new { message = $"Candidate with ID {id} not found" });
            }

            // 2. Update ONLY the fields that should be editable via this endpoint
            // We do NOT map skills here to avoid wiping them out if null in DTO
            existingCandidate.Email = dto.Email;
            existingCandidate.Summary = dto.Summary;
            existingCandidate.YearsOfExperience = dto.YearsOfExperience;
            existingCandidate.ResumeUrl = dto.ResumeUrl;
            existingCandidate.UserId = dto.UserId;
            existingCandidate.UpdatedAt = DateTime.UtcNow;

            // 3. Save changes
            await _context.SaveChangesAsync();
            
            // 4. Map back to DTO
            var updatedDto = _mapper.Map<CandidateProfileDto>(existingCandidate);
            _logger.LogInformation("Updated candidate {Id}: {Email}", existingCandidate.Id, existingCandidate.Email);
            
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating candidate {Id}", id);
            return StatusCode(500, "An error occurred while updating the candidate: " + ex.Message);
        }
    }

    /// <summary>
    /// Delete a candidate profile
    /// </summary>
    /// <param name="id">Candidate ID</param>
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
                _logger.LogWarning("Candidate with ID {Id} not found for deletion", id);
                return NotFound(new { message = $"Candidate with ID {id} not found" });
            }

            await _repository.DeletedAsync(id);
            await _repository.SaveAsync();
            
            _logger.LogInformation("Deleted candidate {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting candidate {Id}", id);
            return StatusCode(500, "An error occurred while deleting the candidate");
        }
    }

    /// <summary>
    /// Add a skill to a candidate
    /// </summary>
    /// <param name="id">Candidate ID</param>
    /// <param name="skillDto">Skill data</param>
    /// <returns>Created skill</returns>
    [HttpPost("{id}/skills")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<CandidateSkillDto>> AddSkill(int id, [FromBody] CandidateSkillDto skillDto)
    {
        try
        {
            var candidateExists = await _repository.ExistAsync(id);
            if (!candidateExists)
            {
                return NotFound(new { message = $"Candidate with ID {id} not found" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var skill = _mapper.Map<CandidateSkill>(skillDto);
            skill.CandidateProfileId = id;
            skill.CreatedAt = DateTime.UtcNow;
            
            var created = await _skillRepository.CreateAsync(skill);
            await _skillRepository.SaveAsync();
            
            var createdDto = _mapper.Map<CandidateSkillDto>(created);
            _logger.LogInformation("Added skill {Skill} to candidate {Id}", skill.Skill, id);
            
            return CreatedAtAction(nameof(GetById), new { id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding skill to candidate {Id}", id);
            return StatusCode(500, "An error occurred while adding the skill");
        }
    }

    /// <summary>
    /// Remove a skill from a candidate
    /// </summary>
    /// <param name="id">Candidate ID</param>
    /// <param name="skillId">CandidateSkill ID (Database PK)</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}/skills/{skillId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSkill(int id, int skillId)
    {
        try
        {
            _logger.LogInformation("🗑️ DELETE Skill Request - CandidateId: {Id}, SkillId: {SkillId}", id, skillId);

            // Verify candidate exists
            var candidateExists = await _repository.ExistAsync(id);
            if (!candidateExists)
            {
                _logger.LogWarning("❌ Candidate {Id} not found", id);
                return NotFound(new { message = $"Candidate with ID {id} not found" });
            }

            // Verify skill exists via Context directly to be sure
            var skill = await _context.CandidateSkills.FindAsync(skillId);
             
            if (skill == null)
            {
                 _logger.LogWarning("❌ Skill {SkillId} not found in DB", skillId);
                 return NotFound(new { message = $"Skill with ID {skillId} not found" });
            }

            _logger.LogInformation("✅ Found skill {SkillId}, belonging to candidate {CandidateId}", skillId, skill.CandidateProfileId);

            if (skill.CandidateProfileId != id)
            {
                _logger.LogWarning("❌ Skill {SkillId} belongs to candidate {OwnerId}, not {ReqId}", skillId, skill.CandidateProfileId, id);
                return BadRequest(new { message = "Skill does not belong to this candidate" });
            }

            // Delete directly via context
            _context.CandidateSkills.Remove(skill);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("✅ Successfully deleted skill {SkillId}", skillId);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting skill from candidate {Id}", id);
            return StatusCode(500, "An error occurred while deleting the skill");
        }
    }

    /// <summary>
    /// Get all available skills
    /// </summary>
    /// <returns>List of skills organized by category</returns>
    [HttpGet("skills")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetSkills()
    {
        var skills = new
        {
            programmingLanguages = GetSkillsByRange(1, 10, "Programming Languages"),
            frontend = GetSkillsByRange(20, 24, "Frontend Technologies"),
            backend = GetSkillsByRange(30, 34, "Backend Technologies"),
            databases = GetSkillsByRange(40, 45, "Databases"),
            cloudDevOps = GetSkillsByRange(50, 56, "Cloud & DevOps"),
            mobile = GetSkillsByRange(60, 63, "Mobile Development"),
            dataAI = GetSkillsByRange(70, 74, "Data & AI"),
            design = GetSkillsByRange(80, 83, "Design"),
            projectManagement = GetSkillsByRange(90, 93, "Project Management"),
            softSkills = GetSkillsByRange(100, 104, "Soft Skills"),
            business = GetSkillsByRange(110, 114, "Business"),
            other = new[] { new { id = 999, name = "Other", displayName = "Other Skills" } }
        };

        return Ok(skills);
    }

    private static object[] GetSkillsByRange(int start, int end, string category)
    {
        return Enum.GetValues<Skill>()
            .Where(s => (int)s >= start && (int)s <= end)
            .Select(s => new
            {
                id = (int)s,
                name = s.ToString(),
                displayName = GetSkillDisplayName(s),
                category
            })
            .ToArray();
    }

    private static string GetSkillDisplayName(Skill skill)
    {
        return skill switch
        {
            Skill.CSharp => "C#",
            Skill.CPlusPlus => "C++",
            Skill.JavaScript => "JavaScript",
            Skill.TypeScript => "TypeScript",
            Skill.DotNet => ".NET",
            Skill.NodeJS => "Node.js",
            Skill.PostgreSQL => "PostgreSQL",
            Skill.MySQL => "MySQL",
            Skill.MongoDB => "MongoDB",
            Skill.SQLServer => "SQL Server",
            Skill.AWS => "Amazon Web Services (AWS)",
            Skill.Azure => "Microsoft Azure",
            Skill.GCP => "Google Cloud Platform (GCP)",
            Skill.CICD => "CI/CD Pipelines",
            Skill.ReactNative => "React Native",
            Skill.MachineLearning => "Machine Learning",
            Skill.AI => "Artificial Intelligence",
            Skill.DataAnalysis => "Data Analysis",
            Skill.DataScience => "Data Science",
            Skill.BigData => "Big Data",
            Skill.UIUXDesign => "UI/UX Design",
            Skill.GraphicDesign => "Graphic Design",
            Skill.ProjectManagement => "Project Management",
            Skill.ProductManagement => "Product Management",
            Skill.ProblemSolving => "Problem Solving",
            Skill.CriticalThinking => "Critical Thinking",
            Skill.BusinessAnalysis => "Business Analysis",
            Skill.CustomerService => "Customer Service",
            Skill.FinancialAnalysis => "Financial Analysis",
            _ => skill.ToString()
        };
    }
}
