namespace Domain.InterfaceRepository;

/// <summary>
/// Generic repository interface for common CRUD operations
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IGenericRepository<T> where T: class
{
    /// <summary>
    /// Get all entities
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync();
    
    /// <summary>
    /// Get a single entity by ID
    /// </summary>
    Task<T?> GetByIdAsync(int id);
    
    /// <summary>
    /// Get one entity (first or default)
    /// </summary>
    Task<T?> GetOneAsync();
    
    /// <summary>
    /// Create a new entity
    /// </summary>
    Task<T> CreateAsync(T entity);
    
    /// <summary>
    /// Update an existing entity
    /// </summary>
    Task<T> UpdateAsync(T entity);
    
    /// <summary>
    /// Delete an entity by ID
    /// </summary>
    Task<int> DeletedAsync(int id);
    
    /// <summary>
    /// Check if an entity exists by ID
    /// </summary>
    Task<bool> ExistAsync(int id);
    
    /// <summary>
    /// Save changes to the database
    /// </summary>
    Task<int> SaveAsync();
}