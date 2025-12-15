using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

public class CompanyProfileDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public  string Email { get; set; }
}