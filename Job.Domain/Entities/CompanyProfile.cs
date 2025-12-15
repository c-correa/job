using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// Represents a company's profile in the job platform
/// </summary>
public class CompanyProfile
{
    /// <summary>
    /// Unique identifier for the company profile
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    /// <summary>
    /// User ID associated with this company profile
    /// </summary>
    [Required]
    public int UserId { get; set; }
    
    /// <summary>
    /// Navigation property to the user
    /// </summary>
    [ForeignKey(nameof(UserId))]
    public Users? User { get; set; }
    
    /// <summary>
    /// Company name
    /// </summary>
    [Required(ErrorMessage = "Company name is required")]
    [StringLength(200, ErrorMessage = "Company name cannot exceed 200 characters")]
    public string CompanyName { get; set; } = string.Empty;
    
    /// <summary>
    /// Company email address
    /// </summary>
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Company phone number
    /// </summary>
    [Phone(ErrorMessage = "Invalid phone number format")]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }
    
    /// <summary>
    /// Company website URL
    /// </summary>
    [Url(ErrorMessage = "Invalid URL format")]
    [StringLength(200)]
    public string? WebsiteUrl { get; set; }
    
    /// <summary>
    /// Company description
    /// </summary>
    [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }
    
    /// <summary>
    /// Company industry sector
    /// </summary>
    public Industry? Industry { get; set; }

    
    /// <summary>
    /// Company location/address
    /// </summary>
    [StringLength(300)]
    public string? Location { get; set; }
    
    /// <summary>
    /// Date when the profile was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Date when the profile was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Collection of jobs posted by this company
    /// </summary>
    public ICollection<Job>? Jobs { get; set; }
}