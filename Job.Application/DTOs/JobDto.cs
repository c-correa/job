using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Jobs/Vacancies
/// </summary>
public class JobDto
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Job title is required")]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    public int CompanyProfileId { get; set; }
    
    public string? CompanyName { get; set; }
    
    [StringLength(300)]
    public string? Location { get; set; }
    
    public JobType? JobType { get; set; }
    
    public ExperienceLevel? ExperienceLevel { get; set; }
    
    public decimal? Salary { get; set; }
    
    [StringLength(1000)]
    public string? RequiredSkills { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public WorkModality? WorkModality { get; set; }
    
    public List<JobSkillDto>? JobSkills { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}