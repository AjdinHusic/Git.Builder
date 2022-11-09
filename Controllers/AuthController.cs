using Microsoft.AspNetCore.Mvc;

namespace Git.Builder.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IManagerService _manager;

    public AuthController(IManagerService manager)
    {
        _manager = manager;
    }

    [HttpGet]
    public async Task<IActionResult> GetCredentials()
    {
        var results = await _manager.GetCredentials();
        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> SetAuth([FromBody] Auth auth)
    {
        await _manager.SetUsernameAndPasswordCredentials(auth.Username, auth.Password);
        return NoContent();
    }
}

public record Auth(string Username, string Password);
