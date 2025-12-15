using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Applications.DTOs;
using Applications.Interfaces;

namespace Job.Controllers;

/// <summary>
/// Controller for authentication operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Login with username and password
    /// </summary>
    /// <param name="loginDto">Login credentials</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(loginDto);

            if (result == null)
            {
                _logger.LogWarning("Failed login attempt for username: {Username}", loginDto.Username);
                return Unauthorized(new { message = "Invalid username or password" });
            }

            _logger.LogInformation("User {Username} logged in successfully", loginDto.Username);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for username: {Username}", loginDto.Username);
            return StatusCode(500, "An error occurred during login");
        }
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="registerDto">Registration data</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(registerDto);

            if (result == null)
            {
                _logger.LogWarning("Registration failed for username: {Username}", registerDto.Username);
                return BadRequest(new { message = "Username or email already exists" });
            }

            _logger.LogInformation("User {Username} registered successfully", registerDto.Username);
            return CreatedAtAction(nameof(Login), new { username = result.Username }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for username: {Username}", registerDto.Username);
            return StatusCode(500, "An error occurred during registration");
        }
    }

    /// <summary>
    /// Validate JWT token
    /// </summary>
    /// <param name="token">JWT token to validate</param>
    /// <returns>Validation result</returns>
    [HttpPost("validate")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult ValidateToken([FromBody] string token)
    {
        try
        {
            var isValid = _authService.ValidateToken(token);
            return Ok(new { valid = isValid });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return Ok(new { valid = false });
        }
    }

    /// <summary>
    /// Get current authenticated user information
    /// </summary>
    /// <returns>Current user information</returns>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            return Ok(new
            {
                userId = userId,
                username = username,
                email = email
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, "An error occurred");
        }
    }
}
