# 📚 JobLink RIWI API Documentation

## 🎯 HU-BACK-01: Gestión de Vacantes y Postulaciones

### Version: 1.0.0
### Base URL: `http://localhost:5001/api`

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Vacancies (Jobs) Management](#vacancies-management)
3. [Applications Management](#applications-management)
4. [Response Codes](#response-codes)
5. [Data Models](#data-models)

---

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "username": "string",
  "password": "string"
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiration": "2025-12-13T14:00:00Z"
}
```

---

## 💼 Vacancies Management

### 1. Get All Vacancies
**GET** `/api/jobs`

**Query Parameters:**
- `companyId` (optional): Filter by company ID
- `isActive` (optional): Filter by active status (true/false)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Senior .NET Developer",
    "description": "We are looking for an experienced .NET developer...",
    "companyProfileId": 5,
    "companyName": "Tech Solutions Inc.",
    "location": "Remote",
    "jobType": 1,
    "experienceLevel": 3,
    "salary": 80000.00,
    "requiredSkills": "C#, .NET Core, SQL, Docker",
    "isActive": true,
    "createdAt": "2025-12-12T10:00:00Z",
    "updatedAt": null
  }
]
```

**JobType Enum:**
- `1` = FullTime
- `2` = PartTime
- `3` = Contract
- `4` = Temporary
- `5` = Internship
- `6` = Freelance

**ExperienceLevel Enum:**
- `1` = Junior (0-2 years)
- `2` = MidLevel (2-5 years)
- `3` = Senior (5-10 years)
- `4` = Lead (10+ years)
- `5` = NoExperience

---

### 2. Get Vacancy by ID
**GET** `/api/jobs/{id}`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Senior .NET Developer",
  "description": "We are looking for an experienced .NET developer...",
  "companyProfileId": 5,
  "companyName": "Tech Solutions Inc.",
  "location": "Remote",
  "jobType": 1,
  "experienceLevel": 3,
  "salary": 80000.00,
  "requiredSkills": "C#, .NET Core, SQL, Docker",
  "isActive": true,
  "createdAt": "2025-12-12T10:00:00Z",
  "updatedAt": null
}
```

**Response (404 Not Found):**
```json
{
  "message": "Job with ID 99 not found"
}
```

---

### 3. Create New Vacancy
**POST** `/api/jobs`  
🔒 **Requires Authentication**

**Request Body:**
```json
{
  "title": "Junior Full Stack Developer",
  "description": "Exciting opportunity for junior developers...",
  "companyProfileId": 5,
  "location": "Medellín, Colombia",
  "jobType": 1,
  "experienceLevel": 1,
  "salary": 35000.00,
  "requiredSkills": "JavaScript, React, Node.js, PostgreSQL"
}
```

**Response (201 Created):**
```json
{
  "id": 15,
  "title": "Junior Full Stack Developer",
  "description": "Exciting opportunity for junior developers...",
  "companyProfileId": 5,
  "companyName": null,
  "location": "Medellín, Colombia",
  "jobType": 1,
  "experienceLevel": 1,
  "salary": 35000.00,
  "requiredSkills": "JavaScript, React, Node.js, PostgreSQL",
  "isActive": true,
  "createdAt": "2025-12-12T19:30:00Z",
  "updatedAt": null
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `description`: Optional, max 2000 characters
- `companyProfileId`: Required
- `location`: Optional, max 300 characters
- `requiredSkills`: Optional, max 1000 characters

---

### 4. Update Vacancy
**PUT** `/api/jobs/{id}`  
🔒 **Requires Authentication**

**Request Body:**
```json
{
  "id": 15,
  "title": "Junior Full Stack Developer (Updated)",
  "description": "Updated description...",
  "companyProfileId": 5,
  "location": "Remote",
  "jobType": 1,
  "experienceLevel": 1,
  "salary": 38000.00,
  "requiredSkills": "JavaScript, React, Node.js, PostgreSQL, Docker",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "id": 15,
  "title": "Junior Full Stack Developer (Updated)",
  "description": "Updated description...",
  "companyProfileId": 5,
  "companyName": null,
  "location": "Remote",
  "jobType": 1,
  "experienceLevel": 1,
  "salary": 38000.00,
  "requiredSkills": "JavaScript, React, Node.js, PostgreSQL, Docker",
  "isActive": true,
  "createdAt": "2025-12-12T19:30:00Z",
  "updatedAt": "2025-12-12T20:15:00Z"
}
```

---

### 5. Activate/Deactivate Vacancy
**PATCH** `/api/jobs/{id}/status`  
🔒 **Requires Authentication**

**Request Body:**
```json
true
```
(or `false` to deactivate)

**Response (200 OK):**
```json
{
  "id": 15,
  "title": "Junior Full Stack Developer",
  "isActive": false,
  "updatedAt": "2025-12-12T20:20:00Z"
}
```

---

### 6. Delete Vacancy
**DELETE** `/api/jobs/{id}`  
🔒 **Requires Authentication**

**Response (204 No Content)**

---

### 7. Get Active Vacancies Only
**GET** `/api/jobs/active`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Senior .NET Developer",
    "isActive": true,
    ...
  }
]
```

---

## 📝 Applications Management

### 1. Submit Application (Coder applies to job)
**POST** `/api/applications`  
🔒 **Requires Authentication**

**Request Body:**
```json
{
  "jobId": 1,
  "candidateProfileId": 10,
  "coverLetter": "I am very interested in this position because..."
}
```

**Response (201 Created):**
```json
{
  "id": 25,
  "jobId": 1,
  "jobTitle": null,
  "candidateProfileId": 10,
  "candidateName": null,
  "coverLetter": "I am very interested in this position because...",
  "status": 1,
  "createdAt": "2025-12-12T19:45:00Z",
  "updatedAt": null
}
```

**Response (400 Bad Request) - Duplicate Application:**
```json
{
  "message": "You have already applied to this job"
}
```

**Response (400 Bad Request) - Inactive Job:**
```json
{
  "message": "This job posting is no longer accepting applications"
}
```

**ApplicationStatus Enum:**
- `1` = Pending
- `2` = UnderReview
- `3` = Shortlisted
- `4` = InterviewScheduled
- `5` = Accepted
- `6` = Rejected
- `7` = Withdrawn

---

### 2. Get All Applications (with filters)
**GET** `/api/applications`  
🔒 **Requires Authentication**

**Query Parameters:**
- `jobId` (optional): Filter by job ID
- `candidateId` (optional): Filter by candidate profile ID
- `status` (optional): Filter by application status (1-7)

**Response (200 OK):**
```json
[
  {
    "id": 25,
    "jobId": 1,
    "jobTitle": null,
    "candidateProfileId": 10,
    "candidateName": null,
    "coverLetter": "I am very interested...",
    "status": 1,
    "createdAt": "2025-12-12T19:45:00Z",
    "updatedAt": null
  }
]
```

---

### 3. Get Application by ID
**GET** `/api/applications/{id}`  
🔒 **Requires Authentication**

**Response (200 OK):**
```json
{
  "id": 25,
  "jobId": 1,
  "jobTitle": "Senior .NET Developer",
  "candidateProfileId": 10,
  "candidateName": "John Doe",
  "coverLetter": "I am very interested...",
  "status": 1,
  "createdAt": "2025-12-12T19:45:00Z",
  "updatedAt": null
}
```

---

### 4. Get Applications by Job ID
**GET** `/api/applications/job/{jobId}`  
🔒 **Requires Authentication**

**Response (200 OK):**
```json
[
  {
    "id": 25,
    "jobId": 1,
    "candidateProfileId": 10,
    "status": 1,
    ...
  },
  {
    "id": 26,
    "jobId": 1,
    "candidateProfileId": 12,
    "status": 2,
    ...
  }
]
```

---

### 5. Get Applications by Candidate ID
**GET** `/api/applications/candidate/{candidateId}`  
🔒 **Requires Authentication**

**Response (200 OK):**
```json
[
  {
    "id": 25,
    "jobId": 1,
    "candidateProfileId": 10,
    "status": 1,
    ...
  },
  {
    "id": 27,
    "jobId": 3,
    "candidateProfileId": 10,
    "status": 3,
    ...
  }
]
```

---

### 6. Update Application Status (Employability Team)
**PATCH** `/api/applications/{id}/status`  
🔒 **Requires Authentication**

**Request Body:**
```json
2
```
(ApplicationStatus enum value: 2 = UnderReview)

**Response (200 OK):**
```json
{
  "id": 25,
  "jobId": 1,
  "candidateProfileId": 10,
  "status": 2,
  "updatedAt": "2025-12-12T20:30:00Z"
}
```

---

### 7. Delete Application (Withdraw)
**DELETE** `/api/applications/{id}`  
🔒 **Requires Authentication**

**Response (204 No Content)**

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 204  | No Content - Delete successful |
| 400  | Bad Request - Invalid data |
| 401  | Unauthorized - Authentication required |
| 404  | Not Found - Resource not found |
| 500  | Internal Server Error - Server error |

---

## 📦 Data Models

### JobDto
```csharp
{
  "id": int,
  "title": string (required, max 200),
  "description": string? (max 2000),
  "companyProfileId": int (required),
  "companyName": string?,
  "location": string? (max 300),
  "jobType": JobType? (enum),
  "experienceLevel": ExperienceLevel? (enum),
  "salary": decimal?,
  "requiredSkills": string? (max 1000),
  "isActive": bool,
  "createdAt": DateTime,
  "updatedAt": DateTime?
}
```

### ApplicationDto
```csharp
{
  "id": int,
  "jobId": int (required),
  "jobTitle": string?,
  "candidateProfileId": int (required),
  "candidateName": string?,
  "coverLetter": string? (max 1000),
  "status": ApplicationStatus (enum, default: Pending),
  "createdAt": DateTime,
  "updatedAt": DateTime?
}
```

---

## 🚀 Testing with Swagger

Access the interactive API documentation at:
```
http://localhost:5001/swagger
```

---

## 🐳 Running with Docker

Build and run the entire stack:
```bash
docker compose up --build -d
```

Access:
- **API**: http://localhost:5001
- **Swagger**: http://localhost:5001/swagger
- **pgAdmin**: http://localhost:5050

---

**Last Updated:** 2025-12-12  
**Author:** Backend Team - JobLink RIWI Project
