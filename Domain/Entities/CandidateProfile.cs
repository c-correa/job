using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class CandidateProfile
{
    [Required]
    public string Name { get; set; }
}