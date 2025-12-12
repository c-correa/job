using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

/// <summary>
/// Represents the relationship between a candidate and their skills
/// </summary>
public class CandidateSkill
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Candidate profile ID
    /// </summary>
    [Required]
    public int CandidateProfileId { get; set; }
    
    /// <summary>
    /// Navigation property to candidate profile
    /// </summary>
    [ForeignKey(nameof(CandidateProfileId))]
    public CandidateProfile? CandidateProfile { get; set; }
    
    /// <summary>
    /// Skill from the predefined enum
    /// </summary>
    [Required]
    public Domain.Enums.Skill Skill { get; set; }
    
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
    
    /// <summary>
    /// Date when this skill was added
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
