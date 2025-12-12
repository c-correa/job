using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

/// <summary>
/// Represents a job application submitted by a candidate
/// </summary>
public class Application
{
    /// <summary>
    /// Unique identifier for the application
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Job ID that this application is for
    /// </summary>
    [Required]
    public int JobId { get; set; }
    
    /// <summary>
    /// Navigation property to the job
    /// </summary>
    [ForeignKey(nameof(JobId))]
    public Job? Job { get; set; }
    
    /// <summary>
    /// Candidate profile ID who submitted this application
    /// </summary>
    [Required]
    public int CandidateProfileId { get; set; }
    
    /// <summary>
    /// Navigation property to the candidate profile
    /// </summary>
    [ForeignKey(nameof(CandidateProfileId))]
    public CandidateProfile? CandidateProfile { get; set; }
    
    /// <summary>
    /// Cover letter or application message
    /// </summary>
    [StringLength(1000, ErrorMessage = "Cover letter cannot exceed 1000 characters")]
    public string? CoverLetter { get; set; }
    
    /// <summary>
    /// Application status (e.g., Pending, Reviewed, Accepted, Rejected)
    /// </summary>
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "Pending";
    
    /// <summary>
    /// Date when the application was submitted
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Date when the application was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}