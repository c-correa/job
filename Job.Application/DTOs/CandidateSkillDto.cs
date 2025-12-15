using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Candidate Skills
/// </summary>
public class CandidateSkillDto
{
    public int Id { get; set; }
    
    [Required]
    public int CandidateProfileId { get; set; }
    
    /// <summary>
    /// Skill from predefined enum
    /// </summary>
    [Required(ErrorMessage = "Skill is required")]
    public Skill Skill { get; set; }
    
    /// <summary>
    /// Proficiency level (1-5, where 5 is expert)
    /// </summary>
    [Range(1, 5, ErrorMessage = "Proficiency level must be between 1 and 5")]
    public int? ProficiencyLevel { get; set; }
    
    /// <summary>
    /// Years of experience with this skill
    /// </summary>
    [Range(0, 50, ErrorMessage = "Years of experience must be between 0 and 50")]
    public int? YearsOfExperience { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
