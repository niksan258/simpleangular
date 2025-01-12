using simpleapp.Data.Models;

namespace simpleapp.Auth.Interfaces
{
    public interface IJWTService
    {
        public abstract string generateJWT(User user);
    }
}
