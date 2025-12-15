namespace Domain.Enums;

/// <summary>
/// Represents the type/modality of a job
/// </summary>
public enum JobType
{
    /// <summary>
    /// Full-time employment position
    /// </summary>
    FullTime = 1,
    
    /// <summary>
    /// Part-time employment position
    /// </summary>
    PartTime = 2,
    
    /// <summary>
    /// Contract-based position
    /// </summary>
    Contract = 3,
    
    /// <summary>
    /// Temporary employment
    /// </summary>
    Temporary = 4,
    
    /// <summary>
    /// Internship or trainee position
    /// </summary>
    Internship = 5,
    
    /// <summary>
    /// Freelance or project-based work
    /// </summary>
    Freelance = 6
}
