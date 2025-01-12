using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using simpleapp.Data.DbContexts;
using Microsoft.EntityFrameworkCore;
using simpleapp.Data.DTOs.User;
using simpleapp.Auth.Interfaces;
using Microsoft.AspNetCore.Identity;
using simpleapp.Data.Models;
using static Humanizer.In;

namespace simpleapp.Controllers
{
    [ApiController]
    [Route("/users")]
    public class UserController : Controller
    {
        private readonly AppDbContext dbContext;
        private readonly IUserValidator userValidator;
        private readonly IPasswordHasher<User> passwordHasher;


        public UserController(AppDbContext dbContext, IUserValidator userValidator, IPasswordHasher<User> passwordHasher) 
        {
            this.dbContext = dbContext;
            this.userValidator = userValidator;
            this.passwordHasher = passwordHasher;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserDetails()
        {
            var userId = GetUserIdFromToken();

            if  (userId is null)
            {
                return Unauthorized("Invalid token.");
            }

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user is null)
            {
                return NotFound("User not found.");
            }

            return Ok(new UserDetailsResponse() { Email = user.Email, FullName = user.FullName });
        }

        [Authorize]
        [HttpPost("me")]
        public async Task<IActionResult> UpdateCurrentUserDetailsl([FromBody] UserDetailsUpdateRequest userDto)
        {
            if (!userValidator.IsValid(userDto))
                return BadRequest(new { Message = "Invalid user data." });

            var userId = GetUserIdFromToken();

            if (userId is null)
                return Unauthorized("Invalid token.");

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (existingUser is null)
                return Unauthorized(new { Message = "Invalid token." });

            if(!existingUser.Email.Equals(userDto.Email) && dbContext.Users.Any(user => user.Email.Equals(userDto.Email)))
                return Conflict(new { Message = "Email is already taken." });

            existingUser.Email = userDto.Email;
            existingUser.FullName = userDto.FullName;

            if(userDto.Password is not null)
                existingUser.PasswordHash = passwordHasher.HashPassword(existingUser, userDto.Password);

            await dbContext.SaveChangesAsync();

            return Ok(new { Message = "Updated successfully."});
        }



        private string? GetUserIdFromToken()
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadToken(token) as JwtSecurityToken;

            var userIdClaim = jwtToken?.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);

            return userIdClaim?.Value;
        }
    }
}
