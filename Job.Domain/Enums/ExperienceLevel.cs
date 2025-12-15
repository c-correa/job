namespace Domain.Enums;

/// <summary>
/// Represents the experience level required for a job
/// </summary>
public enum ExperienceLevel
{
    /// <summary>
    /// Entry level or junior position (0-2 years)
    /// </summary>
    Junior = 1,
    
    /// <summary>
    /// Mid-level position (2-5 years)
    /// </summary>
    MidLevel = 2,
    
    /// <summary>
    /// Senior level position (5-10 years)
    /// </summary>
    Senior = 3,
    
    /// <summary>
    /// Lead or principal level (10+ years)
    /// </summary>
    Lead = 4,
    
    /// <summary>
    /// No experience required
    /// </summary>
    NoExperience = 5
}
