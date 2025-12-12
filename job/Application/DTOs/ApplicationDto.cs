using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Applications
/// </summary>
public class ApplicationDto
{
    public int Id { get; set; }
    
    [Required]
    public int JobId { get; set; }
    
    public string? JobTitle { get; set; }
    
    [Required]
    public int CandidateProfileId { get; set; }
    
    public string? CandidateName { get; set; }
    
    [StringLength(1000)]
    public string? CoverLetter { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "Pending";
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}