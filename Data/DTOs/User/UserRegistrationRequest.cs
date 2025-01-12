using simpleapp.Data.DTOs.User.Base;

namespace simpleapp.Data.DTOs.User
{
    public class UserRegistrationRequest : BaseUserRequestDto
    {
        public string FullName { get; set; } = string.Empty;
    }
}

