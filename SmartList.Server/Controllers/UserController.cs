using Microsoft.AspNetCore.Mvc;
using SmartList.Server.Services;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using SmartList.Server.Data.Enums;

namespace SmartList.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("create")]
        [Authorize(Roles = Role.Admin)]
        public async Task<IActionResult> CreateUser(string username, string password)
        {
            var createdById = Guid.Parse(User.Identity.Name); // TODO: edit
            var result = await _userService.CreateUserAsync(username, password, createdById);
            if (result.Succeeded)
            {
                return Ok("User created successfully.");
            }

            return BadRequest(result.Errors);
        }
    }
}