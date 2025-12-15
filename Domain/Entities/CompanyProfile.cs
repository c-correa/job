using System.ComponentModel.DataAnnotations;

namespace ApplDomain.Entities;

public class CompanyProfile
{
    [Required]
    public string Name { get; set; }
    [Required]
    public  string Email { get; set; }
}