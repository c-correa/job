using Microsoft.EntityFrameworkCore;

namespace Job.Infra.Persistence;

public class AppDBContext: DbContext
{

    public AppDBContext(DbContextOptions options) : base(options)
    {
        
    }
    
    public BbSet<Entidad>Entidad { get; set; };
}