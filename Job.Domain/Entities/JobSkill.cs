using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

/// <summary>
/// Represents a specific skill required for a job
/// </summary>
public class JobSkill
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// Job ID
    /// </summary>
    [Required]
    public int JobId { get; set; }
    
    /// <summary>
    /// Navigation property to the job
    /// </summary>
    [ForeignKey(nameof(JobId))]
    public Job? Job { get; set; }
    
    /// <summary>
    /// Skill from the predefined enum
    /// </summary>
    [Required]
    public Domain.Enums.Skill Skill { get; set; }
    
    /// <summary>
    /// Minimum proficiency level required (1-5)
    /// </summary>
    [Range(1, 5, ErrorMessage = "Proficiency level must be between 1 and 5")]
    public int? MinProficiencyLevel { get; set; }
    
    /// <summary>
    /// Whether this skill is mandatory or optional
    /// </summary>
    public bool IsMandatory { get; set; } = true;
}
