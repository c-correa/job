using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Job.Infra.Persistence;

/// <summary>
/// Database context for the Job platform
/// </summary>
public class AppDBContext : DbContext
{
    public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
    {
    }

    /// <summary>
    /// Applications table
    /// </summary>
    public DbSet<Domain.Entities.Application> Applications { get; set; }

    
    /// <summary>
    /// Candidate profiles table
    /// </summary>
    public DbSet<CandidateProfile> CandidateProfiles { get; set; }
    
    /// <summary>
    /// Company profiles table
    /// </summary>
    public DbSet<CompanyProfile> CompanyProfiles { get; set; }
    
    /// <summary>
    /// Jobs table
    /// </summary>
    public DbSet<Domain.Entities.Job> Jobs { get; set; }
    
    /// <summary>
    /// Users table
    /// </summary>
    public DbSet<Users> Users { get; set; }
    
    /// <summary>
    /// Candidate skills table (many-to-many relationship)
    /// </summary>
    public DbSet<CandidateSkill> CandidateSkills { get; set; }


    /// <summary>
    /// Configure entity relationships and constraints
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Users entity
        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure CandidateProfile entity
        modelBuilder.Entity<CandidateProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email);
            
            // One User can have one CandidateProfile
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CompanyProfile entity
        modelBuilder.Entity<CompanyProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email);
            
            // One User can have one CompanyProfile
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Store Industry enum as integer in database
            entity.Property(e => e.Industry)
                .HasConversion<int?>();
        });

        // Configure Job entity
        modelBuilder.Entity<Domain.Entities.Job>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CompanyProfileId);
            entity.HasIndex(e => e.IsActive);
            
            // One CompanyProfile can have many Jobs
            entity.HasOne(e => e.CompanyProfile)
                .WithMany(c => c.Jobs)
                .HasForeignKey(e => e.CompanyProfileId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Configure decimal precision for Salary
            entity.Property(e => e.Salary)
                .HasPrecision(18, 2);
                
            // Store enums as integers in database
            entity.Property(e => e.JobType)
                .HasConversion<int?>();
                
            entity.Property(e => e.ExperienceLevel)
                .HasConversion<int?>();
        });

        // Configure Application entity
        modelBuilder.Entity<Domain.Entities.Application>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.JobId, e.CandidateProfileId });
            entity.HasIndex(e => e.Status);
            
            // One Job can have many Applications
            entity.HasOne(e => e.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(e => e.JobId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // One CandidateProfile can have many Applications
            entity.HasOne(e => e.CandidateProfile)
                .WithMany(c => c.Applications)
                .HasForeignKey(e => e.CandidateProfileId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Store ApplicationStatus enum as integer in database
            entity.Property(e => e.Status)
                .HasConversion<int>();
        });
        
        // Configure CandidateSkill entity
        modelBuilder.Entity<CandidateSkill>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.CandidateProfileId, e.Skill }).IsUnique();
            entity.HasIndex(e => e.Skill);
            
            // One CandidateProfile can have many CandidateSkills
            entity.HasOne(e => e.CandidateProfile)
                .WithMany(c => c.CandidateSkills)
                .HasForeignKey(e => e.CandidateProfileId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // Store enum as integer in database
            entity.Property(e => e.Skill)
                .HasConversion<int>();
        });
    }
}