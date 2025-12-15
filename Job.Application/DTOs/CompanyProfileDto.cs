using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Company Profiles
/// </summary>
public class CompanyProfileDto
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required(ErrorMessage = "Company name is required")]
    [StringLength(200)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }
    
    [Url]
    [StringLength(200)]
    public string? WebsiteUrl { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    /// <summary>
    /// Company industry sector (enum)
    /// </summary>
    public Industry? Industry { get; set; }
    
    [StringLength(300)]
    public string? Location { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}