using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Job.Infra.Persistence;
using Job.Infra.Repositories;
using Domain.InterfaceRepository;
using Applications.Mappers;
using Applications.Interfaces;
using Applications.Services;

var builder = WebApplication.CreateBuilder(args);

// ========== Configuration ==========
// Load connection string from appsettings.json (or environment / user-secrets)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string 'DefaultConnection' is not configured.");
}

Console.WriteLine("🔧 Configuring services...");

// ========== Database Configuration ==========
// Register DbContext using Npgsql (PostgreSQL)
builder.Services.AddDbContext<AppDBContext>(options =>
{
    options.UseNpgsql(connectionString);
    options.EnableSensitiveDataLogging(builder.Environment.IsDevelopment());
    options.EnableDetailedErrors(builder.Environment.IsDevelopment());
});

Console.WriteLine("✅ Database context configured");

// ========== Repository Registration (Infrastructure Layer) ==========
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

Console.WriteLine("✅ Repositories registered");

// ========== Services Registration (Application Layer) ==========
builder.Services.AddScoped<IAuthService, AuthService>();

Console.WriteLine("✅ Services registered");

// ========== AutoMapper Configuration ==========
builder.Services.AddAutoMapper(typeof(MappingProfile));

Console.WriteLine("✅ AutoMapper configured");

// ========== JWT Authentication Configuration ==========
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT SecretKey is not configured.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

Console.WriteLine("✅ JWT Authentication configured");

// ========== API Controllers ==========
builder.Services.AddControllers();

// ========== Swagger/OpenAPI Configuration ==========
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Job Platform API",
        Version = "v1",
        Description = "API for Job Platform with Hexagonal Architecture and JWT Authentication",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Job Platform Team"
        }
    });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ========== CORS Configuration ==========
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

Console.WriteLine("✅ API services configured");

var app = builder.Build();

Console.WriteLine("🚀 Starting application...");

// ========== Database Connection Verification ==========
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();
        
        Console.WriteLine("🔍 Verifying database connection...");
        
        // Test database connection
        var canConnect = await dbContext.Database.CanConnectAsync();
        
        if (canConnect)
        {
            Console.WriteLine("✅ Database connection successful!");
            Console.WriteLine($"📊 Database: {dbContext.Database.GetDbConnection().Database}");
            Console.WriteLine($"🔗 Server: {dbContext.Database.GetDbConnection().DataSource}");
            
            // Check if migrations are pending
            var pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();
            if (pendingMigrations.Any())
            {
                Console.WriteLine("⚠️  Pending migrations detected:");
                foreach (var migration in pendingMigrations)
                {
                    Console.WriteLine($"   - {migration}");
                }
                Console.WriteLine("💡 Run 'dotnet ef database update' to apply migrations");
            }
            else
            {
                Console.WriteLine("✅ Database is up to date");
            }
        }
        else
        {
            Console.WriteLine("❌ Failed to connect to database");
            Console.WriteLine("⚠️  Please check your connection string in appsettings.json");
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine("❌ Database connection error:");
    Console.WriteLine($"   {ex.Message}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"   Inner: {ex.InnerException.Message}");
    }
}

// ========== Middleware Pipeline ==========
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Job Platform API v1");
        c.RoutePrefix = string.Empty; // Swagger at root
    });
    Console.WriteLine("📚 Swagger UI available at: http://localhost:5000");
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

// Authentication & Authorization (MUST be in this order)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Simple health check endpoint
app.MapGet("/health", async (AppDBContext dbContext) =>
{
    try
    {
        var canConnect = await dbContext.Database.CanConnectAsync();
        return Results.Ok(new
        {
            status = canConnect ? "healthy" : "unhealthy",
            database = canConnect ? "connected" : "disconnected",
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Ok(new
        {
            status = "unhealthy",
            database = "error",
            error = ex.Message,
            timestamp = DateTime.UtcNow
        });
    }
});

app.MapGet("/", () => new
{
    message = "Job Platform API is running",
    version = "1.0.0",
    architecture = "Hexagonal (Ports & Adapters)",
    endpoints = new
    {
        health = "/health",
        swagger = "/swagger",
        api = "/api"
    }
});

Console.WriteLine("✅ Application started successfully!");
Console.WriteLine("🌐 Listening on: http://localhost:5000");

app.Run();
