using SmartList.Server.Data.Models;
using SmartList.Server.Entities;

namespace SmartList.Server.Data.DTOs;

public class LoginResponse
{
    public string? AccessToken { get; set; }
    public UserModel User { get; set; }

    public LoginResponse(string? accessToken, User user)
    {
        AccessToken = accessToken;
        User = new UserModel
        {
            UserId = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber
        };
    }
}