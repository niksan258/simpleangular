using simpleapp.Data.DTOs.User;

namespace simpleapp.Auth.Interfaces
{
    public interface IUserValidator
    {
        public abstract bool IsValid(UserLoginRequest user);
        public bool IsValid(UserRegistrationRequest user);
        public bool IsValid(UserDetailsUpdateRequest user);
    }
}
