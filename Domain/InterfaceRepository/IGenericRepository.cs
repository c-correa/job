namespace Domain.InterfaceRepository;

public interface IGenericRepository<T> where T: class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetOneAsync();
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<int> DeletedAsync(int id);
    Task<bool> ExistAsync(int id);
    Task<int> SaveAsync();
}