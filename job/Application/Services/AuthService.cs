using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Applications.DTOs;
using Applications.Interfaces;
using Domain.Entities;
using Domain.InterfaceRepository;

namespace Applications.Services;

/// <summary>
/// Service for handling authentication operations
/// </summary>
public class AuthService : IAuthService
{
    private readonly IGenericRepository<Users> _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IGenericRepository<Users> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    /// <summary>
    /// Authenticate user and generate JWT token
    /// </summary>
    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        // Find user by username
        var users = await _userRepository.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Username == loginDto.Username);

        if (user == null)
        {
            return null; // User not found
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
        {
            return null; // Invalid password
        }

        // Generate JWT token
        var token = GenerateJwtToken(user);
        var expirationMinutes = _configuration.GetValue<int>("JwtSettings:ExpirationMinutes");

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
        };
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        // Check if username already exists
        var users = await _userRepository.GetAllAsync();
        if (users.Any(u => u.Username == registerDto.Username))
        {
            return null; // Username already exists
        }

        // Check if email already exists
        if (!string.IsNullOrEmpty(registerDto.Email) && 
            users.Any(u => u.Email == registerDto.Email))
        {
            return null; // Email already exists
        }

        // Hash password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        // Create new user
        var newUser = new Users
        {
            Username = registerDto.Username,
            Password = hashedPassword,
            Email = registerDto.Email,
            CreatedAt = DateTime.UtcNow
        };

        var createdUser = await _userRepository.CreateAsync(newUser);
        await _userRepository.SaveAsync();

        // Generate JWT token
        var token = GenerateJwtToken(createdUser);
        var expirationMinutes = _configuration.GetValue<int>("JwtSettings:ExpirationMinutes");

        return new AuthResponseDto
        {
            Token = token,
            Username = createdUser.Username,
            Email = createdUser.Email,
            UserId = createdUser.Id,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
        };
    }

    /// <summary>
    /// Validate JWT token
    /// </summary>
    public bool ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Generate JWT token for user
    /// </summary>
    private string GenerateJwtToken(Users user)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        var expirationMinutes = _configuration.GetValue<int>("JwtSettings:ExpirationMinutes");

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
