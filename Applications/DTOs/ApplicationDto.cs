using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

public class ApplicationDto
{
    [Required]
    public string Name { get; set; }
    
}