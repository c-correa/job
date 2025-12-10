using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Application
{
    [Required]
    public string Name { get; set; }
}