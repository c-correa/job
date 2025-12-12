using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Job.Infra.Persistence;

namespace Job.API.Controllers;

/// <summary>
/// Controller for testing database connectivity
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly AppDBContext _context;
    private readonly ILogger<DatabaseController> _logger;

    public DatabaseController(AppDBContext context, ILogger<DatabaseController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Test database connection
    /// </summary>
    /// <returns>Connection status</returns>
    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            
            if (canConnect)
            {
                var connection = _context.Database.GetDbConnection();
                
                return Ok(new
                {
                    success = true,
                    message = "Database connection successful",
                    database = connection.Database,
                    server = connection.DataSource,
                    timestamp = DateTime.UtcNow
                });
            }
            
            return StatusCode(500, new
            {
                success = false,
                message = "Failed to connect to database",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing database connection");
            
            return StatusCode(500, new
            {
                success = false,
                message = "Database connection error",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get database information
    /// </summary>
    /// <returns>Database info</returns>
    [HttpGet("info")]
    public async Task<IActionResult> GetDatabaseInfo()
    {
        try
        {
            var connection = _context.Database.GetDbConnection();
            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();
            var appliedMigrations = await _context.Database.GetAppliedMigrationsAsync();
            
            return Ok(new
            {
                database = connection.Database,
                server = connection.DataSource,
                provider = _context.Database.ProviderName,
                appliedMigrations = appliedMigrations.ToList(),
                pendingMigrations = pendingMigrations.ToList(),
                hasPendingMigrations = pendingMigrations.Any(),
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting database info");
            
            return StatusCode(500, new
            {
                success = false,
                message = "Error getting database info",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }

    /// <summary>
    /// Get table counts
    /// </summary>
    /// <returns>Count of records in each table</returns>
    [HttpGet("table-counts")]
    public async Task<IActionResult> GetTableCounts()
    {
        try
        {
            var counts = new
            {
                users = await _context.Users.CountAsync(),
                jobs = await _context.Jobs.CountAsync(),
                candidateProfiles = await _context.CandidateProfiles.CountAsync(),
                companyProfiles = await _context.CompanyProfiles.CountAsync(),
                applications = await _context.Applications.CountAsync(),
                timestamp = DateTime.UtcNow
            };
            
            return Ok(counts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting table counts");
            
            return StatusCode(500, new
            {
                success = false,
                message = "Error getting table counts",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
