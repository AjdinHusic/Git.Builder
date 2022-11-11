using Microsoft.AspNetCore.Mvc;

namespace Git.Builder.Controllers;

[ApiController]
[Route("commands")]
public class CommandsController : ControllerBase
{
    private readonly IManagerService _manager;


    public CommandsController(IManagerService manager)
    {
        _manager = manager;
    }

    [HttpPost]
    public async Task<IActionResult> AddCommand([FromBody] AddCommand request)
    {
        await _manager.AddCommand(request.Command);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetCommands()
    {
        return Ok(await _manager.ListCommands());
    }
}

public record AddCommand(string Command);