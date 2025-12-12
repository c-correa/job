using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Domain.Entities;
using Domain.InterfaceRepository;
using Applications.DTOs;

namespace Job.Controllers;

/// <summary>
/// Controller for managing users
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IGenericRepository<Users> _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IGenericRepository<Users> repository,
        IMapper mapper,
        ILogger<UsersController> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    /// <returns>List of users</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UsersDto>>> GetAll()
    {
        try
        {
            var users = await _repository.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<UsersDto>>(users);
            
            _logger.LogInformation("Retrieved {Count} users", dtos.Count());
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, "An error occurred while retrieving users");
        }
    }

    /// <summary>
    /// Get a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UsersDto>> GetById(int id)
    {
        try
        {
            var user = await _repository.GetByIdAsync(id);
            
            if (user == null)
            {
                _logger.LogWarning("User with ID {Id} not found", id);
                return NotFound(new { message = $"User with ID {id} not found" });
            }
            
            var dto = _mapper.Map<UsersDto>(user);
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {Id}", id);
            return StatusCode(500, "An error occurred while retrieving the user");
        }
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="dto">User data</param>
    /// <returns>Created user</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UsersDto>> Create([FromBody] UsersDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if username already exists
            var existingUsers = await _repository.GetAllAsync();
            if (existingUsers.Any(u => u.Username == dto.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Check if email already exists
            if (!string.IsNullOrEmpty(dto.Email) && existingUsers.Any(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var user = _mapper.Map<Users>(dto);
            user.CreatedAt = DateTime.UtcNow;
            
            // TODO: Hash password before saving (use a proper password hashing library like BCrypt)
            // user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            
            var created = await _repository.CreateAsync(user);
            await _repository.SaveAsync();
            
            var createdDto = _mapper.Map<UsersDto>(created);
            // Don't return password in response
            createdDto.Password = null;
            
            _logger.LogInformation("Created user {Id}: {Username}", created.Id, created.Username);
            
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, createdDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, "An error occurred while creating the user");
        }
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="dto">Updated user data</param>
    /// <returns>Updated user</returns>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UsersDto>> Update(int id, [FromBody] UsersDto dto)
    {
        try
        {
            if (id != dto.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var exists = await _repository.ExistAsync(id);
            if (!exists)
            {
                _logger.LogWarning("User with ID {Id} not found for update", id);
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            var user = _mapper.Map<Users>(dto);
            user.UpdatedAt = DateTime.UtcNow;
            
            // TODO: If password is being updated, hash it
            // if (!string.IsNullOrEmpty(dto.Password))
            // {
            //     user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            // }
            
            var updated = await _repository.UpdateAsync(user);
            await _repository.SaveAsync();
            
            var updatedDto = _mapper.Map<UsersDto>(updated);
            // Don't return password in response
            updatedDto.Password = null;
            
            _logger.LogInformation("Updated user {Id}: {Username}", updated.Id, updated.Username);
            
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {Id}", id);
            return StatusCode(500, "An error occurred while updating the user");
        }
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>No content</returns>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var exists = await _repository.ExistAsync(id);
            if (!exists)
            {
                _logger.LogWarning("User with ID {Id} not found for deletion", id);
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            await _repository.DeletedAsync(id);
            await _repository.SaveAsync();
            
            _logger.LogInformation("Deleted user {Id}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {Id}", id);
            return StatusCode(500, "An error occurred while deleting the user");
        }
    }

    /// <summary>
    /// Check if username is available
    /// </summary>
    /// <param name="username">Username to check</param>
    /// <returns>Availability status</returns>
    [HttpGet("check-username/{username}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<object>> CheckUsername(string username)
    {
        try
        {
            var users = await _repository.GetAllAsync();
            var exists = users.Any(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
            
            return Ok(new { username, available = !exists });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking username availability");
            return StatusCode(500, "An error occurred while checking username");
        }
    }
}
