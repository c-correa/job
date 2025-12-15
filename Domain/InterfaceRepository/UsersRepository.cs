using Domain.Entities;

namespace Domain.InterfaceRepository;

public interface UsersRepository: IGenericRepository<Users>
{
    Task<IEnumerable<Users>> GetAllUsersAsync();
    Task<Users> GetOneUser();
}