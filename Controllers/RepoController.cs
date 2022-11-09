using Microsoft.AspNetCore.Mvc;

namespace Git.Builder.Controllers;

[ApiController]
[Route("repositories")]
public class RepoController : ControllerBase
{
    private readonly IManagerService _manager;

    public RepoController(IManagerService manager)
    {
        _manager = manager;
    }

    [HttpGet]
    public async Task<IActionResult> GetRepositories()
    {
        return Ok(_manager.GetClonedRepos());
    }

    [HttpGet("{repo}/branches")]
    public async Task<IActionResult> ListBranches(string repo)
    {
        return Ok(_manager.ListBranches(repo));
    }

    [HttpPost("clone")]
    public async Task<IActionResult> CloneRepository([FromBody] CloneRepo repo)
    {
        await _manager.CloneRepo(repo.Url, repo.Path);
        return Ok();
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRepo repo)
    {
        _manager.Checkout(repo.Repo, repo.Branch);
        return Ok();
    }
}

public record CheckoutRepo(string Repo, string Branch);
public record CloneRepo(string Url, string Path);