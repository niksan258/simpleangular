using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using simpleapp.Data.DbContexts;
using simpleapp.Data.Models;
using Microsoft.AspNetCore.Authorization;
using simpleapp.Auth.Interfaces;
using simpleapp.Data.DTOs.User;

namespace simpleapp.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext dbContext;
    private readonly IPasswordHasher<User> passwordHasher;
    private readonly IUserValidator userValidator;
    private readonly IJWTService jwtService;


    public AuthController(AppDbContext dbContext,
                          IPasswordHasher<User> passwordHasher, 
                          IConfiguration configuration, 
                          IUserValidator userValidator,
                          IJWTService jwtService)
    {
        this.dbContext = dbContext;
        this.passwordHasher = passwordHasher;
        this.userValidator = userValidator;
        this.jwtService = jwtService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegistrationRequest userDto)
    {
        if (!userValidator.IsValid(userDto))
        {
            return BadRequest(new { Message = "Invalid user data." });
        }

        var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (existingUser is not null)
        {
            return Conflict(new { Message = "Email is already taken." });
        }

        var user = new User()
        {
            Email = userDto.Email,
            FullName = userDto.FullName,
        };
        user.PasswordHash = passwordHasher.HashPassword(user, userDto.Password);

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Ok(new { Message = "User registered successfully." });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest userDto)
    {
        if (!userValidator.IsValid(userDto))
        {
            return BadRequest(new { Message = "Invalid login data." });
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (user is null || passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userDto.Password) 
                            != PasswordVerificationResult.Success)
        {
            return Unauthorized(new { Message = "Invalid email or password." });
        }


        var token = jwtService.generateJWT(user);

        return Ok(new { Message = "Login successful.", Token = token });
    }
}
