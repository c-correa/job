using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

public class JodDto
{
    [Required]
    public string Name { get; set; }
    
}