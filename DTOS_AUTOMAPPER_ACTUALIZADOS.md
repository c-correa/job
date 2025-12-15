# ✅ DTOs Y AUTOMAPPER ACTUALIZADOS

## 🎯 Resumen de Cambios

Se han actualizado todos los **DTOs** y **AutoMapper** para reflejar los cambios de ENUMs (`Industry` y `Skill`) y la nueva estructura de datos.

---

## 📋 1. CompanyProfileDto - ACTUALIZADO

### Archivo: `Application/DTOs/CompanyProfileDto.cs`

**Cambios Realizados:**

✅ **Agregado:** `using Domain.Enums;`

✅ **Modificado:** Campo `Industry` de `string?` a `Industry?` (ENUM)

❌ **Eliminado:** `CompanySize` (campo removido de la entidad)

❌ **Eliminado:** `LogoUrl` (campo removido de la entidad)

### Código Actualizado:

```csharp
using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Applications.DTOs;

public class CompanyProfileDto
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required(ErrorMessage = "Company name is required")]
    [StringLength(200)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }
    
    [Url]
    [StringLength(200)]
    public string? WebsiteUrl { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    /// <summary>
    /// Company industry sector (enum)
    /// </summary>
    public Industry? Industry { get; set; }  // ✅ ENUM
    
    [StringLength(300)]
    public string? Location { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

---

## 📋 2. CandidateSkillDto - NUEVO

### Archivo: `Application/DTOs/CandidateSkillDto.cs`

**DTO completamente nuevo** para manejar las skills de los candidatos.

### Código:

```csharp
using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Applications.DTOs;

/// <summary>
/// Data Transfer Object for Candidate Skills
/// </summary>
public class CandidateSkillDto
{
    public int Id { get; set; }
    
    [Required]
    public int CandidateProfileId { get; set; }
    
    /// <summary>
    /// Skill from predefined enum
    /// </summary>
    [Required(ErrorMessage = "Skill is required")]
    public Skill Skill { get; set; }  // ✅ ENUM
    
    /// <summary>
    /// Proficiency level (1-5, where 5 is expert)
    /// </summary>
    [Range(1, 5, ErrorMessage = "Proficiency level must be between 1 and 5")]
    public int? ProficiencyLevel { get; set; }
    
    /// <summary>
    /// Years of experience with this skill
    /// </summary>
    [Range(0, 50, ErrorMessage = "Years of experience must be between 0 and 50")]
    public int? YearsOfExperience { get; set; }
    
    public DateTime CreatedAt { get; set; }
}
```

**Validaciones:**
- ✅ `Skill` es requerido
- ✅ `ProficiencyLevel` debe estar entre 1 y 5
- ✅ `YearsOfExperience` debe estar entre 0 y 50

---

## 📋 3. CandidateProfileDto - ACTUALIZADO

### Archivo: `Application/DTOs/CandidateProfileDto.cs`

**Cambios Realizados:**

✅ **Agregado:** `List<CandidateSkillDto>? CandidateSkills` (colección de skills)

❌ **Eliminado:** `FullName` (campo removido de la entidad)

❌ **Eliminado:** `PhoneNumber` (campo removido de la entidad)

❌ **Eliminado:** `Skills` (string - reemplazado por colección)

### Código Actualizado:

```csharp
using System.ComponentModel.DataAnnotations;

namespace Applications.DTOs;

public class CandidateProfileDto
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [StringLength(1000)]
    public string? Summary { get; set; }
    
    public int? YearsOfExperience { get; set; }
    
    /// <summary>
    /// Collection of candidate skills
    /// </summary>
    public List<CandidateSkillDto>? CandidateSkills { get; set; }  // ✅ NUEVO
    
    [StringLength(500)]
    public string? ResumeUrl { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

---

## 🔄 4. AutoMapper - ACTUALIZADO

### Archivo: `Application/Mappers/MappingProfile.cs`

**Cambios Realizados:**

✅ **Agregado:** Mapeo para `CandidateSkill` ↔ `CandidateSkillDto`

✅ **Corregido:** Mapeo de `CandidateName` en `ApplicationDto` (ahora usa `Email`)

### Código Actualizado:

```csharp
using AutoMapper;
using Applications.DTOs;
using Domain.Entities;

namespace Applications.Mappers;

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
        
        // ✅ NUEVO: CandidateSkill mappings
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
        
        // Application mappings
        CreateMap<Domain.Entities.Application, ApplicationDto>()
            .ForMember(dest => dest.JobTitle, 
                opt => opt.MapFrom(src => src.Job != null ? src.Job.Title : null))
            .ForMember(dest => dest.CandidateName, 
                opt => opt.MapFrom(src => src.CandidateProfile != null ? src.CandidateProfile.Email : null))  // ✅ CORREGIDO
            .ReverseMap()
            .ForMember(dest => dest.Job, opt => opt.Ignore())
            .ForMember(dest => dest.CandidateProfile, opt => opt.Ignore());
    }
}
```

**Características del Mapeo:**

1. **Bidireccional:** Todos los mapeos usan `.ReverseMap()`
2. **Propiedades de Navegación Ignoradas:** Para evitar referencias circulares
3. **Mapeo Automático de ENUMs:** AutoMapper maneja automáticamente los ENUMs
4. **Mapeo de Colecciones:** AutoMapper mapea automáticamente `ICollection<CandidateSkill>` a `List<CandidateSkillDto>`

---

## 💻 Ejemplos de Uso

### 1. Mapear CompanyProfile con Industry

```csharp
// Entity → DTO
var companyEntity = new CompanyProfile
{
    Id = 1,
    CompanyName = "Tech Solutions",
    Industry = Industry.Technology,  // ENUM
    Email = "contact@tech.com"
};

var companyDto = _mapper.Map<CompanyProfileDto>(companyEntity);
// companyDto.Industry será Industry.Technology

// DTO → Entity
var newCompanyDto = new CompanyProfileDto
{
    CompanyName = "Finance Corp",
    Industry = Industry.Finance,  // ENUM
    Email = "info@finance.com"
};

var newCompanyEntity = _mapper.Map<CompanyProfile>(newCompanyDto);
// newCompanyEntity.Industry será Industry.Finance
```

### 2. Mapear CandidateProfile con Skills

```csharp
// Entity → DTO
var candidateEntity = new CandidateProfile
{
    Id = 1,
    Email = "john@email.com",
    CandidateSkills = new List<CandidateSkill>
    {
        new() { Skill = Skill.CSharp, ProficiencyLevel = 5, YearsOfExperience = 5 },
        new() { Skill = Skill.React, ProficiencyLevel = 4, YearsOfExperience = 3 }
    }
};

var candidateDto = _mapper.Map<CandidateProfileDto>(candidateEntity);
// candidateDto.CandidateSkills tendrá 2 elementos con los skills mapeados

// DTO → Entity
var newCandidateDto = new CandidateProfileDto
{
    Email = "jane@email.com",
    CandidateSkills = new List<CandidateSkillDto>
    {
        new() { Skill = Skill.Python, ProficiencyLevel = 5, YearsOfExperience = 7 },
        new() { Skill = Skill.AWS, ProficiencyLevel = 4, YearsOfExperience = 4 }
    }
};

var newCandidateEntity = _mapper.Map<CandidateProfile>(newCandidateDto);
// newCandidateEntity.CandidateSkills tendrá los skills mapeados
```

### 3. Uso en Controladores

```csharp
[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly IGenericRepository<CompanyProfile> _repository;
    private readonly IMapper _mapper;

    public CompaniesController(IGenericRepository<CompanyProfile> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyProfileDto>> GetById(int id)
    {
        var company = await _repository.GetByIdAsync(id);
        if (company == null) return NotFound();
        
        // Mapeo automático de Industry enum
        var dto = _mapper.Map<CompanyProfileDto>(company);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<CompanyProfileDto>> Create(CompanyProfileDto dto)
    {
        // Mapeo automático de Industry enum
        var company = _mapper.Map<CompanyProfile>(dto);
        var created = await _repository.CreateAsync(company);
        
        var createdDto = _mapper.Map<CompanyProfileDto>(created);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, createdDto);
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyProfileDto>>> GetByIndustry([FromQuery] Industry? industry)
    {
        var companies = await _repository.GetAllAsync();
        
        if (industry.HasValue)
        {
            companies = companies.Where(c => c.Industry == industry).ToList();
        }
        
        var dtos = _mapper.Map<IEnumerable<CompanyProfileDto>>(companies);
        return Ok(dtos);
    }
}
```

---

## 🎯 Ventajas del Mapeo Actualizado

### ✅ Ventajas:

1. **Tipo Seguro**
   - Los ENUMs previenen errores de tipeo
   - IntelliSense muestra opciones válidas

2. **Validación Automática**
   - DataAnnotations validan los datos
   - Range validators para proficiency y experiencia

3. **Mapeo Automático**
   - AutoMapper maneja ENUMs automáticamente
   - Mapeo bidireccional configurado

4. **Estructura Clara**
   - Skills como colección estructurada
   - Información adicional (proficiency, experiencia)

5. **Serialización JSON**
   - ENUMs se serializan como números o strings
   - Fácil de consumir desde frontend

---

## 🔄 Serialización JSON de ENUMs

Por defecto, los ENUMs se serializan como **números** en JSON:

```json
{
  "id": 1,
  "companyName": "Tech Solutions",
  "industry": 1,  // Technology
  "email": "contact@tech.com"
}
```

Si quieres que se serialicen como **strings**, agrega en `Program.cs`:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
```

Resultado:

```json
{
  "id": 1,
  "companyName": "Tech Solutions",
  "industry": "Technology",  // String
  "email": "contact@tech.com"
}
```

---

## 📊 Ejemplo de JSON Completo

### CompanyProfile con Industry:

```json
{
  "id": 1,
  "userId": 10,
  "companyName": "Tech Solutions Inc",
  "email": "contact@techsolutions.com",
  "phoneNumber": "+1-555-0123",
  "websiteUrl": "https://techsolutions.com",
  "description": "Leading software development company",
  "industry": 1,  // Technology (o "Technology" si usas JsonStringEnumConverter)
  "location": "San Francisco, CA",
  "createdAt": "2025-12-11T18:00:00Z",
  "updatedAt": null
}
```

### CandidateProfile con Skills:

```json
{
  "id": 2,
  "userId": 20,
  "email": "john.doe@email.com",
  "summary": "Senior Full Stack Developer with 5 years of experience",
  "yearsOfExperience": 5,
  "candidateSkills": [
    {
      "id": 1,
      "candidateProfileId": 2,
      "skill": 1,  // CSharp
      "proficiencyLevel": 5,
      "yearsOfExperience": 5,
      "createdAt": "2025-12-11T18:00:00Z"
    },
    {
      "id": 2,
      "candidateProfileId": 2,
      "skill": 20,  // React
      "proficiencyLevel": 4,
      "yearsOfExperience": 3,
      "createdAt": "2025-12-11T18:00:00Z"
    },
    {
      "id": 3,
      "candidateProfileId": 2,
      "skill": 41,  // PostgreSQL
      "proficiencyLevel": 4,
      "yearsOfExperience": 4,
      "createdAt": "2025-12-11T18:00:00Z"
    }
  ],
  "resumeUrl": "https://storage.example.com/resumes/john-doe.pdf",
  "createdAt": "2025-12-11T18:00:00Z",
  "updatedAt": null
}
```

---

## ✅ Checklist de Completitud

- [x] CompanyProfileDto actualizado con Industry enum
- [x] CandidateSkillDto creado
- [x] CandidateProfileDto actualizado con CandidateSkills
- [x] AutoMapper actualizado con todos los mapeos
- [x] Compilación exitosa sin errores
- [x] Mapeo bidireccional configurado
- [x] Propiedades de navegación ignoradas
- [x] Validaciones agregadas a DTOs
- [ ] Controladores CRUD creados (pendiente)
- [ ] Configuración de serialización JSON (opcional)

---

## 🚀 Próximos Pasos Recomendados

1. **Crear Controladores CRUD**
   - `CompaniesController` con filtro por Industry
   - `CandidatesController` con filtro por Skills
   - `SkillsController` para listar skills disponibles

2. **Agregar Endpoints Específicos**
   ```csharp
   [HttpGet("api/skills")]
   public IActionResult GetAllSkills()
   {
       var skills = Enum.GetValues<Skill>()
           .Select(s => new { id = (int)s, name = s.ToString() });
       return Ok(skills);
   }
   
   [HttpGet("api/industries")]
   public IActionResult GetAllIndustries()
   {
       var industries = Enum.GetValues<Industry>()
           .Select(i => new { id = (int)i, name = i.ToString() });
       return Ok(industries);
   }
   ```

3. **Configurar Serialización JSON** (opcional)
   - Agregar `JsonStringEnumConverter` para serializar ENUMs como strings

4. **Crear Filtros de Búsqueda**
   - Buscar candidatos por skill
   - Buscar empresas por industry
   - Buscar candidatos por nivel de proficiencia

---

**Fecha de Actualización:** 2025-12-11  
**Estado:** ✅ DTOs y AutoMapper actualizados exitosamente  
**Compilación:** ✅ Sin errores ni advertencias  
**Arquitectura:** Hexagonal (Ports & Adapters)
