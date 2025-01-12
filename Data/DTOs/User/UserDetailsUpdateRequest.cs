using simpleapp.Data.DTOs.User.Base;

namespace simpleapp.Data.DTOs.User
{
    public class UserDetailsUpdateRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}
