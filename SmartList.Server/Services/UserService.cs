using Microsoft.AspNetCore.Identity;
using SmartList.Server.Data.Contexts;
using SmartList.Server.Entities;

namespace SmartList.Server.Services;

public class UserService
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public UserService(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IdentityResult> CreateUserAsync(string username, string password, Guid createById)
    {
        var user = new User(createById)
        {
            UserName = username
        };
        var result = await _userManager.CreateAsync(user, password);
        return result;
    }
}