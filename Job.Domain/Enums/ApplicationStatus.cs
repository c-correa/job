namespace Domain.Enums;

/// <summary>
/// Represents the status of a job application
/// </summary>
public enum ApplicationStatus
{
    /// <summary>
    /// Application has been submitted and is awaiting review
    /// </summary>
    Pending = 1,
    
    /// <summary>
    /// Application is currently being reviewed by the employability team
    /// </summary>
    UnderReview = 2,
    
    /// <summary>
    /// Candidate has been shortlisted for further consideration
    /// </summary>
    Shortlisted = 3,
    
    /// <summary>
    /// Candidate has been invited for an interview
    /// </summary>
    InterviewScheduled = 4,
    
    /// <summary>
    /// Application has been accepted
    /// </summary>
    Accepted = 5,
    
    /// <summary>
    /// Application has been rejected
    /// </summary>
    Rejected = 6,
    
    /// <summary>
    /// Candidate has withdrawn their application
    /// </summary>
    Withdrawn = 7
}
