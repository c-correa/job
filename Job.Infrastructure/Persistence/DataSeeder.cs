using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Job.Infra.Persistence;

namespace Job.Infra.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDBContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // 1. Create Users if they don't exist
        var companyUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "techcorp");
        if (companyUser == null)
        {
            companyUser = new Users
            {
                Username = "techcorp",
                Email = "hr@techcorp.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                CreatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(companyUser);
            await context.SaveChangesAsync();
        }

        var candidateUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "johndoe");
        if (candidateUser == null)
        {
            candidateUser = new Users
            {
                Username = "johndoe",
                Email = "john.doe@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                CreatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(candidateUser);
            await context.SaveChangesAsync();
        }
        
        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
        if (adminUser == null)
        {
            adminUser = new Users
            {
                Username = "admin",
                Email = "admin@jobplatform.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                CreatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        // 2. Create Company Profile if it doesn't exist
        var companyProfile = await context.CompanyProfiles.FirstOrDefaultAsync(cp => cp.UserId == companyUser.Id);
        if (companyProfile == null)
        {
            companyProfile = new CompanyProfile
            {
                UserId = companyUser.Id,
                CompanyName = "TechCorp Inc.",
                Email = "contact@techcorp.com",
                Description = "Leading technology solutions provider.",
                WebsiteUrl = "https://techcorp.com",
                Location = "San Francisco, CA",
                Industry = Industry.Technology,
                CreatedAt = DateTime.UtcNow
            };
            await context.CompanyProfiles.AddAsync(companyProfile);
            await context.SaveChangesAsync();
        }

        // 3. Create Candidate Profile if it doesn't exist
        var candidateProfile = await context.CandidateProfiles.FirstOrDefaultAsync(cp => cp.UserId == candidateUser.Id);
        if (candidateProfile == null)
        {
            candidateProfile = new CandidateProfile
            {
                UserId = candidateUser.Id,
                Email = "john.doe@example.com",
                Summary = "Experienced Full Stack Developer with passion for clean code.",
                YearsOfExperience = 5,
                ResumeUrl = null,
                CreatedAt = DateTime.UtcNow
            };
            await context.CandidateProfiles.AddAsync(candidateProfile);
            await context.SaveChangesAsync();
        }

        // 4. Create Jobs if they don't exist
        if (!await context.Jobs.AnyAsync(j => j.CompanyProfileId == companyProfile.Id && j.Title == "Senior React Developer"))
        {
            var jobs = new List<Domain.Entities.Job>
            {
                new Domain.Entities.Job
                {
                    CompanyProfileId = companyProfile.Id,
                    Title = "Senior React Developer",
                    Description = "We are looking for an experienced React developer to join our team. You will be working on our core product, building new features and improving performance. Requirements: 5+ years of experience, strong knowledge of React, Redux, and TypeScript.",
                    Location = "Remote",
                    JobType = JobType.FullTime,
                    ExperienceLevel = ExperienceLevel.Senior,
                    Salary = 120000,
                    RequiredSkills = "React, TypeScript, Node.js",
                    WorkModality = WorkModality.Remote,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Domain.Entities.Job
                {
                    CompanyProfileId = companyProfile.Id,
                    Title = "Backend .NET Engineer",
                    Description = "Join our backend team building scalable microservices. You will be responsible for designing and implementing high-performance APIs. Requirements: Strong C# skills, experience with .NET Core, Entity Framework, and SQL.",
                    Location = "New York, NY",
                    JobType = JobType.FullTime,
                    ExperienceLevel = ExperienceLevel.MidLevel,
                    Salary = 100000,
                    RequiredSkills = ".NET, C#, SQL, Docker",
                    WorkModality = WorkModality.Hybrid,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                 new Domain.Entities.Job
                {
                    CompanyProfileId = companyProfile.Id,
                    Title = "Junior Frontend Developer",
                    Description = "Great opportunity for a junior developer to learn and grow. You will be working closely with senior developers to implement UI components. Requirements: Basic knowledge of HTML, CSS, and JavaScript.",
                    Location = "Austin, TX",
                    JobType = JobType.FullTime,
                    ExperienceLevel = ExperienceLevel.Junior,
                    Salary = 70000,
                    RequiredSkills = "HTML, CSS, JavaScript, React",
                    WorkModality = WorkModality.OnSite,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Jobs.AddRangeAsync(jobs);
            await context.SaveChangesAsync();
        }
    }
}
