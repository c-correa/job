namespace Domain.Enums;

/// <summary>
/// Represents the work modality of a job
/// </summary>
public enum WorkModality
{
    /// <summary>
    /// Work from office
    /// </summary>
    OnSite = 1,
    
    /// <summary>
    /// Fully remote work
    /// </summary>
    Remote = 2,
    
    /// <summary>
    /// Mix of remote and on-site work
    /// </summary>
    Hybrid = 3
}
