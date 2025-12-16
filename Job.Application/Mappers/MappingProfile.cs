using AutoMapper;
using Applications.DTOs;
using Domain.Entities;

namespace Applications.Mappers;

/// <summary>
/// AutoMapper profile for mapping between entities and DTOs
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Users mappings
        CreateMap<Users, UsersDto>().ReverseMap();
        
        // Job mappings
        CreateMap<Domain.Entities.Job, JobDto>()
            .ForMember(dest => dest.CompanyName, 
                opt => opt.MapFrom(src => src.CompanyProfile != null ? src.CompanyProfile.CompanyName : null))
            .ReverseMap()
            .ForMember(dest => dest.CompanyProfile, opt => opt.Ignore())
            .ForMember(dest => dest.Applications, opt => opt.Ignore());

        // JobSkill mappings
        CreateMap<JobSkill, JobSkillDto>()
            .ReverseMap()
            .ForMember(dest => dest.Job, opt => opt.Ignore());
        
        // CandidateSkill mappings
        CreateMap<CandidateSkill, CandidateSkillDto>()
            .ReverseMap()
            .ForMember(dest => dest.CandidateProfile, opt => opt.Ignore());
        
        // CandidateProfile mappings
        CreateMap<CandidateProfile, CandidateProfileDto>()
            .ReverseMap()
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Applications, opt => opt.Ignore());
        
        // CompanyProfile mappings
        CreateMap<CompanyProfile, CompanyProfileDto>()
            .ReverseMap()
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Jobs, opt => opt.Ignore());
        
        // Application mappings (using fully qualified name to avoid namespace conflict)
        CreateMap<Domain.Entities.Application, ApplicationDto>()
            .ForMember(dest => dest.JobTitle, 
                opt => opt.MapFrom(src => src.Job != null ? src.Job.Title : null))
            .ForMember(dest => dest.CandidateName, 
                opt => opt.MapFrom(src => src.CandidateProfile != null ? src.CandidateProfile.Email : null))
            .ReverseMap()
            .ForMember(dest => dest.Job, opt => opt.Ignore())
            .ForMember(dest => dest.CandidateProfile, opt => opt.Ignore());
    }
}
