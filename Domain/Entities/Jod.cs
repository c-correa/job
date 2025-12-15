using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Jod
{
    [Required]
    public string Name { get; set; }
    
}