using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartList.Server.Data.DTOs;
using SmartList.Server.Entities;
using SmartList.Server.Services;

namespace SmartList.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly AuthService _authService;

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, AuthService authService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized("Invalid username or password.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
        if (!result.Succeeded)
        {
            return Unauthorized("Invalid username or password.");
        }

        var accessToken = _authService.GenerateJwtToken(user);
        return Ok(new LoginResponse(accessToken, user));
    }
}