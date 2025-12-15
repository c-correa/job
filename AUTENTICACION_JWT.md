# 🔐 AUTENTICACIÓN JWT IMPLEMENTADA

## 🎯 Resumen

Se ha implementado un sistema completo de autenticación y autorización utilizando **JWT (JSON Web Tokens)** y **BCrypt** para el hash de contraseñas.

---

## 🛠️ Componentes Implementados

### 1. Paquetes NuGet
- `Microsoft.AspNetCore.Authentication.JwtBearer` (v8.0.0)
- `System.IdentityModel.Tokens.Jwt` (v8.0.0)
- `BCrypt.Net-Next` (v4.0.3)

### 2. Configuración (appsettings.json)
```json
"JwtSettings": {
  "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345!",
  "Issuer": "JobPlatformAPI",
  "Audience": "JobPlatformClient",
  "ExpirationMinutes": 60
}
```

### 3. DTOs de Autenticación
- `LoginDto`: Username, Password
- `RegisterDto`: Username, Password, Email
- `AuthResponseDto`: Token, Username, Email, UserId, ExpiresAt

### 4. Servicio de Autenticación (`AuthService`)
- **LoginAsync**: Verifica credenciales y genera token
- **RegisterAsync**: Crea usuario (password hasheado) y genera token
- **ValidateToken**: Valida si un token es legítimo

### 5. Controlador (`AuthController`)
- `POST /api/auth/login`: Iniciar sesión
- `POST /api/auth/register`: Registrarse
- `POST /api/auth/validate`: Validar token
- `GET /api/auth/me`: Obtener usuario actual (requiere token)

---

## 🚀 Cómo Usar la Autenticación

### 1️⃣ Registrarse
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "SecurePassword123!",
  "email": "user@example.com"
}
```

### 2️⃣ Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "newuser",
  "password": "SecurePassword123!"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "newuser",
  "email": "user@example.com",
  "userId": 1,
  "expiresAt": "2025-12-12T00:00:00Z"
}
```

### 3️⃣ Acceder a Endpoints Protegidos

Para acceder a endpoints marcados con `[Authorize]`, debes incluir el token en el header `Authorization`:

```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔒 Seguridad Implementada

1. **Hash de Contraseñas:**
   - Se usa **BCrypt** para hashear las contraseñas antes de guardarlas en la base de datos.
   - Nunca se guardan contraseñas en texto plano.

2. **JWT Tokens:**
   - Firmados con algoritmo **HMACSHA256**.
   - Contienen Claims: `Sub` (username), `Jti` (ID único), `NameIdentifier` (UserId), `Email`.
   - Tienen tiempo de expiración (60 minutos por defecto).

3. **Swagger:**
   - Se configuró Swagger para soportar autenticación Bearer.
   - Botón "Authorize" disponible en la interfaz.

---

## 📝 Próximos Pasos

1. **Proteger Endpoints Críticos:**
   - Agregar `[Authorize]` a los métodos de `CompaniesController`, `CandidatesController`, etc., que requieran autenticación.
   - Ejemplo: Solo usuarios autenticados pueden crear ofertas de trabajo.

2. **Roles de Usuario:**
   - Implementar roles (Admin, Company, Candidate).
   - Agregar Claims de roles al token JWT.
   - Usar `[Authorize(Roles = "Admin")]`.

3. **Refresh Tokens:**
   - Implementar mecanismo de refresh token para mantener la sesión activa sin pedir credenciales nuevamente.

---

**Estado:** ✅ Implementado y Funcionando  
**URL Base:** `http://localhost:5002`  
**Swagger:** `http://localhost:5002/swagger`
