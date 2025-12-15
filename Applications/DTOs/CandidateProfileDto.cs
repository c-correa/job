using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

public class CandidateProfileDto
{
    [Required]
    public string Name { get; set; }
}