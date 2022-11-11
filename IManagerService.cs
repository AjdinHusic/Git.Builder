namespace Git.Builder;

public interface IManagerService
{
    public Task<IEnumerable<string>> GetCredentials();
    public Task SetUsernameAndPasswordCredentials(string username, string password);
    public Task CloneRepo(string repoUrl, string folderLocation);
    public void Checkout(string repoUrl, string branch);
    public IEnumerable<string> GetClonedRepos();
    public RepositoryInfo ListBranches(string repo);
    public Task AddCommand(string command);
    public Task<IEnumerable<CommandInfo>> ListCommands();
}