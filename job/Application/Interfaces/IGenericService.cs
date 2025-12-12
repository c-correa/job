namespace Application.Interfaces;

/// <summary>
/// Generic service interface for business logic operations
/// </summary>
/// <typeparam name="TDto">DTO type</typeparam>
public interface IGenericService<TDto> where TDto : class
{
    /// <summary>
    /// Get all entities as DTOs
    /// </summary>
    Task<IEnumerable<TDto>> GetAllAsync();
    
    /// <summary>
    /// Get a single entity by ID as DTO
    /// </summary>
    Task<TDto?> GetByIdAsync(int id);
    
    /// <summary>
    /// Create a new entity from DTO
    /// </summary>
    Task<TDto> CreateAsync(TDto dto);
    
    /// <summary>
    /// Update an existing entity from DTO
    /// </summary>
    Task<TDto> UpdateAsync(int id, TDto dto);
    
    /// <summary>
    /// Delete an entity by ID
    /// </summary>
    Task<bool> DeleteAsync(int id);
    
    /// <summary>
    /// Check if an entity exists by ID
    /// </summary>
    Task<bool> ExistsAsync(int id);
}
