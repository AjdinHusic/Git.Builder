FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["Git.Builder.csproj", "./"]
RUN dotnet restore "Git.Builder.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "Git.Builder.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Git.Builder.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Git.Builder.dll"]
