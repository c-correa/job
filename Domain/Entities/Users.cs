using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Users
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
}