using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Applications.DTOs;

/// <summary>
/// DTO for Job Skills
/// </summary>
public class JobSkillDto
{
    public int Id { get; set; }
    
    [Required]
    public Skill Skill { get; set; }
    
    public string SkillName => Skill.ToString();
    
    [Range(1, 5)]
    public int? MinProficiencyLevel { get; set; }
    
    public bool IsMandatory { get; set; } = true;
}
