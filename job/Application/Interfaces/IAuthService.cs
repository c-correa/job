using Applications.DTOs;

namespace Applications.Interfaces;

/// <summary>
/// Interface for authentication service
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Authenticate user and generate JWT token
    /// </summary>
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    
    /// <summary>
    /// Register a new user
    /// </summary>
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    
    /// <summary>
    /// Validate JWT token
    /// </summary>
    bool ValidateToken(string token);
}
