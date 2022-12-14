using CliWrap;
using CliWrap.EventStream;
using Microsoft.AspNetCore.SignalR;

namespace Git.Builder;

public class TerminalHub : Hub
{

    public async Task SendMessage(string repo, string command, string[] arguments)
    {
        try
        {
            var cmd = Cli
                    .Wrap(command)
                    .WithArguments(arguments)
                    .WithWorkingDirectory(Path.Combine(ManagerService.Repos, repo));
            
            await foreach (var cmdEvent in cmd.ListenAsync())
            {
                switch (cmdEvent)
                {
                    case StartedCommandEvent started:
                        await Clients.Caller.SendAsync("ProcessStarted",$"Process started; ID: {started.ProcessId}");
                        break;
                    case StandardOutputCommandEvent stdOut:
                        await Clients.Caller.SendAsync("ReceivedOutput", stdOut.Text);
                        break;
                    case StandardErrorCommandEvent stdErr:
                        await Clients.Caller.SendAsync("ReceivedError", stdErr.Text);
                        break;
                    case ExitedCommandEvent exited:
                        await Clients.Caller.SendAsync("ProcessExited", $"Process exited; Code: {exited.ExitCode}");
                        break;
                }
            }
            
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            await Clients.Caller.SendAsync("Error", e.ToString());
        }
        
    }
}