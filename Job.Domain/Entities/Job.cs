using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// Represents a job posting/vacancy in the system
/// </summary>
public class Job
{
    /// <summary>
    /// Unique identifier for the job
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Job title
    /// </summary>
    [Required(ErrorMessage = "Job title is required")]
    [StringLength(200, ErrorMessage = "Job title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// Job description
    /// </summary>
    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }
    
    /// <summary>
    /// Company profile ID that posted this job
    /// </summary>
    [Required]
    public int CompanyProfileId { get; set; }
    
    /// <summary>
    /// Navigation property to the company profile
    /// </summary>
    [ForeignKey(nameof(CompanyProfileId))]
    public CompanyProfile? CompanyProfile { get; set; }
    
    /// <summary>
    /// Job location (city, country, or "Remote")
    /// </summary>
    [StringLength(300)]
    public string? Location { get; set; }
    
    /// <summary>
    /// Type of employment (Full-time, Part-time, Contract, etc.)
    /// </summary>
    public JobType? JobType { get; set; }
    
    /// <summary>
    /// Required experience level for the position
    /// </summary>
    public ExperienceLevel? ExperienceLevel { get; set; }
    
    /// <summary>
    /// Salary range or amount
    /// </summary>
    [Column(TypeName = "decimal(18,2)")]
    public decimal? Salary { get; set; }
    
    /// <summary>
    /// Required skills for this job (comma-separated or JSON)
    /// </summary>
    [StringLength(1000)]
    public string? RequiredSkills { get; set; }
    
    /// <summary>
    /// Whether the job is currently active and accepting applications
    /// </summary>
    public bool IsActive { get; set; } = true;
    
    /// <summary>
    /// Date when the job was posted
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Date when the job was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Collection of applications for this job
    /// </summary>
    public ICollection<Application>? Applications { get; set; }

    /// <summary>
    /// Work modality (Remote, OnSite, Hybrid)
    /// </summary>
    public WorkModality? WorkModality { get; set; }

    /// <summary>
    /// Structured collection of required skills
    /// </summary>
    public ICollection<JobSkill>? JobSkills { get; set; }
}