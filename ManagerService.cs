using System.Diagnostics;
using System.Text.RegularExpressions;
using LibGit2Sharp;
using LibGit2Sharp.Handlers;

namespace Git.Builder;

public class ManagerService : IManagerService
{
    public const string Repos = "App_Data/repos";
    public const string AuthPath = "App_Data/auth";
    public const string CommandsPath = "App_Data/commands";
    
    // private async Task<Credentials> ReadCredentials()
    // {
    //     
    // }
    
    public async Task<IEnumerable<string>> GetCredentials()
    {
        var lines = await File.ReadAllLinesAsync(Path.Combine(AuthPath, ".auth"));
        return lines.Select(x =>
        {
            var base64EncodedBytes = System.Convert.FromBase64String(x);
            var contents = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
            var username = contents.Split(":").FirstOrDefault() ?? "";
            return username;
        });
    }

    public async Task SetUsernameAndPasswordCredentials(string username, string password)
    {
        Directory.CreateDirectory(AuthPath);
        var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{username}:{password}");
        var contents =  System.Convert.ToBase64String(plainTextBytes);
        await File.WriteAllLinesAsync(Path.Combine(AuthPath, ".auth"), new[] { contents });
    }

    public async Task CloneRepo(string repoUrl, string folderLocation)
    {
        var lines = await File.ReadAllLinesAsync(Path.Combine(AuthPath, ".auth"));
        var credentials = lines.Select(x =>
        {
            var base64EncodedBytes = System.Convert.FromBase64String(x);
            var contents = System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
            var creds = contents.Split(":");
            var username = creds.FirstOrDefault();
            var password = creds.LastOrDefault();
            return new
            {
                Username = username,
                Password = password
            };
        }).ToList();
        var path = Repository.Clone(repoUrl, Path.Combine(Repos, folderLocation), new CloneOptions()
        {
            CredentialsProvider = (_url, _user, _cred) => new UsernamePasswordCredentials()
            {
                Username = credentials.FirstOrDefault()?.Username,
                Password = credentials.FirstOrDefault()?.Password,
            },
            
        });
    }

    public void Checkout(string repoUrl, string branch)
    {
        var repository = new Repository(Path.Combine(Repos, repoUrl));

        var branchExists = repository
            .Branches
            .Any(x => x.FriendlyName.Equals(Path.Combine(x.RemoteName, branch)));
        if (!branchExists)
        {
            throw new NotFoundException($"no branch found {branch}");
        };
        Commands.Checkout(repository, branch);
    }

    public void Pull(string repoUrl)
    {
        var repository = new Repository(Path.Combine(Repos, repoUrl));

        // var credentials = await GetCredentials();
        // credentials.FirstOrDefault();
        // var signature = new Signature(new Identity("", ""));
        // Commands.Pull(repository, );
    }

    public IEnumerable<string> GetClonedRepos()
    {
        var directories = Directory.GetDirectories(Repos);
        return directories.Select(x => Path.GetFileName(x) ?? x);
    }

    public RepositoryInfo ListBranches(string repo)
    {
        var repository = new Repository(Path.Combine(Repos, repo));
        var currentBranch = repository.Head.FriendlyName;
        var behindBy = repository.Head.TrackingDetails.BehindBy;
        var aheadBy = repository.Head.TrackingDetails.AheadBy;
        return new RepositoryInfo( new BranchInfo(currentBranch, aheadBy, behindBy), repository
            .Branches
            .Where(x => x.IsRemote)
            .Select(x => x.FriendlyName.Replace(x.RemoteName + "/", "")));
    }

    public async Task AddCommand(string command)
    {
        Directory.CreateDirectory(CommandsPath);
        await File.AppendAllLinesAsync(Path.Combine(CommandsPath, ".commands"), new [] {command});
    }

    public async Task<IEnumerable<CommandInfo>> ListCommands()
    {
        var regex = new Regex("{.*?}");
        var commands = await File.ReadAllLinesAsync(Path.Combine(CommandsPath, ".commands"));
        
        return commands.Select(x =>
        {
            var matched = regex.Matches(x);
            return new CommandInfo(x, matched.Select(m => m.Value).ToArray());
        });
    }
}

public record Credentials(string? Username, string? Password);
public record BranchInfo(string? Name, int? AheadBy, int? BehindBy);
public record RepositoryInfo(BranchInfo CurrentBranch, IEnumerable<string> Branches);
public record CommandInfo(string Command, params string[] Args);