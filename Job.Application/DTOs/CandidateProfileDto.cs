using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Candidate Profiles
/// </summary>
public class CandidateProfileDto
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Summary { get; set; }
    
    public int? YearsOfExperience { get; set; }
    
    /// <summary>
    /// Collection of candidate skills
    /// </summary>
    public List<CandidateSkillDto>? CandidateSkills { get; set; }
    
    [StringLength(500)]
    public string? ResumeUrl { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}