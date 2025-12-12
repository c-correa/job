Archivo para colocar las credenciales de la base de datos (cadena de conexión)

Ubicación: `appsettings.json` (en la raíz del repo `job`) o usar `dotnet user-secrets` para desarrollo.

Ejemplo usado (PostgreSQL / Clever Cloud):

```
Host=b200jjuvtqcdtuuumebx-postgresql.services.clever-cloud.com;Port=50013;Database=b200jjuvtqcdtuuumebx;Username=uy5czjk9xtqyfamyygll;Password=<tu-password>;Ssl Mode=Require;Trust Server Certificate=true
```

Comandos útiles para `dotnet user-secrets` (desarrollo local):

1. Sitúate en el directorio del proyecto que contiene `Program.cs` (ej. `job`):

```bash
cd /home/Coder/Escritorio/proyecto_integrador/job
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=b200jjuvtqcdtuuumebx-postgresql.services.clever-cloud.com;Port=50013;Database=b200jjuvtqcdtuuumebx;Username=uy5czjk9xtqyfamyygll;Password=<tu-password>;Ssl Mode=Require;Trust Server Certificate=true"
```

2. Alternativa segura: exportar la cadena como variable de entorno antes de ejecutar la app:

```bash
export ConnectionStrings__DefaultConnection='Host=...;Port=50013;Database=...;Username=...;Password=...;Ssl Mode=Require;Trust Server Certificate=true'
dotnet run --project Host.csproj
```

Notas:
- No subas `appsettings.json` con credenciales reales a repositorios públicos.
- En producción usa un secreto gestionado (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault, etc.).
