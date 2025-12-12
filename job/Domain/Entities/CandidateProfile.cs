using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

/// <summary>
/// Represents a candidate's profile in the job platform
/// </summary>
public class CandidateProfile
{
    /// <summary>
    /// Unique identifier for the candidate profile
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// User ID associated with this candidate profile
    /// </summary>
    [Required]
    public int UserId { get; set; }
    
    /// <summary>
    /// Navigation property to the user
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public Users? User { get; set; }
    
    /// <summary>
    /// Email address
    /// </summary>
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Professional summary or bio
    /// </summary>
    [StringLength(1000, ErrorMessage = "Summary cannot exceed 1000 characters")]
    public string? Summary { get; set; }
    
    /// <summary>
    /// Years of experience
    /// </summary>
    public int? YearsOfExperience { get; set; }
    
    /// <summary>
    /// Collection of skills for this candidate
    /// </summary>
    public ICollection<CandidateSkill>? CandidateSkills { get; set; }
    
    /// <summary>
    /// Resume/CV file path or URL
    /// </summary>
    [StringLength(500)]
    public string? ResumeUrl { get; set; }
    
    /// <summary>
    /// Date when the profile was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Date when the profile was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Collection of applications submitted by this candidate
    /// </summary>
    public ICollection<Application>? Applications { get; set; }
}