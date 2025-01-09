using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using simpleapp.Data.DTOs;
using simpleapp.Data.DbContexts;
using simpleapp.Data.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;

namespace simpleapp.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext dbContext;
    private readonly IPasswordHasher<User> passwordHasher;
    private readonly IConfiguration configuration;


    public AuthController(AppDbContext dbContext, IPasswordHasher<User> passwordHasher, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.passwordHasher = passwordHasher;
        this.configuration = configuration;
    }

    [Authorize]
    [HttpGet("authtest")]
    public IActionResult AuthTest()
    {
        return Ok("Authenticated successfully!");
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDTO userDto)
    {
        if (userDto == null || string.IsNullOrWhiteSpace(userDto.Email) || string.IsNullOrWhiteSpace(userDto.Password))
        {
            return BadRequest(new { Message = "Invalid user data." });
        }

        var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (existingUser != null)
        {
            return Conflict(new { Message = "Email is already taken." });
        }

        var user = new User()
        {
            Email = userDto.Email,
        };
        user.PasswordHash = passwordHasher.HashPassword(user, userDto.Password);


        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Ok(new { Message = "User registered successfully." });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDTO userDto)
    {
        if (!IsUserValid(userDto))
        {
            return BadRequest(new { Message = "Invalid login data." });
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (user == null || passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userDto.Password) 
                            != PasswordVerificationResult.Success)
        {
            return Unauthorized(new { Message = "Invalid email or password." });
        }


        var token = generateJWT(user);

        return Ok(new { Message = "Login successful.", Token = token });
    }

    private string generateJWT(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        { 
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
        };

        var token = new JwtSecurityToken(configuration["Jwt:Issuer"], 
                                         configuration["Jwt:Audience"], 
                                         claims, 
                                         null, 
                                         DateTime.Now.AddHours(1), 
                                         credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static bool IsUserValid(UserDTO user)
    {
        return user is not null 
            && user.Email is not null && new EmailAddressAttribute().IsValid(user.Email)
            && user.Password is not null && user.Password.Length >= 8;
    }
}
