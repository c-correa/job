# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["Job.Api/Job.Api.csproj", "Job.Api/"]
COPY ["Job.Domain/Domain.csproj", "Job.Domain/"]
COPY ["Job.Application/Applications.csproj", "Job.Application/"]
COPY ["Job.Infrastructure/Infra.csproj", "Job.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Job.Api/Job.Api.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/Job.Api"
RUN dotnet build "Job.Api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "Job.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Expose ports
EXPOSE 8080
EXPOSE 8081

# Copy published app from build stage
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point
ENTRYPOINT ["dotnet", "Job.Api.dll"]
