using System.ComponentModel.DataAnnotations;
using simpleapp.Auth.Interfaces;
using simpleapp.Data.DTOs.User;

namespace simpleapp.Auth
{
    public class UserValidator : IUserValidator
    {
        public bool IsValid(UserLoginRequest user)
        {
            return user is not null
                && user.Email is not null && new EmailAddressAttribute().IsValid(user.Email)
                && user.Password is not null && user.Password.Length >= 8;
        }

        public bool IsValid(UserRegistrationRequest user)
        {
            return user is not null
                && user.Email is not null && new EmailAddressAttribute().IsValid(user.Email)
                && user.FullName is not null && user.FullName.Length >= 3
                && user.Password is not null && user.Password.Length >= 8;
        }

        public bool IsValid(UserDetailsUpdateRequest user)
        {
            return user is not null
                && user.Email is not null && new EmailAddressAttribute().IsValid(user.Email)
                && user.FullName is not null && user.FullName.Length >= 3
                && (user.Password is null || (user.Password is not null && user.Password.Length >= 8));
        }
    }
}
