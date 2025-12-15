using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Users
/// </summary>
public class UsersDto
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Password is required")]
    [StringLength(255)]
    public string Password { get; set; } = string.Empty;
    
    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}