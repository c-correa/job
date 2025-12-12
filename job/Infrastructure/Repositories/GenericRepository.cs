using Domain.InterfaceRepository;
using Job.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Job.Infra.Repositories;

/// <summary>
/// Generic repository implementation for common CRUD operations
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly AppDBContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(AppDBContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    /// <summary>
    /// Get all entities
    /// </summary>
    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    /// <summary>
    /// Get a single entity by ID
    /// </summary>
    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    /// <summary>
    /// Get one entity (first or default)
    /// </summary>
    public async Task<T?> GetOneAsync()
    {
        return await _dbSet.FirstOrDefaultAsync();
    }

    /// <summary>
    /// Create a new entity
    /// </summary>
    public async Task<T> CreateAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await SaveAsync();
        return entity;
    }

    /// <summary>
    /// Update an existing entity
    /// </summary>
    public async Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await SaveAsync();
        return entity;
    }

    /// <summary>
    /// Delete an entity by ID
    /// </summary>
    public async Task<int> DeletedAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity == null)
            return 0;

        _dbSet.Remove(entity);
        return await SaveAsync();
    }

    /// <summary>
    /// Check if an entity exists by ID
    /// </summary>
    public async Task<bool> ExistAsync(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        return entity != null;
    }

    /// <summary>
    /// Save changes to the database
    /// </summary>
    public async Task<int> SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
