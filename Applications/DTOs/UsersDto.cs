using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

public class UsersDto
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
}