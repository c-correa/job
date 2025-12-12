using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Jobs
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
    
    [StringLength(200)]
    public string? Location { get; set; }
    
    public decimal? Salary { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}