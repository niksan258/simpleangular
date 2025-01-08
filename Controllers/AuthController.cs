using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using simpleapp.Data.DTOs;
using simpleapp.Data.DbContexts;
using simpleapp.Data.Models;

namespace simpleapp.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext dbContext;
    private readonly IPasswordHasher<User> passwordHasher;


    public AuthController(AppDbContext dbContext, IPasswordHasher<User> passwordHasher)
    {
        this.dbContext = dbContext;
        this.passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDTO userDto)
    {
        if (userDto == null || string.IsNullOrWhiteSpace(userDto.Email) || string.IsNullOrWhiteSpace(userDto.Password))
        {
            return BadRequest("Invalid user data.");
        }

        var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (existingUser != null)
        {
            return Conflict("Email is already taken.");
        }

        var user = new User()
        {
            Email = userDto.Email,
        };
        user.PasswordHash = passwordHasher.HashPassword(user, userDto.Password);


        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDTO userDto)
    {
        if (userDto == null || string.IsNullOrWhiteSpace(userDto.Email) || string.IsNullOrWhiteSpace(userDto.Password))
        {
            return BadRequest("Invalid login data.");
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userDto.Password);
        if (passwordVerificationResult != PasswordVerificationResult.Success)
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = "test";

        return Ok(new { Message = "Login successful.", Token = token });
    }
}
